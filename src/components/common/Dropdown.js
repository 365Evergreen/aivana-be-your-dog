import React from 'react';
const Dropdown = ({ options = [], onChange, ...props }) => (
  <select onChange={onChange} {...props}>
    {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
  </select>
);
export default Dropdown;
