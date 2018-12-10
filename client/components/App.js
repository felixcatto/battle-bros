import './App.scss';
import React from 'react';
import {
  Field, ErrorMessage, withFormik,
} from 'formik';
import * as Yup from 'yup';
import { isEmpty } from 'lodash';
import Select from 'react-select';
import PropTypes from 'prop-types';
import { round } from 'Lib/utils';
import { weaponsList, characterList } from 'Lib/presets';
import { getAverageStats, getEHPStats } from '../math';
import { getNimbleDmgReduction, getBFDmgReduction } from '../math/statsAfterHit';
import Checkbox from './Checkbox';


const validationSchema = Yup.object().shape({
  startHp: Yup.number()
    .min(1)
    .max(500)
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
  dmgPerHit: Yup.number()
    .min(1)
    .max(1000)
    .required('Required'),
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
  hasDoubleGrip: Yup.boolean(),
  hasDuelist: Yup.boolean(),
});

const formikEnhancer = withFormik({
  validationSchema,
  mapPropsToValues: () => ({
    startHp: 65,
    startArmor: '',
    startHelm: '',
    countOfTests: 50000,
    dmgPerHit: 60,
    armorPiercingPercent: 0.3,
    vsArmorPercent: 1,
    chanceToHitHead: 0.25,
    hasSteelBrow: false,
    hasNimble: false,
    hasBattleForged: false,
    totalFtg: 0,
    hasDoubleGrip: false,
    hasDuelist: false,
    isTestMode: false,
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
    EHP: null,
    totalHits: null,
    logs: [],
    selectedWeapon: null,
    selectedCharacter: null,
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

  onDoubleGripChange = (e) => {
    const { handleChange, setFieldValue, values } = this.props;
    if (values.hasDoubleGrip) {
      setFieldValue('dmgPerHit', Math.round(values.dmgPerHit / 1.25));
    } else {
      setFieldValue('dmgPerHit', Math.round(values.dmgPerHit * 1.25));
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
        EHP: round(totalEHP, 1),
        totalHits: round(totalHits, 2),
        logs,
      });
    } else {
      const { totalHits, totalEHP } = getAverageStats(values);
      this.setState({
        EHP: round(totalEHP, 1),
        totalHits: round(totalHits, 2),
      });
    }
  }

  render() {
    const {
      EHP, totalHits, logs, selectedWeapon, selectedCharacter,
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
          <div className="row mb-30">
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

          <h4>Weapon</h4>
          <div className="row mb-30">
            <div className="col-3">
              <div>Weapon Preset</div>
              <Select
                value={selectedWeapon}
                onChange={this.onWeaponSelect}
                options={weaponOptions}
                isClearable
              />
            </div>
          </div>

          <div className="row mb-30">
            <div className="col-3">
              <Field
                component={CommonField}
                name="dmgPerHit"
                label="Average Damage"
                type="number"
              />
            </div>
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

          <h4 className="mb-0">Perks</h4>
          <div className="app__mix-row row align-items-center mb-20">
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
              {values.hasBattleForged && values.startArmor && values.startHelm &&
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
                  {round((1 - getNimbleDmgReduction(values.totalFtg)), 2)}
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
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            Calculate
          </button>

        </form>

        {false && EHP &&
          <div className="mt-20">
            EHP: {EHP}
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
                <div>hp: {el.hp}</div>
                <div>armor: {el.armor}</div>
                <div>helm: {el.helm}</div>
                <div>ehp: {el.ehp}</div>
                <div>*********</div>
              </div>
            ))}
          </div>
        }
      </div>
    );
  }
}


export default formikEnhancer(App);
