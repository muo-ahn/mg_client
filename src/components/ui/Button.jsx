// src/components/ui/Button.jsx

import React from 'react';
import classNames from 'classnames';
import '../../styles/button.css';

export const Button = ({ children, className, color = 'bg-black', ...props }) => {
  return (
    <button className={classNames('button', color, 'text-white py-2 px-4 rounded', className)} {...props}>
      {children}
    </button>
  );
};
