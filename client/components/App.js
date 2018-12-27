import './App.scss';
import React from 'react';
import {
  Field, ErrorMessage, withFormik,
} from 'formik';
import * as Yup from 'yup';
import { Popover, OverlayTrigger } from 'react-bootstrap';
import { isEmpty, isNumber, omit } from 'lodash';
import Select from 'react-select';
import PropTypes from 'prop-types';
import { round } from 'Lib/utils';
import { weaponsList, characterList } from 'Lib/presets';
import { getAverageStats, getEHPStats } from 'Lib/math';
import { getNimbleDmgReduction, getBFDmgReduction } from 'Lib/math/utils';
import Checkbox from './Checkbox';


const validationSchema = Yup.object().shape({
  startHp: Yup.number()
    .min(1)
    .max(1000)
    .required('Required'),
  startArmor: Yup.number()
    .min(0)
    .max(500)
    .required('Required'),
  startHelm: Yup.number()
    .min(0)
    .max(500)
    .required('Required'),
  countOfTests: Yup.number()
    .min(1)
    .max(50000)
    .required('Required'),
  minDmg: Yup.number()
    .min(1)
    .max(1000)
    .required('Required')
    .test('minDmg', 'minDmg should be lower or equal, than maxDmg', function (minDmg) {
      const { maxDmg } = this.parent;
      return minDmg <= maxDmg;
    }),
  maxDmg: Yup.number()
    .min(1)
    .max(1000)
    .required('Required')
    .test('maxDmg', 'maxDmg should be greater or equal, than minDmg', function (maxDmg) {
      const { minDmg } = this.parent;
      return minDmg <= maxDmg;
    }),
  armorPiercingPercent: Yup.number()
    .min(0)
    .max(2)
    .required('Required'),
  vsArmorPercent: Yup.number()
    .min(0.1)
    .max(4)
    .required('Required'),
  chanceToHitHead: Yup.number()
    .min(0)
    .max(1)
    .required('Required'),
  hasSteelBrow: Yup.boolean(),
  hasBattleForged: Yup.boolean(),
  hasNimble: Yup.boolean(),
  totalFtg: Yup.number()
    .min(0)
    .max(500)
    .when('hasNimble', (hasNimble, schema) => (hasNimble
      ? schema.required('Required')
      : schema
    )),
  hasNineLive: Yup.boolean(),
  hasColossus: Yup.boolean(),
  hasDoubleGrip: Yup.boolean(),
  hasDuelist: Yup.boolean(),
  hasSplitMan: Yup.boolean(),
  hasCrossbowMastery: Yup.boolean(),
  hasChop: Yup.boolean(),
  hasBatter: Yup.boolean(),
  hasFurPadding: Yup.boolean(),
});

const formikEnhancer = withFormik({
  validationSchema,
  mapPropsToValues: () => ({
    startHp: 65,
    startArmor: 0,
    startHelm: 0,
    countOfTests: 20000,
    minDmg: 60,
    maxDmg: 60,
    armorPiercingPercent: 0.3,
    vsArmorPercent: 1,
    chanceToHitHead: 0.25,
    hasSteelBrow: false,
    hasNimble: false,
    hasBattleForged: false,
    totalFtg: 0,
    hasNineLive: false,
    hasColossus: false,
    hasDoubleGrip: false,
    hasDuelist: false,
    hasSplitMan: false,
    hasCrossbowMastery: false,
    hasChop: false,
    hasBatter: false,
    hasFurPadding: false,
    isTestMode: false,
    isSaveMode: false,
  }),
  displayName: 'MyForm',
});

const CommonField = ({ field, ...props }) => (
  <label className="d-block mb-0">
    <div>{props.label}</div>
    <input type={props.type} className="form-control" {...field} {...props} />
    <ErrorMessage name={field.name} component="div" className="app__error" />
  </label>
);

const weaponOptions = weaponsList.map(el => ({
  value: el,
  label: el.name,
}));

const characterOptions = characterList.map(el => ({
  value: el,
  label: el.characterName,
}));

class App extends React.Component {
  static propTypes = {
    setFieldValue: PropTypes.any.isRequired,
    isSubmitting: PropTypes.any.isRequired,
    values: PropTypes.any.isRequired,
    handleChange: PropTypes.any.isRequired,
  }

  state = {
    totalUsedDmg: null,
    totalHits: null,
    logs: [],
    selectedWeapon: null,
    selectedCharacter: null,
    savedResults: [],
  }

  componentDidMount() {
    const [heavyBro] = characterOptions;
    setTimeout(() => this.onCharacterSelect(heavyBro), 50);
  }

