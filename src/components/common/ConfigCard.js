import React from 'react';
import { Link } from 'react-router-dom';

export default function ConfigCard({ title, meta, description, icon, to = '#', className = '' }) {
  return (
    <Link to={to} className={`config-card ${className}`} style={{ textDecoration: 'none' }}>
      <div className="widget-card" style={{ cursor: 'pointer' }}>
        <div className="widget-icon" aria-hidden>{icon || '📌'}</div>
        <div className="widget-title">{title}</div>
        {meta && <div className="widget-sub" style={{ fontSize: 13, marginTop: 6 }}>{meta}</div>}
        {description && <div style={{ marginTop: 10, color: 'var(--fluent-muted)', fontSize: 14 }}>{description}</div>}
      </div>
    </Link>
  );
}
