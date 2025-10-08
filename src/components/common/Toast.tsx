import React, { useState, useEffect } from 'react';
import './Toast.css';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 300); 
  };

  return (
    <div className={`toast toast-${type} ${isExiting ? 'exit' : ''}`}>
      <div className="toast-message">{message}</div>
      <button className="toast-close-btn" onClick={handleClose}>
        &times;
      </button>
    </div>
  );
};

export default Toast;