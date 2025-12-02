import React from 'react';
import { FiPhone, FiVideo } from 'react-icons/fi';
import { formatTimer } from '../../utils/callHelpers';

const ChatModeHeader = ({
  displayInfo,
  callConnected,
  callDuration,
  onAudioCall,
  onVideoCall,
  onEndChat,
  callEnded,
  isSwitching
}) => {
  console.log('onEndchat', onEndChat);
  return (
    <div className="chat-mode-header">
      <div className="chat-mode-header-content">
        <div className="chat-mode-avatar">
          {displayInfo.initial}
        </div>
        <div className="chat-mode-user-info">
          <h3>{displayInfo.name}</h3>
          <p>{callConnected ? 'Online' : 'Connecting...'}</p>
        </div>
      </div>

      <div className="chat-mode-actions">
        {/* Audio Call Button */}
        {/* <button
          className="chat-mode-call-button audio"
          onClick={onAudioCall}
          disabled={callEnded || !callConnected || isSwitching}
          title="Switch to Audio Call"
        >
          <FiPhone />
        </button> */}

        {/* Video Call Button */}
        {/* <button
          className="chat-mode-call-button video"
          onClick={onVideoCall}
          disabled={callEnded || !callConnected || isSwitching}
          title="Switch to Video Call"
        >
          <FiVideo />
        </button> */}

        <div className="chat-mode-timer">
          <span>⏱</span>
          <span>{formatTimer(callDuration)}</span>
        </div>

        <button
          className="chat-mode-end-button"
          onClick={onEndChat}
          disabled={callEnded}
        >
          <span>✕</span>
          End Chat
        </button>
      </div>
    </div>
  );
};

export default React.memo(ChatModeHeader);