  onWeaponSelect = (selectedWeapon) => {
    this.setState({ selectedWeapon });
    if (!selectedWeapon) return;

    const { setFieldValue, values } = this.props;
    const availableOptions = Object.keys(values);
    Object.keys(selectedWeapon.value)
      .filter(key => availableOptions.includes(key))
      .forEach(key => setFieldValue(key, selectedWeapon.value[key], false));
    setFieldValue('hasDuelist', false, false);
    setFieldValue('hasDoubleGrip', false, false);
  }

  onCharacterSelect = (selectedCharacter) => {
    this.setState({ selectedCharacter });
    if (!selectedCharacter) return;

    const { setFieldValue, values } = this.props;
    const availableOptions = Object.keys(values);
    Object.keys(selectedCharacter.value)
      .filter(key => availableOptions.includes(key))
      .forEach(key => setFieldValue(key, selectedCharacter.value[key], false));
  }

  onColossusChange = (e) => {
    const { handleChange, setFieldValue, values } = this.props;
    if (values.hasColossus) {
      setFieldValue('startHp', Math.round(values.startHp / 1.25));
    } else {
      setFieldValue('startHp', Math.round(values.startHp * 1.25));
    }

    handleChange(e);
  }

  onDoubleGripChange = (e) => {
    const { handleChange, setFieldValue, values } = this.props;
    if (values.hasDoubleGrip) {
      setFieldValue('minDmg', Math.round(values.minDmg / 1.25));
      setFieldValue('maxDmg', Math.round(values.maxDmg / 1.25));
    } else {
      setFieldValue('minDmg', Math.round(values.minDmg * 1.25));
      setFieldValue('maxDmg', Math.round(values.maxDmg * 1.25));
    }

    handleChange(e);
  }

  onDuelistChange = (e) => {
    const { handleChange, setFieldValue, values } = this.props;
    if (values.hasDuelist) {
      setFieldValue('armorPiercingPercent', round(values.armorPiercingPercent - 0.25, 2));
    } else {
      setFieldValue('armorPiercingPercent', round(values.armorPiercingPercent + 0.25, 2));
    }

    handleChange(e);
  }

  onCrossbowMasteryChange = (e) => {
    const { handleChange, setFieldValue, values } = this.props;
    if (values.hasCrossbowMastery) {
      setFieldValue('armorPiercingPercent', round(values.armorPiercingPercent - 0.2, 2));
    } else {
      setFieldValue('armorPiercingPercent', round(values.armorPiercingPercent + 0.2, 2));
    }

    handleChange(e);
  }

  onTestModeChange = (e) => {
    const { handleChange, setFieldValue, values } = this.props;
    if (values.isTestMode) {
      setFieldValue('countOfTests', 20000, false);
    } else {
      setFieldValue('countOfTests', 1, false);
    }

    handleChange(e);
  }

  onClearSavedResults = () => {
    this.setState({ savedResults: [] });
  }

  onCalculateAll = async () => {
    const { setTouched, values, validateForm } = this.props;
    const allTouched = Object.keys(values)
      .reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setTouched(allTouched);

    const errors = await validateForm();
    if (!isEmpty(errors)) return;

    const filteredValues = omit(values, ['hasDoubleGrip', 'hasDuelist']);
    const savedResults = weaponsList
      .filter(el => el.isIncludedToAllCalc)
      .map(el => ({
        ...filteredValues,
        ...el,
        weaponLabel: el.name,
        countOfTests: 5000,
      }))
      .map((el) => {
        if (el.useDoubleGripDuelist) {
          return {
            ...el,
            minDmg: Math.round(el.minDmg * 1.25),
            maxDmg: Math.round(el.maxDmg * 1.25),
            armorPiercingPercent: round(el.armorPiercingPercent + 0.25, 2),
            hasDoubleGrip: true,
            hasDuelist: true,
          };
        }
        return el;
      })
      .map(options => ({
        weaponLabel: options.weaponLabel,
        totalHits: round(getAverageStats(options).totalHits, 2),
        hasDoubleGrip: options.hasDoubleGrip,
        hasDuelist: options.hasDuelist,
      }));

    savedResults.sort((a, b) => b.totalHits - a.totalHits);

    this.setState({ savedResults });
  }

