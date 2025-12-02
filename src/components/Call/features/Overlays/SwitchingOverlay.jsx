import React from 'react';

const SwitchingOverlay = ({ isSwitching, switchingToType }) => {
  if (!isSwitching) return null;

  return (
    <div className="switching-overlay">
      <div className="switching-icon">
        {switchingToType === 'audio' ? '🎙️' : '📹'}
      </div>
      <h2 className="switching-title">
        Switching to {switchingToType === 'audio' ? 'Audio' : 'Video'} Call
      </h2>
      <p className="switching-message">
        Please wait while we prepare your {switchingToType} call...
      </p>
    </div>
  );
};

export default React.memo(SwitchingOverlay);