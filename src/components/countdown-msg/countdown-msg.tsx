import React from 'react';
import CountdownTimer from '../countdown-timer/countdown-timer';
import {getPaymentTokenExpiration} from '../../utilities';

export const CountdownMsg: React.FC = () => {
  // Get the expiration timestamp (e.g., from the paymentToken cookie)
  const expirationTimestamp = getPaymentTokenExpiration();
  if (expirationTimestamp) {
    console.log('Payment token expires at:', new Date(expirationTimestamp));
  } else {
    console.log('Payment token not found or expired.');
  }

  return (
    <div>
      {/* Other components */}
      {expirationTimestamp && <CountdownTimer expirationTimestamp={expirationTimestamp} />}
    </div>
  );
};