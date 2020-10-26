import React from 'react';
import { Field, ErrorMessage, withFormik, Form } from 'formik';
import { object, number, boolean } from 'yup';
import { Popover, OverlayTrigger } from 'react-bootstrap';
import { isEmpty, isNumber, omit } from 'lodash';
import Select from 'react-select';
import { round, useImmerState } from '../lib/utils';
import { weaponsList, characterList } from '../lib/presets';
import { getAverageStats, getStats } from '../math';
import { getNimbleDmgReduction, getBFDmgReduction } from '../math/utils';
import Checkbox from './Checkbox';

const CommonField = ({ field, ...props }) => (
  <label className="d-block mb-0">
    <div>{props.label}</div>
    <input type={props.type} className="form-control" {...field} {...props} />
    <ErrorMessage name={field.name} component="div" className="app__error" />
  </label>
);

const weaponOptions = weaponsList.map(el => ({ value: el, label: el.name }));
const characterOptions = characterList.map(el => ({ value: el, label: el.characterName }));

const App = props => {
  const [state, setState] = useImmerState({
    avgHits: null,
    probability: [],
    logs: [],
    selectedWeapon: null,
    selectedCharacter: null,
    savedResults: [],
  });
  const { avgHits, probability, logs, selectedWeapon, selectedCharacter, savedResults } = state;
  const {
    values,
    setFieldValue,
    setSubmitting,
    isSubmitting,
    isValid,
    handleChange,
    handleSubmit,
  } = props;
  console.log(props);

  const onCharacterSelect = selectedCharacter => {
    setState({ selectedCharacter });
    if (!selectedCharacter) return;
    const availableOptions = Object.keys(values);
    Object.keys(selectedCharacter.value)
      .filter(key => availableOptions.includes(key))
      .forEach(key => setFieldValue(key, selectedCharacter.value[key], false));
  };

  const onColossusChange = e => {
    if (values.hasColossus) {
      setFieldValue('startHp', Math.round(values.startHp / 1.25));
    } else {
      setFieldValue('startHp', Math.round(values.startHp * 1.25));
    }
    handleChange(e);
  };

  const onWeaponSelect = selectedWeapon => {
    setState({ selectedWeapon });
    if (!selectedWeapon) return;
    const availableOptions = Object.keys(values);
    Object.keys(selectedWeapon.value)
      .filter(key => availableOptions.includes(key))
      .forEach(key => setFieldValue(key, selectedWeapon.value[key], false));
    setFieldValue('hasDuelist', false, false);
    setFieldValue('hasDoubleGrip', false, false);
  };

  const onDoubleGripChange = e => {
    if (values.hasDoubleGrip) {
      setFieldValue('minDmg', Math.round(values.minDmg / 1.25));
      setFieldValue('maxDmg', Math.round(values.maxDmg / 1.25));
    } else {
      setFieldValue('minDmg', Math.round(values.minDmg * 1.25));
      setFieldValue('maxDmg', Math.round(values.maxDmg * 1.25));
    }
    handleChange(e);
  };

  const onDuelistChange = e => {
    if (values.hasDuelist) {
      setFieldValue('armorPiercingPercent', round(values.armorPiercingPercent - 0.25, 2));
    } else {
      setFieldValue('armorPiercingPercent', round(values.armorPiercingPercent + 0.25, 2));
    }
    handleChange(e);
  };

  const onCrossbowMasteryChange = e => {
    if (values.hasCrossbowMastery) {
      setFieldValue('armorPiercingPercent', round(values.armorPiercingPercent - 0.2, 2));
    } else {
      setFieldValue('armorPiercingPercent', round(values.armorPiercingPercent + 0.2, 2));
    }
    handleChange(e);
  };

  const onTestModeChange = e => {
    if (values.isTestMode) {
      setFieldValue('countOfTests', 20000, false);
    } else {
      setFieldValue('countOfTests', 1, false);
    }
    handleChange(e);
  };

  const onCalculateAll = async e => {
    handleSubmit(e);
    if (!isValid) {
      return setSubmitting(false);
    }

    const filteredValues = omit(values, ['hasDoubleGrip', 'hasDuelist']);
    const savedResults = weaponsList
      .filter(el => el.isIncludedToAllCalc)
      .map(el => ({
        ...filteredValues,
        ...el,
        weaponLabel: el.name,
        countOfTests: 5000,
      }))
      .map(el => {
        if (el.useDoubleGrip) {
          return {
            ...el,
            minDmg: Math.round(el.minDmg * 1.25),
            maxDmg: Math.round(el.maxDmg * 1.25),
            hasDoubleGrip: true,
          };
        }
        return el;
      })
      .map(options => ({
        weaponLabel: options.weaponLabel,
        avgHits: round(getAverageStats(options).avgHits, 2),
        hasDoubleGrip: options.hasDoubleGrip,
      }));

    savedResults.sort((a, b) => b.avgHits - a.avgHits);

    setSubmitting(false);
    setState({ savedResults });
  };

  const onClearSavedResults = () => setState({ savedResults: [] });

  const onSubmit = e => {
    handleSubmit(e);
    if (!isValid) {
      return setSubmitting(false);
    }

    if (values.isTestMode) {
      const { hitsToKill, logs } = getStats(values);
      console.log(logs);

      setState({
        avgHits: hitsToKill,
        logs,
      });
    } else if (values.isSaveMode) {
      const { avgHits, probability } = getAverageStats(values);
      const newResult = {
        weaponLabel: selectedWeapon?.label || '?',
        avgHits: round(avgHits, 2),
        hasDoubleGrip: values.hasDoubleGrip,
        hasDuelist: values.hasDuelist,
      };

      setState({
        avgHits: round(avgHits, 2),
        savedResults: savedResults.concat(newResult),
        probability,
      });
    } else {
      const { avgHits, probability } = getAverageStats(values);

      setState({
        avgHits: round(avgHits, 2),
        probability,
      });
    }

    setSubmitting(false);
  };

  React.useEffect(() => {
    const [heavyBro] = characterOptions;
    onCharacterSelect(heavyBro);
  }, []);

  return (
    <div className="app">
      <div className="container app__container">
        <div className="pt-10 pb-30">
          <div className="d-flex align-items-center justify-content-between mb-20">
            <h1 className="mb-0">Battle Brothers "HitsToKill" Calculator</h1>
            <div>
              <div>v1.0.1</div>
              <a
                href="https://github.com/felixcatto/battle-bros"
                target="_blank"
                rel="noopener noreferrer"
              >
                Github Repo
              </a>
            </div>
          </div>

          <form onSubmit={onSubmit}>
            <h4>Character</h4>
            <div className="row mb-10">
              <div className="col-3">
                <div>Character Preset</div>
                <Select
                  value={selectedCharacter}
                  options={characterOptions}
                  onChange={onCharacterSelect}
                  placeholder="type for search"
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
                <Field component={Checkbox} name="hasBattleForged" label="Battle Forged" />
                {values.hasBattleForged &&
                  isNumber(values.startArmor) &&
                  isNumber(values.startHelm) && (
                    <div className="app__perk-value ml-10">
                      {round(getBFDmgReduction(values.startArmor, values.startHelm), 2)}
                    </div>
                  )}
              </div>
              <div className="col-3 d-flex align-items-center">
                <Field component={Checkbox} name="hasNimble" label="Nimble" />
                {values.hasNimble && (
                  <div className="app__perk-value ml-10">
                    {round(getNimbleDmgReduction(values.totalFtg), 2)}
                  </div>
                )}
              </div>
              <div className="col-3">
                {values.hasNimble && (
                  <Field
                    component={CommonField}
                    name="totalFtg"
                    label="Total Fatigue"
                    type="number"
                  />
                )}
              </div>
            </div>

            <div className="row mb-30">
              <div className="col-3">
                <Field component={Checkbox} name="hasNineLive" label="Nine Live" />
              </div>
              <div className="col-3">
                <Field name="hasColossus">
                  {({ field }) => (
                    <Checkbox field={field} label="Colossus" onChange={onColossusChange} />
                  )}
                </Field>
              </div>
              <div className="col-3">
                <Field component={Checkbox} name="hasFurPadding" label="Fur Padding" />
                <OverlayTrigger
                  trigger={['hover', 'focus']}
                  placement="right"
                  overlay={<Popover>Reduces damage ignoring armor by 33%</Popover>}
                >
                  <i className="fa fa-question-circle app__tooltip ml-5"></i>
                </OverlayTrigger>
              </div>
            </div>

            <h4>Weapon</h4>
            <div className="row mb-15">
              <div className="col-3">
                <div>Weapon Preset</div>
                <Select
                  value={selectedWeapon}
                  onChange={onWeaponSelect}
                  options={weaponOptions}
                  placeholder="type for search"
                  isClearable
                />
              </div>
              <div className="col-3">
                <Field component={CommonField} name="minDmg" label="Min Damage" type="number" />
              </div>
              <div className="col-3">
                <Field component={CommonField} name="maxDmg" label="Max Damage" type="number" />
              </div>
            </div>

            <div className="row mb-15">
              <div className="col-3">
                <Field
                  component={CommonField}
                  name="armorPiercingPercent"
                  label="Ignore Armor %"
                  type="number"
                />
              </div>
              <div className="col-3">
                <Field
                  component={CommonField}
                  name="vsArmorPercent"
                  label="Vs Armor %"
                  type="number"
                />
              </div>
              <div className="col-3">
                <Field
                  component={CommonField}
                  name="chanceToHitHead"
                  label="Chance To Hit Head"
                  type="number"
                />
              </div>
            </div>

            <div className="row mb-15">
              <div className="col-3">
                <Field name="hasDoubleGrip">
                  {({ field }) => (
                    <Checkbox field={field} label="Double Grip" onChange={onDoubleGripChange} />
                  )}
                </Field>
              </div>
              <div className="col-3">
                <Field name="hasDuelist">
                  {({ field }) => (
                    <Checkbox field={field} label="Duelist" onChange={onDuelistChange} />
                  )}
                </Field>
              </div>
            </div>

            <div className="row mb-30">
              <div className="col-3">
                <Field component={Checkbox} name="hasSplitMan" label="Split Man" />
              </div>
              <div className="col-3">
                <Field component={Checkbox} name="hasChop" label="Chop" />
                <OverlayTrigger
                  trigger={['hover', 'focus']}
                  placement="right"
                  overlay={<Popover>50% additional damage to HP on a hit to the head</Popover>}
                >
                  <i className="fa fa-question-circle app__tooltip ml-5"></i>
                </OverlayTrigger>
              </div>
              <div className="col-3">
                <Field component={Checkbox} name="hasBatter" label="Batter" />
                <OverlayTrigger
                  trigger={['hover', 'focus']}
                  placement="right"
                  overlay={
                    <Popover>
                      Always inflicts at least 10 HP damage, regardless of current armor
                    </Popover>
                  }
                >
                  <i className="fa fa-question-circle app__tooltip ml-5"></i>
                </OverlayTrigger>
              </div>
              <div className="col-3">
                <Field name="hasCrossbowMastery">
                  {({ field }) => (
                    <Checkbox
                      field={field}
                      label="Crossbow Mastery"
                      onChange={onCrossbowMasteryChange}
                    />
                  )}
                </Field>
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
                  onChange={onTestModeChange}
                />
              </div>
              <div className="col-3">
                <Field component={Checkbox} name="isSaveMode" label="Save Results" />
                <OverlayTrigger
                  trigger={['hover', 'focus']}
                  placement="right"
                  overlay={
                    <Popover>
                      If active, press Calculate on different weapons to compare them.
                    </Popover>
                  }
                >
                  <i className="fa fa-question-circle app__tooltip ml-5"></i>
                </OverlayTrigger>
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
                onClick={onCalculateAll}
              >
                Calculate Some Weapons
              </button>
              {!isEmpty(savedResults) && (
                <button
                  type="button"
                  className="btn btn-outline-primary ml-10"
                  onClick={onClearSavedResults}
                >
                  Clear Results
                </button>
              )}
            </div>
          </form>

          <div className="row">
            <div className="col-6">
              {avgHits && <div className="mt-20">Avg Hits: {avgHits}</div>}
              {!isEmpty(probability) && (
                <div className="mt-20">
                  {probability.map(({ hitsToKill, chance }, i) => (
                    <div key={i}>
                      {hitsToKill} hits: {Math.round(chance * 100)}%
                    </div>
                  ))}
                </div>
              )}
              {values.isTestMode && !isEmpty(logs) && (
                <div className="mt-20">
                  <div>*********</div>
                  {logs.map((el, i) => (
                    <div key={i}>
                      <div>hit to: {el.struckPartName}</div>
                      <div>armor damage: {el.armorDmg}</div>
                      <div>hp damage: {el.dmgToHp}</div>
                      <div>hp: {el.hp}</div>
                      <div>armor: {el.armor}</div>
                      <div>helm: {el.helm}</div>
                      <div>*********</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="col-6">
              {savedResults.map((el, i) => (
                <div className="app__saved-result" key={i}>
                  <span>
                    <b>{el.weaponLabel}</b>: {el.avgHits}
                  </span>
                  {el.hasDoubleGrip && (
                    <span className="badge badge-primary ml-10">Double Grip</span>
                  )}
                  {el.hasDuelist && <span className="badge badge-primary ml-10">Duelist</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withFormik({
  validationSchema: object({
    startHp: number().min(1).max(1000).required('Required'),
    startArmor: number().min(0).max(500).required('Required'),
    startHelm: number().min(0).max(500).required('Required'),
    countOfTests: number().min(1).max(50000).required('Required'),
    minDmg: number()
      .min(1)
      .max(1000)
      .required('Required')
      .test('minDmg', 'minDmg should be lower or equal, than maxDmg', function (minDmg) {
        const { maxDmg } = this.parent;
        return minDmg <= maxDmg;
      }),
    maxDmg: number()
      .min(1)
      .max(1000)
      .required('Required')
      .test('maxDmg', 'maxDmg should be greater or equal, than minDmg', function (maxDmg) {
        const { minDmg } = this.parent;
        return minDmg <= maxDmg;
      }),
    armorPiercingPercent: number().min(0).max(2).required('Required'),
    vsArmorPercent: number().min(0.1).max(4).required('Required'),
    chanceToHitHead: number().min(0).max(1).required('Required'),
    hasSteelBrow: boolean(),
    hasBattleForged: boolean(),
    hasNimble: boolean(),
    totalFtg: number()
      .min(0)
      .max(500)
      .when('hasNimble', (hasNimble, schema) => (hasNimble ? schema.required('Required') : schema)),
    hasNineLive: boolean(),
    hasColossus: boolean(),
    hasDoubleGrip: boolean(),
    hasDuelist: boolean(),
    hasSplitMan: boolean(),
    hasCrossbowMastery: boolean(),
    hasChop: boolean(),
    hasBatter: boolean(),
    hasFurPadding: boolean(),
  }),

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
    isSaveMode: true,
  }),
})(App);
