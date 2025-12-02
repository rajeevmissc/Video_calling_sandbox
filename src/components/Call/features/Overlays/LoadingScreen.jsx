import React from 'react';

const LoadingScreen = ({ isLoading, connectionState, isChatMode }) => {
  if (!isLoading) return null;

  return (
    <div className="call-loading-screen">
      <div className="call-loading-content">
        <div className="call-spinner" />
        <p className="call-loading-title">Joining {isChatMode ? 'chat' : 'call'}...</p>
        <p className="call-loading-status">Status: {connectionState}</p>
        <div className="call-status-badge">
          <div className="call-status-dot" />
          <span>Connecting...</span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(LoadingScreen);