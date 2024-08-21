// src/components/ui/Input.jsx

import React from 'react';
import classNames from 'classnames';

export const Input = ({ className, ...props }) => {
  return (
    <input className={classNames('border p-2 w-full rounded', className)} {...props} />
  );
};
