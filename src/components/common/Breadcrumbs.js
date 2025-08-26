import React from 'react';
const Breadcrumbs = ({ items = [] }) => (
  <nav className="breadcrumbs">
    {items.map((item, i) => (
      <span key={item.label}>
        {i > 0 && ' / '}
        <a href={item.href}>{item.label}</a>
      </span>
    ))}
  </nav>
);
export default Breadcrumbs;
