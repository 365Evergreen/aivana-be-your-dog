import React from 'react';
import { PrimaryButton, DefaultButton } from '@fluentui/react';

export default function Button({ children, variant, ...props }) {
  if (variant === 'primary') {
    return <PrimaryButton {...props}>{children}</PrimaryButton>;
  }
  return <DefaultButton {...props}>{children}</DefaultButton>;
}
