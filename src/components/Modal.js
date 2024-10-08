// src/components/Modal.js

import React, { useEffect } from 'react';

const Modal = ({ show, onClose, children }) => {
  // Close modal on ESC key press
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

  // Close modal if clicked outside of the content area
  const handleOutsideClick = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      onClose();
    }
  };

  return (
    <div
      className={`modal-overlay fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50 ${show ? 'show' : ''}`} // Add the 'show' class dynamically
      onClick={handleOutsideClick}
    >
      <div
        className={`modal-content bg-white rounded-lg p-6 relative transition-transform transform-gpu duration-300 ${show ? 'show' : ''}`} // Add the 'show' class dynamically
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex="-1"
      >
        <button
          onClick={onClose}
          className="absolute top-0 right-0 mt-2 mr-2 text-gray-500 hover:text-gray-700"
          aria-label="Close modal"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
