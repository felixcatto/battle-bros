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
import weaponsList from 'Lib/weaponsList';
import { getAverageEHP, getEHPStats } from '../math';
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
  hasSteelBrow: Yup.boolean(),
  hasNimble: Yup.boolean(),
  hasBattleForged: Yup.boolean(),
  totalFtg: Yup.number()
    .min(0)
    .max(500)
    .when('hasNimble', (hasNimble, schema) => (hasNimble
      ? schema.required('Required')
      : schema
    )),
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
    hasSteelBrow: false,
    hasNimble: false,
    hasBattleForged: false,
    totalFtg: 0,
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

class App extends React.Component {
  static propTypes = {
    setFieldValue: PropTypes.any.isRequired,
    isSubmitting: PropTypes.any.isRequired,
    values: PropTypes.any.isRequired,
  }

  state = {
    isTestMode: true,
    EHP: null,
    logs: [],
    selectedWeapon: null,
  }

  onWeaponSelect = (selectedWeapon) => {
    this.setState({ selectedWeapon });
    if (!selectedWeapon) return;

    const { setFieldValue } = this.props;
    const { dmg, armorPiercingPercent, vsArmorPercent } = selectedWeapon.value;
    setFieldValue('dmgPerHit', dmg);
    setFieldValue('armorPiercingPercent', armorPiercingPercent);
    setFieldValue('vsArmorPercent', vsArmorPercent);
  }

  onTestModeChange = (e) => {
    const { checked } = e.target;
    this.setState({ isTestMode: checked });
  }

  onSubmit = async (e) => {
    e.preventDefault();
    const { setTouched, values, validateForm } = this.props;
    const allTouched = Object.keys(values)
      .reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setTouched(allTouched);

    const errors = await validateForm();

    if (!isEmpty(errors)) return;

    if (this.state.isTestMode) {
      const stats = getEHPStats(values);
      this.setState({
        EHP: stats.totalEHP.toFixed(1),
        logs: stats.logs,
      });
    } else {
      const totalEHP = getAverageEHP(values);
      this.setState({
        EHP: totalEHP.toFixed(1),
      });
    }
  }

  render() {
    const {
      isTestMode, EHP, logs, selectedWeapon,
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

          <div className="row align-items-center mb-30">
            <div className="col-3">
              <Field
                component={CommonField}
                name="countOfTests"
                label="Count Of Tests"
                type="number"
                disabled={isTestMode}
              />
            </div>
            <div className="col-3">
              <Checkbox
                name="isTestMode"
                label="Test Mode"
                field={{ value: isTestMode }}
                onChange={this.onTestModeChange}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            Calculate
          </button>

        </form>

        {EHP &&
          <div className="mt-20">
            EHP: {EHP}
          </div>
        }

        {isTestMode && !isEmpty(logs) &&
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
