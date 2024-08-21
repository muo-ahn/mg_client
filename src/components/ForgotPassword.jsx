// src/components/ForgotPassword.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { Label } from './ui/Label';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

const ForgotPassword = ({ onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);

  const handleRequestReset = async () => {
    try {
      const response = await axios.post('http://10.0.137.166:8000/auth/password-reset/', {
        phone_number: phoneNumber,
      });
      alert(response.data.message);
      setStep(2);
    } catch (error) {
      console.error('Failed to request password reset:', error);
      alert('Failed to request password reset');
    }
  };

  const handleConfirmReset = async () => {
    try {
      const response = await axios.post('http://10.0.137.166:8000/auth/password-reset-confirm/', {
        token: resetCode,
        new_password: newPassword,
      });
      alert(response.data.message);
      onClose();
    } catch (error) {
      console.error('Failed to reset password:', error);
      alert('Failed to reset password');
    }
  };

  return (
    <div className="forgot-password-modal">
      {step === 1 ? (
        <div>
          <h2 className="text-lg font-bold mb-4">Request Password Reset</h2>
          <div className="mb-4">
            <Label htmlFor="phone_number">Phone Number</Label>
            <Input
              id="phone_number"
              name="phone_number"
              type="text"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <Button onClick={handleRequestReset} className="w-full">Request Reset</Button>
        </div>
      ) : (
        <div>
          <h2 className="text-lg font-bold mb-4">Reset Password</h2>
          <div className="mb-4">
            <Label htmlFor="reset_code">Reset Code</Label>
            <Input
              id="reset_code"
              name="reset_code"
              type="text"
              placeholder="Enter the reset code"
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="new_password">New Password</Label>
            <Input
              id="new_password"
              name="new_password"
              type="password"
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <Button onClick={handleConfirmReset} className="w-full">Reset Password</Button>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
