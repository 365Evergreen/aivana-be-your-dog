import React from 'react';
const Tooltip = ({ text, children }) => (
  <span className="tooltip">
    {children}
    <span className="tooltip-text">{text}</span>
  </span>
);
export default Tooltip;
