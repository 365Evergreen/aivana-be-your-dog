import React from 'react';

export default function Card({ children, ...props }) {
  return (
    <div {...props} className="card">
      {children}
    </div>
  );
}
