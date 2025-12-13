import React from 'react';
import { PrimaryButton, DefaultButton } from '@fluentui/react';

// Small wrapper to ensure consistent app button styling and optional icon slot.
export default function Button({ children, variant, icon, className = '', ...props }) {
  const combined = `app-btn ${variant === 'primary' ? 'app-btn-primary' : 'app-btn-plain'} ${className}`.trim();

  const content = (
    <>
      {icon ? <span className="btn-icon" aria-hidden>{icon}</span> : null}
      <span className="btn-text">{children}</span>
    </>
  );

  if (variant === 'primary') {
    return <PrimaryButton className={combined} {...props}>{content}</PrimaryButton>;
  }
  return <DefaultButton className={combined} {...props}>{content}</DefaultButton>;
}