  onSubmit = async (e) => {
    e.preventDefault();
    const { setTouched, values, validateForm } = this.props;
    const allTouched = Object.keys(values)
      .reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setTouched(allTouched);

    const errors = await validateForm();

    if (!isEmpty(errors)) return;

    if (values.isTestMode) {
      const { totalHits, totalEHP, logs } = getEHPStats(values);

      this.setState({
        totalUsedDmg: round(totalEHP, 1),
        totalHits: round(totalHits, 2),
        logs,
      });
    } else if (values.isSaveMode) {
      const { totalHits, totalEHP } = getAverageStats(values);
      const { selectedWeapon, savedResults } = this.state;
      const newResult = {
        weaponLabel: selectedWeapon?.label || '?',
        totalHits: round(totalHits, 2),
        hasDoubleGrip: values.hasDoubleGrip,
        hasDuelist: values.hasDuelist,
      };

      this.setState({
        totalUsedDmg: round(totalEHP, 1),
        totalHits: round(totalHits, 2),
        savedResults: savedResults.concat(newResult),
      });
    } else {
      const { totalHits, totalEHP } = getAverageStats(values);

      this.setState({
        totalUsedDmg: round(totalEHP, 1),
        totalHits: round(totalHits, 2),
      });
    }
  }

  render() {
    const {
      totalUsedDmg, totalHits, logs, selectedWeapon, selectedCharacter, savedResults,
    } = this.state;
    const { isSubmitting, values } = this.props;

    return (
      <div className="pt-30 pb-30">
        <div className="d-flex align-items-center justify-content-between mb-20">
          <h1 className="mb-0">Battle Brothers EHP Calculation</h1>
          <a href="https://github.com/felixcatto/battle-bros" target="_blank" rel="noopener noreferrer">
            Github Repo
          </a>
        </div>

        <form onSubmit={this.onSubmit}>

          <h4>Character</h4>
          <div className="row mb-10">
            <div className="col-3">
              <div>Character Preset</div>
              <Select
                value={selectedCharacter}
                onChange={this.onCharacterSelect}
                options={characterOptions}
                isClearable
              />
            </div>
            <div className="col-3">
              <Field component={CommonField} name="startHp" label="HP" type="number" />
            </div>
            <div className="col-3">
              <Field component={CommonField} name="startArmor" label="Body Armor" type="number" />
            </div>
            <div className="col-3">
              <Field component={CommonField} name="startHelm" label="Helm" type="number" />
            </div>
          </div>

          <div className="app__mix-row row align-items-center mb-10">
            <div className="col-3">
              <Field component={Checkbox} name="hasSteelBrow" label="Steel Brow" />
            </div>
            <div className="col-3 d-flex align-items-center">
              <Field
                component={Checkbox}
                name="hasBattleForged"
                label="Battle Forged"
                disabled={values.hasNimble}
              />
              {values.hasBattleForged && isNumber(values.startArmor) && isNumber(values.startHelm) &&
                <div className="app__perk-value ml-10">
                  {round(getBFDmgReduction(values.startArmor, values.startHelm), 2)}
                </div>
              }
            </div>
            <div className="col-3 d-flex align-items-center">
              <Field
                component={Checkbox}
                name="hasNimble"
                label="Nimble"
                disabled={values.hasBattleForged}
              />
              {values.hasNimble &&
                <div className="app__perk-value ml-10">
                  {round(getNimbleDmgReduction(values.totalFtg), 2)}
                </div>
              }
            </div>
            <div className="col-3">
              {values.hasNimble &&
                <Field component={CommonField} name="totalFtg" label="Total Fatigue" type="number" />
              }
            </div>
          </div>

          <div className="row mb-30">
            <div className="col-3">
              <Field
                component={Checkbox}
                name="hasNineLive"
                label="Nine Live"
              />
            </div>
            <div className="col-3">
              <Field
                name="hasColossus"
                render={({ field }) => (
                  <Checkbox field={field} label="Colossus" onChange={this.onColossusChange} />
                )}
              />
            </div>
            <div className="col-3">
              <Field
                component={Checkbox}
                name="hasFurPadding"
                label="Fur Padding"
              />
              <OverlayTrigger trigger="hover" placement="right" overlay={(
                <Popover>
                  Reduces damage ignoring armor by 33%
                </Popover>
              )}>
                <i className="far fa-question-circle app__tooltip ml-5"></i>
              </OverlayTrigger>
            </div>
          </div>

          <h4>Weapon</h4>
          <div className="row mb-15">
            <div className="col-3">
              <div>Weapon Preset</div>
              <Select
                value={selectedWeapon}
                onChange={this.onWeaponSelect}
                options={weaponOptions}
                isClearable
              />
            </div>
            <div className="col-3">
              <Field
                component={CommonField}
                name="minDmg"
                label="Min Damage"
                type="number"
              />
            </div>
            <div className="col-3">
              <Field
                component={CommonField}
                name="maxDmg"
                label="Max Damage"
                type="number"
              />
            </div>
          </div>

          <div className="row mb-15">
            <div className="col-3">
              <Field component={CommonField}
                name="armorPiercingPercent"
                label="Armor Piercing Percent"
                type="number"
              />
            </div>
            <div className="col-3">
              <Field component={CommonField}
                name="vsArmorPercent"
                label="vs Armor Percent"
                type="number"
              />
            </div>
            <div className="col-3">
              <Field component={CommonField}
                name="chanceToHitHead"
                label="Chance To Hit Head"
                type="number"
              />
            </div>
          </div>

          <div className="row mb-15">
            <div className="col-3">
              <Field
                name="hasDoubleGrip"
                render={({ field }) => (
                  <Checkbox field={field} label="Double Grip" onChange={this.onDoubleGripChange} />
                )}
              />
            </div>
            <div className="col-3">
              <Field
                name="hasDuelist"
                render={({ field }) => (
                  <Checkbox field={field} label="Duelist" onChange={this.onDuelistChange} />
                )}
              />
            </div>
          </div>

          <div className="row mb-30">
            <div className="col-3">
              <Field
                component={Checkbox}
                name="hasSplitMan"
                label="Split Man"
              />
            </div>
            <div className="col-3">
              <Field
                component={Checkbox}
                name="hasChop"
                label="Chop"
              />
              <OverlayTrigger trigger="hover" placement="right" overlay={(
                <Popover>
                  50% additional damage to HP on a hit to the head
                </Popover>
              )}>
                <i className="far fa-question-circle app__tooltip ml-5"></i>
              </OverlayTrigger>
            </div>
            <div className="col-3">
              <Field
                component={Checkbox}
                name="hasBatter"
                label="Batter"
              />
              <OverlayTrigger trigger="hover" placement="right" overlay={(
                <Popover>
                  Always inflicts at least 10 HP damage, regardless of current armor
                </Popover>
              )}>
                <i className="far fa-question-circle app__tooltip ml-5"></i>
              </OverlayTrigger>
            </div>
            <div className="col-3">
              <Field
                name="hasCrossbowMastery"
                render={({ field }) => (
                  <Checkbox
                    field={field}
                    label="Crossbow Mastery"
                    onChange={this.onCrossbowMasteryChange}
                  />
                )}
              />
            </div>
          </div>

          <h4>Other</h4>
          <div className="row align-items-center mb-30">
            <div className="col-3">
              <Field
                component={CommonField}
                name="countOfTests"
                label="Count Of Tests"
                type="number"
                disabled={values.isTestMode}
              />
            </div>
            <div className="col-3">
              <Field
                component={Checkbox}
                name="isTestMode"
                label="Test Mode"
                onChange={this.onTestModeChange}
              />
            </div>
            <div className="col-3">
              <Field
                component={Checkbox}
                name="isSaveMode"
                label="Save Results"
              />
            </div>
          </div>

          <div className="d-flex">
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              Calculate
            </button>
            <button
              type="button"
              className="btn btn-outline-primary ml-10"
              disabled={isSubmitting}
              onClick={this.onCalculateAll}
            >
              Calculate Some Weapons
            </button>
            {!isEmpty(savedResults) &&
              <button type="button" className="btn btn-outline-primary ml-10" onClick={this.onClearSavedResults}>
                Clear Results
              </button>
            }
          </div>

        </form>

        <div className="row">
          <div className="col-6">
            {false && totalUsedDmg &&
              <div className="mt-20">
                Total Used Dmg: {totalUsedDmg}
              </div>
            }
            {totalHits &&
              <div className="mt-20">
                Total Hits: {totalHits}
              </div>
            }
            {values.isTestMode && !isEmpty(logs) &&
              <div className="mt-20">
                <div>*********</div>
                {logs.map((el, i) => (
                  <div key={i}>
                    <div>hit to: {el.struckPartName}</div>
                    <div>armor damage: {el.armorDmg}</div>
                    <div>ignore armor: {el.APRDmg}</div>
                    <div>armor overkill: {Math.max(el.armorOverkillWithHead, 0)}</div>
                    <div>hp: {el.hp}</div>
                    <div>armor: {el.armor}</div>
                    <div>helm: {el.helm}</div>
                    <div>used damage: {el.usedDmg}</div>
                    <div>*********</div>
                  </div>
                ))}
              </div>
            }
          </div>
          <div className="col-6">
            {savedResults.map((el, i) => (
              <div className="app__saved-result" key={i}>
                <span><b>{el.weaponLabel}</b>: {el.totalHits}</span>
                {el.hasDoubleGrip &&
                  <span className="badge badge-primary ml-10">Double Grip</span>
                }
                {el.hasDuelist &&
                  <span className="badge badge-primary ml-10">Duelist</span>
                }
              </div>
            ))}
          </div>
        </div>

      </div>
    );
  }
}


export default formikEnhancer(App);
