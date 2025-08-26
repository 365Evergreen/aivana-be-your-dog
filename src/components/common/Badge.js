import React from 'react';
const Badge = ({ children, ...props }) => <span className="badge" {...props}>{children}</span>;
export default Badge;
