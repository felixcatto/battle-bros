import './App.scss';
import React from 'react';
import {
  Formik, Field, Form, ErrorMessage,
} from 'formik';
import * as Yup from 'yup';
import { isEmpty } from 'lodash';
import { getAverageEHP, getEHPStats } from '../math';
import Checkbox from './Checkbox';


const validationSchema = Yup.object().shape({
  startHp: Yup.number()
    .min(0)
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
    .min(0)
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

const CommonField = ({ field, ...props }) => (
  <label className="d-block mb-0">
    <div>{props.label}</div>
    <input type={props.type} className="form-control" {...field} {...props} />
    <ErrorMessage name={field.name} component="div" className="app__error" />
  </label>
);

export default class App extends React.Component {
  state = {
    EHP: null,
    logs: [],
  }

  render() {
    const { isTestMode, EHP, logs } = this.state;
    return (
      <div className="app__container container pt-30 pb-30">
        <h1 className="mb-20">Battle Brothers EHP Calculation</h1>
        <Formik
          initialValues={{
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
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            if (values.isTestMode) {
              const stats = getEHPStats(values);
              this.setState({
                isTestMode: true,
                EHP: stats.totalEHP.toFixed(1),
                logs: stats.logs,
              });
            } else {
              const totalEHP = getAverageEHP(values);
              this.setState({
                isTestMode: false,
                EHP: totalEHP.toFixed(1),
              });
            }

            setSubmitting(false);
          }}
        >
          {({
            isSubmitting, values,
          }) => (
            <Form>

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

              <h4>Perks</h4>

              <div className="row mb-20">
                <div className="col-3">
                  <Field component={Checkbox} name="hasSteelBrow" label="Steel Brow" />
                </div>
                <div className="col-3">
                  <Field
                    component={Checkbox}
                    name="hasNimble"
                    label="Nimble"
                    disabled={values.hasBattleForged}
                  />

                  {values.hasNimble &&
                    <div className="mt-20">
                      <Field component={CommonField} name="totalFtg" label="Total Fatigue" type="number" />
                    </div>
                  }
                </div>
                <div className="col-3">
                  <Field
                    component={Checkbox}
                    name="hasBattleForged"
                    label="Battle Forged"
                    disabled={values.hasNimble}
                  />
                </div>
              </div>

              <div className="row mb-30">
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
                  <div className="pt-25">
                    <Field component={Checkbox} name="isTestMode" label="Test Mode" />
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                Calculate
              </button>
            </Form>
          )}
        </Formik>

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
