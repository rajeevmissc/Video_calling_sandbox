import React from 'react';
import { formatWaitingTime } from '../../utils/callHelpers';

const ChatModeOverlay = ({ 
  isWaiting, 
  callEnded, 
  waitingTime 
}) => {
  if (!isWaiting || callEnded) return null;

  return (
    <div className="chat-mode-loading-overlay" style={{ zIndex: 100 }}>
      <div className="chat-loading-spinner"></div>
      <div className="chat-loading-content">
        <h2 className="chat-loading-title">Waiting for Happiness Executive</h2>
        <p className="chat-loading-message">
          Your chat request has been sent. A happiness executive will join shortly to assist you.
        </p>
        <div className="chat-loading-status">
          <div className="chat-loading-pulse-dot"></div>
          <span>Waiting... {formatWaitingTime(waitingTime)}</span>
        </div>
        {waitingTime > 60 && (
          <p className="chat-loading-timeout-warning">
            Auto-declining in {120 - waitingTime} seconds if no response...
          </p>
        )}
      </div>
    </div>
  );
};

export default React.memo(ChatModeOverlay);