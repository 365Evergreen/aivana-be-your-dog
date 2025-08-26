import React from 'react';
const Snackbar = ({ open, message, onClose }) => open ? (
  <div className="snackbar" onClick={onClose}>{message}</div>
) : null;
export default Snackbar;
