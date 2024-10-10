import React, { useEffect } from 'react';

const Modal = ({ show, onClose, children }) => {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (show) {
      document.addEventListener('keydown', handleEscape);
    } else {
      document.removeEventListener('keydown', handleEscape);
    }

    return () => document.removeEventListener('keydown', handleEscape);
  }, [show, onClose]);

  const handleOutsideClick = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      onClose();
    }
  };

  if (!show) {
    return null;
  }

  return (
    <div
      className={`modal-overlay ${show ? 'show' : ''}`}
      onClick={handleOutsideClick}
    >
      <div
        className={`modal-content ${show ? 'show' : ''}`}
        role="dialog"
        aria-modal="true"
      >
        <button onClick={onClose}>&times;</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
