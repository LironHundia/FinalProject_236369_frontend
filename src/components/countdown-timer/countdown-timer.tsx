// CountdownTimer.tsx
import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';

interface CountdownTimerProps {
  setTimesUp: (value: boolean) => void;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ setTimesUp }) => {
  const expirationTimestamp = parseInt(localStorage.getItem('expirationTimestamp') || '0', 10);
  const [remainingTime, setRemainingTime] = useState<number>(Math.max(0, Math.floor((expirationTimestamp - Date.now()) / 1000)));

  useEffect(() => {
    const intervalId = setInterval(() => {
      setRemainingTime((prevTime) => Math.max(0, prevTime - 1));
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (remainingTime === 0) {
      setTimesUp(true);
    }
  },[remainingTime]);

  return (
    <Typography
      variant="h5"
      sx={{ color: remainingTime === 0 ? 'red' : 'inherit' }}
    >
      Time remaining: {remainingTime} seconds
    </Typography>
  );
};