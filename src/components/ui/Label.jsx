// src/components/ui/Label.jsx

import React from 'react';
import classNames from 'classnames';

export const Label = ({ children, className, ...props }) => {
  return (
    <label className={classNames('block mb-2 font-bold', className)} {...props}>
      {children}
    </label>
  );
};
