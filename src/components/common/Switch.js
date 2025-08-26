import React from 'react';
const Switch = ({ checked, ...props }) => (
  <label className="switch">
    <input type="checkbox" checked={checked} {...props} />
    <span className="slider" />
  </label>
);
export default Switch;
