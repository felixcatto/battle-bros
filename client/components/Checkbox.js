import './Checkbox.scss';
import React from 'react';


const Checkbox = ({ field, ...props }) => (
  <label className="checkbox">
    <input type="checkbox" className="checkbox__input" {...field} {...props} />
    <div className="checkbox__label">{props.label}</div>
  </label>
);

export default Checkbox;
