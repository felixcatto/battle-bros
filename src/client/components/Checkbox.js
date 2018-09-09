import './Checkbox.scss';
import React from 'react';


export default ({
  field,
  form: { touched, errors },
  ...props,
}) => (
  <label className="checkbox">
    <input type="checkbox" {...field} {...props} />
    <div className="checkbox__label">{props.label}</div>
  </label>
);
