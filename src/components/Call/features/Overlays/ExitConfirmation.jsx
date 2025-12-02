import React from 'react';

const ExitConfirmation = ({ 
  show, 
  isChatMode, 
  callConnected, 
  onConfirm, 
  onCancel 
}) => {
  if (!show) return null;

  return (
    <div className="call-modal-overlay">
      <div className="exit-confirmation-popup">
        <div className="exit-popup-icon">⚠️</div>
        <h2 className="exit-popup-title">
          Leave Active {isChatMode ? 'Chat' : 'Call'}?
        </h2>
        <p className="exit-popup-message">
          You are currently {callConnected ? 'connected' : 'in an active session'}.
          {isChatMode 
            ? ' If you leave now, the chat will be ended.' 
            : ' If you leave now, the call will be disconnected.'}
        </p>
        <p className="exit-popup-warning">
          This action will end the {isChatMode ? 'chat' : 'call'} for both participants.
        </p>
        <div className="exit-popup-buttons">
          <button
            className="exit-popup-button exit-popup-button-cancel"
            onClick={onCancel}
          >
            <span>←</span>
            Stay in {isChatMode ? 'Chat' : 'Call'}
          </button>
          <button
            className="exit-popup-button exit-popup-button-confirm"
            onClick={onConfirm}
          >
            <span>✕</span>
            End & Leave
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ExitConfirmation);