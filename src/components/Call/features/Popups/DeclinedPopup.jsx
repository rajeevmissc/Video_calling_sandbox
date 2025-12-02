import React from 'react';

const DeclinedPopup = ({ 
  show, 
  isChatMode, 
  declineReason, 
  onTryAgain, 
  onBookAnother 
}) => {
  if (!show) return null;

  return (
    <div className="call-modal-overlay">
      <div className="declined-popup">
        <div className="declined-popup-icon">⚠️</div>
        <h2 className="declined-popup-title">
          {isChatMode ? 'Chat' : 'Call'} Declined
        </h2>
        <p className="declined-popup-message">
          The happiness executive is currently unavailable to take your{' '}
          {isChatMode ? 'chat' : 'call'}.
        </p>
        {declineReason && (
          <div className="declined-popup-reason">
            Reason: {declineReason}
          </div>
        )}
        <div className="declined-popup-buttons">
          <button
            className="declined-popup-button declined-popup-button-secondary"
            onClick={onTryAgain}
          >
            <span>🔄</span>
            Try Again
          </button>
          <button
            className="declined-popup-button declined-popup-button-primary"
            onClick={onBookAnother}
          >
            Book Another {isChatMode ? 'Chat' : 'Call'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(DeclinedPopup);