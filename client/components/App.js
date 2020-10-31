import React from 'react';
import { Field, ErrorMessage, withFormik } from 'formik';
import { object, number, boolean } from 'yup';
import { Popover, OverlayTrigger } from 'react-bootstrap';
import { isEmpty, isNumber, omit, uniqueId, maxBy } from 'lodash';
import Select from 'react-select';
import { round, useImmerState } from '../lib/utils';
import { weaponsList, characterList, dmgMultiplierList } from '../lib/presets';
import { getAverageStats, getStats } from '../math';
import { getNimbleDmgReduction, getBFDmgReduction } from '../math/utils';
import Checkbox from './Checkbox';
import '../css/index.scss';

const CommonField = ({ field, ...props }) => (
  <label className="d-block mb-0">
    <div>{props.label}</div>
    <input type={props.type} className="form-control" {...field} {...props} />
    <ErrorMessage name={field.name} component="div" className="app__error" />
  </label>
);

const weaponOptions = weaponsList.map(el => ({ value: el, label: el.name }));
const characterOptions = characterList.map(el => ({ value: el, label: el.characterName }));
const badgeList = [
  { formOption: 'hasDoubleGrip', label: 'Double Grip' },
  { formOption: 'hasDuelist', label: 'Duelist' },
  { formOption: 'hasPuncture', label: 'Puncture' },
  { formOption: 'hasSplitMan', label: 'Split Man' },
  { formOption: 'hasColossus', label: 'Colossus' },
  { formOption: 'hasNineLive', label: 'Nine Live' },
  { formOption: 'hasSteelBrow', label: 'Steel Brow' },
  { formOption: 'hasBattleForged', label: 'BForged' },
  { formOption: 'hasNimble', label: 'Nimble' },
  { formOption: 'hasBoneArmor', label: 'Bone Plating' },
  { formOption: 'hasFurPadding', label: 'Fur Padding' },
  { formOption: 'hasLindwurmCloak', label: 'Lindwurm Cloak' },
].map(el => ({
  ...el,
  id: uniqueId(),
}));

