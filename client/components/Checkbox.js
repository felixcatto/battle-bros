import './Checkbox.scss';
import React from 'react';

const Checkbox = ({ field, form, ...props }) => (
  <label className="checkbox d-inline-flex align-items-center">
    <input
      type="checkbox"
      className="checkbox__input"
      {...field}
      disabled={props.disabled}
      onChange={props.onChange ? props.onChange : field.onChange}
      checked={field.value}
    />
    <div className="checkbox__visual-box">
      <i className="checkbox__check-mark fa fa-check"></i>
    </div>
    <div className="checkbox__label">{props.label}</div>
  </label>
);

export default Checkbox;
