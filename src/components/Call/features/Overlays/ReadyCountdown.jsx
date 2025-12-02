import React from 'react';

const ReadyCountdown = ({ show, callConnected, isChatMode }) => {
  if (!show || !callConnected) return null;

  return (
    <div className="ready-countdown-overlay">
      <div className="ready-countdown-number">
        {Math.ceil((5000 - (Date.now() % 5000)) / 1000)}
      </div>
      <div className="ready-countdown-text">
        Get Ready! {isChatMode ? 'Chat' : 'Call'} starting soon...
      </div>
    </div>
  );
};

export default React.memo(ReadyCountdown);