const App = props => {
  const [state, setState] = useImmerState({
    avgHits: null,
    probability: [],
    logs: [],
    selectedWeapon: null,
    selectedCharacter: null,
    selectedDmgMults: [],
    savedResults: [],
    startingPoint: null,
  });

  const {
    avgHits,
    probability,
    logs,
    selectedWeapon,
    selectedCharacter,
    selectedDmgMults,
    savedResults,
    startingPoint,
  } = state;

  const {
    values,
    setFieldValue,
    setSubmitting,
    isSubmitting,
    handleChange,
    setTouched,
    validateForm,
  } = props;

  const getAvgValue = el => (values.useRounds ? el.avgRounds : el.avgHits);
  const sortResultsFn = (a, b) =>
    values.useRounds ? b.avgRounds - a.avgRounds : b.avgHits - a.avgHits;

  const maxStartingPoint = React.useMemo(() => {
    const maximumHitsWeapon = maxBy(savedResults, getAvgValue);
    return maximumHitsWeapon?.id;
  }, [savedResults, values.useRounds]);
  const startingPointValue =
    !isEmpty(savedResults) &&
      savedResults.find(el => el.id === (startingPoint || maxStartingPoint)) |> getAvgValue;

  const setAllTouched = () => {
    const allTouched = Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setTouched(allTouched, false);
  };

  const onCharacterSelect = newSelectedCharacter => {
    setState({ selectedCharacter: newSelectedCharacter });
    if (!newSelectedCharacter) return;
    const availableOptions = Object.keys(values);
    Object.keys(newSelectedCharacter.value)
      .filter(key => availableOptions.includes(key))
      .forEach(key => setFieldValue(key, newSelectedCharacter.value[key], false));
  };

  const onColossusChange = e => {
    if (values.hasColossus) {
      setFieldValue('startHp', Math.round(values.startHp / 1.25));
    } else {
      setFieldValue('startHp', Math.round(values.startHp * 1.25));
    }
    handleChange(e);
  };

  const onLWCloakChange = e => {
    if (values.hasLindwurmCloak) {
      setFieldValue('startArmor', values.startArmor - 40);
    } else {
      setFieldValue('startArmor', values.startArmor + 40);
    }
    handleChange(e);
  };

  const onWeaponSelect = newSelectedWeapon => {
    if (!newSelectedWeapon) {
      setFieldValue('attacksPerRound', 1, false);
      setState({ selectedWeapon: newSelectedWeapon, selectedDmgMults: [] });
      return;
    }

    const availableOptions = Object.keys(values);
    setFieldValue('hasDuelist', false, false);
    setFieldValue('hasDoubleGrip', false, false);
    const canClearCurrentDmgMult = newSelectedWeapon.value.dmgMult !== 1;

    if (canClearCurrentDmgMult) {
      setState({ selectedWeapon: newSelectedWeapon, selectedDmgMults: [] });

      Object.keys(newSelectedWeapon.value)
        .filter(weaponOption => availableOptions.includes(weaponOption))
        .forEach(weaponOption =>
          setFieldValue(weaponOption, newSelectedWeapon.value[weaponOption], false)
        );
    } else {
      setState({ selectedWeapon: newSelectedWeapon });

      Object.keys(newSelectedWeapon.value)
        .filter(weaponOption => availableOptions.includes(weaponOption))
        .filter(weaponOption => weaponOption !== 'dmgMult')
        .forEach(weaponOption =>
          setFieldValue(weaponOption, newSelectedWeapon.value[weaponOption], false)
        );
    }
  };

  const onDmgMultSelect = newSelectedDmgMult => {
    setState({ selectedDmgMults: newSelectedDmgMult });
    if (isEmpty(newSelectedDmgMult)) {
      return setFieldValue('dmgMult', 1, false);
    }
    const combinedDmgMult = newSelectedDmgMult.reduce((acc, { value }) => acc * value, 1);
    setFieldValue('dmgMult', combinedDmgMult, false);
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

  const onCompareModeChange = e => {
    localStorage.setItem('isCompareMode', e.target.checked);
    handleChange(e);
  };

  const onClearSavedResults = () => setState({ savedResults: [], startingPoint: null });
  const onSortSavedResults = () => setState({ savedResults: savedResults.sort(sortResultsFn) });
  const onRemoveResult = id => () =>
    setState({
      savedResults: savedResults.filter(el => el.id !== id),
      startingPoint: startingPoint === id ? null : startingPoint,
    });
  const onSetStartingPoint = id => () => setState({ startingPoint: id });
  const onRemoveStartingPoint = () => setState({ startingPoint: null });

  const onCalculateAll = async () => {
    setAllTouched();
    const errors = await validateForm();
    if (!isEmpty(errors)) return;

    setSubmitting(true);
    const filteredValues = omit(values, [
      'hasDoubleGrip',
      'hasDuelist',
      'hasPuncture',
      'hasSplitMan',
    ]);
    const newSavedResults = weaponsList
      .filter(el => el.isIncludedToAllCalc)
      .map(el => ({
        ...filteredValues,
        ...el,
        dmgMult: values.dmgMult,
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
      .map(options => {
        const badgeOptions = badgeList.reduce(
          (acc, { formOption }) => ({ ...acc, [formOption]: options[formOption] }),
          {}
        );
        const stats = getAverageStats(options);
        return {
          ...badgeOptions,
          id: uniqueId(),
          weaponLabel: options.weaponLabel,
          avgHits: round(stats.avgHits, 2),
          avgRounds: round(stats.avgHits / options.attacksPerRound, 2),
          attacksPerRound: options.attacksPerRound,
          dmgMult: options.dmgMult,
        };
      });

    newSavedResults.sort(sortResultsFn);
    setSubmitting(false);
    setState({ savedResults: newSavedResults, startingPoint: null });
  };

  const onSubmit = async e => {
    e.preventDefault();
    setAllTouched();
    const errors = await validateForm();
    if (!isEmpty(errors)) return;

    setSubmitting(true);
    if (values.isTestMode) {
      const stats = getStats(values);
      setState({
        avgHits: stats.hitsToKill,
        logs: stats.logs,
      });
    } else {
      const stats = getAverageStats(values);
      const defaultWeaponLabel = `Dmg ${values.minDmg}-${values.maxDmg}`;
      const badgeOptions = badgeList.reduce(
        (acc, { formOption }) => ({ ...acc, [formOption]: values[formOption] }),
        {}
      );
      const newResult = {
        id: uniqueId(),
        weaponLabel: selectedWeapon?.label || defaultWeaponLabel,
        avgHits: round(stats.avgHits, 2),
        avgRounds: round(stats.avgHits / values.attacksPerRound, 2),
        attacksPerRound: values.attacksPerRound,
        dmgMult: values.dmgMult,
        ...badgeOptions,
      };

      setState({
        avgHits: round(stats.avgHits, 2),
        savedResults: savedResults.concat(newResult),
        probability: stats.probability,
      });
    }

    setSubmitting(false);
  };

  React.useEffect(() => {
    const orcWarrior = characterOptions.find(el => el.label === 'Orc Warrior');
    onCharacterSelect(orcWarrior);

    const isCompareMode = localStorage.getItem('isCompareMode') === 'true';
    setFieldValue('isCompareMode', isCompareMode, false);
  }, []);

  return (
    <div className="app">
      <div className="container app__container">
        <div className="pt-10 pb-30">
          <div className="d-flex align-items-center justify-content-between mb-20">
            <h1 className="mb-0">Battle Brothers &quot;HitsToKill&quot; Calculator</h1>
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

          <form onSubmit={onSubmit} className="mb-25">
            <h4>Character</h4>
            <div className="row mb-10">
              <div className="col-3">
                <div>Character Preset</div>
                <Select
                  instanceId={1}
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
                {values.hasNimble ? (
                  <Field
                    component={CommonField}
                    name="totalFtg"
                    label="Total Fatigue"
                    type="number"
                  />
                ) : (
                  <Field name="hasLindwurmCloak">
                    {({ field }) => (
                      <Checkbox field={field} label="Lindwurm Cloak" onChange={onLWCloakChange} />
                    )}
                  </Field>
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
              <div className="col-3">
                <Field component={Checkbox} name="hasBoneArmor" label="Bone Plating" />
                <OverlayTrigger
                  trigger={['hover', 'focus']}
                  placement="left"
                  overlay={
                    <Popover>
                      Completely absorbs the first hit of every combat encounter which doesn&apos;t
                      ignore armor
                    </Popover>
                  }
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
                  instanceId={2}
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
              <div className="col-6">
                <div>Dmg Multiplier Preset</div>
                <Select
                  instanceId={3}
                  value={selectedDmgMults}
                  onChange={onDmgMultSelect}
                  options={dmgMultiplierList}
                  placeholder="type for search"
                  isClearable
                  isMulti
                />
              </div>
              <div className="col-3">
                <Field
                  component={CommonField}
                  name="dmgMult"
                  label="Dmg Multiplier"
                  type="number"
                />
              </div>
              {values.isCompareMode && (
                <div className="col-3">
                  <Field
                    component={CommonField}
                    name="attacksPerRound"
                    label="Attacks Per Round"
                    type="number"
                  />
                </div>
              )}
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
              <div className="col-3">
                <Field
                  component={Checkbox}
                  name="hasPuncture"
                  label="Puncture"
                  disabled={values.hasBatter || values.hasSplitMan || values.hasTHFlail}
                />
              </div>
              <div className="col-3">
                <Field
                  component={Checkbox}
                  name="hasTHFlail"
                  label="Three Headed Flail"
                  disabled={values.hasBatter || values.hasSplitMan || values.hasPuncture}
                />
                <OverlayTrigger
                  trigger={['hover', 'focus']}
                  placement="left"
                  overlay={
                    <Popover>
                      Will make 3 separate strikes for 1/3 of the weapon&apos;s damage each
                    </Popover>
                  }
                >
                  <i className="fa fa-question-circle app__tooltip ml-5"></i>
                </OverlayTrigger>
              </div>
            </div>

            <div className="row mb-30">
              <div className="col-3">
                <Field
                  component={Checkbox}
                  name="hasSplitMan"
                  label="Split Man"
                  disabled={values.hasBatter || values.hasPuncture || values.hasTHFlail}
                />
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
                <Field
                  component={Checkbox}
                  name="hasBatter"
                  label="Batter"
                  disabled={values.hasPuncture || values.hasSplitMan || values.hasTHFlail}
                />
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
                <OverlayTrigger
                  trigger={['hover', 'focus']}
                  placement="right"
                  overlay={
                    <Popover>
                      Allows to check the correctness of calculations, by running only 1 test and
                      look how exactly calculation performed
                    </Popover>
                  }
                >
                  <i className="fa fa-question-circle app__tooltip ml-5"></i>
                </OverlayTrigger>
              </div>
              <div className="col-3">
                <Field
                  component={Checkbox}
                  name="isCompareMode"
                  label="Compare Mode"
                  onChange={onCompareModeChange}
                />
                <OverlayTrigger
                  trigger={['hover', 'focus']}
                  placement="right"
                  overlay={
                    <Popover>
                      <span>If active, the </span>
                      <span className="badge badge-success">green badges</span>
                      <span> appears in All Calcs. </span>
                      <span className="badge badge-success">2x</span>
                      <span> badge means that weapon 2x stronger than weapon with </span>
                      <span className="badge badge-success">1x</span>
                      <span> badge.</span>
                      <span> You can set Starting point by clicking at </span>
                      <i className="fa fa-balance-scale blue"></i>
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
            </div>
          </form>

          <div className="row">
            <div className="col-3">
              <h4 className="app__last-calc-title">Last Calculation</h4>
              {avgHits && <div>Avg Hits: {avgHits}</div>}
              {!values.isTestMode && !isEmpty(probability) && (
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
            <div className="col-9">
              <div className="d-flex align-items-center mb-10">
                <h4 className="mb-0">All Calculations</h4>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary ml-10"
                  onClick={onClearSavedResults}
                >
                  Clear Results
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary ml-10"
                  onClick={onSortSavedResults}
                >
                  Sort Results
                </button>
                {values.isCompareMode && (
                  <>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary ml-10"
                      onClick={onRemoveStartingPoint}
                    >
                      Remove Starting Point
                    </button>
                    <div className="ml-10">
                      <Field component={Checkbox} name="useRounds" label="Use Rounds" />
                      <OverlayTrigger
                        trigger={['hover', 'focus']}
                        placement="left"
                        overlay={
                          <Popover>
                            Use AvgRounds intead of AvgHits. It just divides avgHits by 2 for most
                            one-handed weapons, and by 3 for daggers.
                          </Popover>
                        }
                      >
                        <i className="fa fa-question-circle app__tooltip ml-5"></i>
                      </OverlayTrigger>
                    </div>
                  </>
                )}
              </div>
              {savedResults.map(el => (
                <div className="app__saved-result" key={el.id}>
                  <div className="d-flex align-items-center">
                    <span className="mr-5">
                      <b>{el.weaponLabel}</b>: {getAvgValue(el)}
                    </span>
                    {values.isCompareMode && (
                      <span className="badge badge-success ml-10">
                        {round(startingPointValue / getAvgValue(el), 1)}x
                      </span>
                    )}
                    {el.dmgMult !== 1 && (
                      <span className="badge badge-primary ml-10">DmgMult {el.dmgMult}</span>
                    )}
                    {values.useRounds && el.attacksPerRound !== 1 && (
                      <span className="badge badge-primary ml-10">
                        {el.attacksPerRound} Attacks
                      </span>
                    )}
                    {badgeList.map(
                      badge =>
                        el[badge.formOption] && (
                          <span className="badge badge-primary ml-10" key={badge.id}>
                            {badge.label}
                          </span>
                        )
                    )}
                  </div>
                  <div className="app__sr-icons-container">
                    {values.isCompareMode && (
                      <i
                        className="fa fa-balance-scale clickable ml-5 blue app__sr-icon"
                        title="Set Starting Point"
                        onClick={onSetStartingPoint(el.id)}
                      ></i>
                    )}
                    <i
                      className="fa fa-times clickable ml-5 blue app__sr-icon"
                      title="Remove Row"
                      onClick={onRemoveResult(el.id)}
                    ></i>
                    <div className="app__saved-result-bg"></div>
                  </div>
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
    armorPiercingPercent: number().min(0).max(1).required('Required'),
    vsArmorPercent: number().min(0.1).max(4).required('Required'),
    chanceToHitHead: number().min(0).max(1).required('Required'),
    dmgMult: number().min(0).max(3).required('Required'),
    attacksPerRound: number().oneOf([1, 2, 3]).required('Required'),
    hasSteelBrow: boolean(),
    hasBattleForged: boolean(),
    hasNimble: boolean(),
    totalFtg: number()
      .min(0)
      .max(500)
      .when('hasNimble', (hasNimble, schema) => (hasNimble ? schema.required('Required') : schema)),
    hasNineLive: boolean(),
    hasBoneArmor: boolean(),
    hasColossus: boolean(),
    hasDoubleGrip: boolean(),
    hasDuelist: boolean(),
    hasSplitMan: boolean(),
    hasCrossbowMastery: boolean(),
    hasChop: boolean(),
    hasBatter: boolean(),
    hasFurPadding: boolean(),
    hasLindwurmCloak: boolean(),
    hasPuncture: boolean(),
    hasTHFlail: boolean(),
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
    dmgMult: 1,
    attacksPerRound: 1,
    hasSteelBrow: false,
    hasNimble: false,
    hasBattleForged: false,
    totalFtg: 0,
    hasNineLive: false,
    hasBoneArmor: false,
    hasColossus: false,
    hasDoubleGrip: false,
    hasDuelist: false,
    hasSplitMan: false,
    hasCrossbowMastery: false,
    hasChop: false,
    hasBatter: false,
    hasFurPadding: false,
    hasLindwurmCloak: false,
    hasPuncture: false,
    hasTHFlail: false,
    isTestMode: false,
    isCompareMode: false,
    useRounds: false,
  }),
})(App);
