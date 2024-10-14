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
      const response = await axios.post('https://0nusqdjumd.execute-api.ap-northeast-2.amazonaws.com/default/auth/password-reset/', {
        phone_number: phoneNumber,
      });
      alert(response.data.message);
      setStep(2);
    } catch (error) {
      console.error('Failed to request password reset:', error);
      alert('비밀번호 변경 실패');
    }
  };

  const handleConfirmReset = async () => {
    try {
      const response = await axios.post('https://0nusqdjumd.execute-api.ap-northeast-2.amazonaws.com/default/auth/password-reset-confirm/', {
        token: resetCode,
        new_password: newPassword,
      });
      alert(response.data.message);
      onClose();
    } catch (error) {
      console.error('Failed to reset password:', error);
      alert('비밀번호 변경 실패');
    }
  };

  return (
    <div className="forgot-password-modal">
      {step === 1 ? (
        <div>
          <h2 className="text-lg font-bold mb-4">비밀번호 재설정</h2>
          <div className="mb-4">
            <Label htmlFor="phone_number">전화번호</Label>
            <Input
              id="phone_number"
              name="phone_number"
              type="text"
              placeholder="전화번호 입력"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <Button onClick={handleRequestReset} className="w-full">인증코드 요청</Button>
        </div>
      ) : (
        <div>
          <h2 className="text-lg font-bold mb-4">비밀번호 재설정</h2>
          <div className="mb-4">
            <Label htmlFor="reset_code">인증코드</Label>
            <Input
              id="reset_code"
              name="reset_code"
              type="text"
              placeholder="인증코드 입력"
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="new_password">새 비밀번호</Label>
            <Input
              id="new_password"
              name="new_password"
              type="password"
              placeholder="새 비밀번호 입력"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <Button onClick={handleConfirmReset} className="w-full">비밀번호 재설정 확인</Button>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
