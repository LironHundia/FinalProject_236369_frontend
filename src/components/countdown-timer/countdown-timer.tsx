// CountdownTimer.tsx
import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  expirationTimestamp: number; // Expiration timestamp in milliseconds
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ expirationTimestamp }) => {
  const [remainingTime, setRemainingTime] = useState<number>(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentTime = Date.now();
      const timeDifference = expirationTimestamp - currentTime;
      setRemainingTime(Math.max(0, Math.floor(timeDifference / 1000))); // Convert to seconds
    }, 1000);

    return () => clearInterval(intervalId);
  }, [expirationTimestamp]);

  return (
    <div>
      {remainingTime > 0 ? (
        <p>Time remaining: {remainingTime} seconds</p>
      ) : (
        <p>Token has expired.</p>
      )}
    </div>
  );
};

export default CountdownTimer;
