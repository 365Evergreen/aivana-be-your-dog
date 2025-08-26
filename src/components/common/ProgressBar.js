import React from 'react';
const ProgressBar = ({ value, max = 100 }) => (
  <div className="progress-bar">
    <div className="progress-bar-fill" style={{ width: `${(value / max) * 100}%` }} />
  </div>
);
export default ProgressBar;
