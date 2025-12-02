import React from 'react';

const ZeroBalancePopup = ({ show, onRecharge, onClose, isChatMode }) => {
  if (!show) return null;

  return (
    <div className="call-modal-overlay">
      <div className="zero-balance-popup">
        <div className="zero-balance-icon">💰</div>
        <h2 className="zero-balance-title">
          {isChatMode ? 'Chat' : 'Call'} Ended - Zero Balance
        </h2>
        <p className="zero-balance-message">
          Your {isChatMode ? 'chat' : 'call'} has been automatically terminated because your wallet balance reached zero.
        </p>
        <div className="zero-balance-info">
          <p>To continue using our services, please recharge your wallet.</p>
        </div>
        <div className="zero-balance-buttons">
          <button
            className="zero-balance-button zero-balance-button-primary"
            onClick={onRecharge}
          >
            <span>💳</span>
            Recharge Wallet
          </button>
          <button
            className="zero-balance-button zero-balance-button-secondary"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ZeroBalancePopup);