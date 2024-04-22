import React from 'react';
import './success.css';

interface SuccessMessageProps {
  message: string;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({ message }) => {
  return (
    <div className="success-container">
      <p className="success-message">{message}</p>
    </div>
  );
};
