import './App.scss';
import React from 'react';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { getAverageEHP } from '../math';
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

const CommonField = ({
  field,
  form: { touched, errors },
  ...props,
}) => (
  <label className="d-block mb-0">
    <div>{props.label}</div>
    <input type={props.type} className="form-control" {...field} {...props} />
    {errors[field.name] && touched[field.name] ? (
      <div className="app__error">{errors[field.name]}</div>
    ) : null}
  </label>
);

export default class App extends React.Component {
  state = {
    isEHPCalculated: false,
    EHP: null,
  }

  render() {
    const { isEHPCalculated, EHP } = this.state;
    return (
      <div className="app__container container pt-30 pb-30">
        <Formik
          initialValues={{
            startHp: 65,
            startArmor: '',
            startHelm: '',
            countOfTests: 50000,
            dmgPerHit: 60,
            armorPiercingPercent: 0.3,
            hasSteelBrow: false,
            hasNimble: false,
            hasBattleForged: false,
            totalFtg: 0
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            const EHP = getAverageEHP(values)
              |> (_ => _.toFixed(1));
            this.setState({
              isEHPCalculated: true,
              EHP,
            });
            setSubmitting(false);
          }}
        >
          {({ errors, touched, isSubmitting, values }) => (
            <Form>
              <div className="row mb-20">
                <div className="col-3">
                  <Field component={CommonField} name="startHp" label="HP" type="number" />
                </div>
                <div className="col-3">
                  <Field component={CommonField} name="startArmor" label="Body Armor" type="number" />
                </div>
                <div className="col-3">
                  <Field component={CommonField} name="startHelm" label="Helm" type="number" />
                </div>
                <div className="col-3">
                  <Field component={CommonField} name="countOfTests" label="Count Of Tests" type="number" />
                </div>
              </div>

              <div className="row mb-20">
                <div className="col-3">
                  <Field component={CommonField} name="dmgPerHit" label="Damage Per Hit" type="number" />
                </div>
                <div className="col-3">
                  <Field component={CommonField}
                    name="armorPiercingPercent"
                    label="Armor Piercing Percent"
                    type="number"
                  />
                </div>
              </div>

              <div className="row mb-20">
                <div className="col-3">
                  <Field
                    component={Checkbox}
                    name="hasSteelBrow"
                    className="checkbox__input"
                    label="Has Steel Brow"
                  />
                </div>
                <div className="col-3">
                  <Field
                    component={Checkbox}
                    name="hasNimble"
                    className="checkbox__input"
                    label="Has Nimble"
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
                    className="checkbox__input"
                    label="Has Battle Forged"
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                Calculate
              </button>
            </Form>
          )}
        </Formik>

        {isEHPCalculated &&
          <div className="mt-20">
            EHP: {EHP}
          </div>
        }
      </div>
    );
  }
}
