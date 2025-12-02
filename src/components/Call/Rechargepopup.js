import { useState, useCallback } from 'react';

const RechargePopup = ({
  currentBalance,
  costPerMinute,
  minutesRemaining,
  onRecharge,
  onClose,
  onContinue,
  isLoading = false
}) => {
  const [selectedAmount, setSelectedAmount] = useState(10);
  const [customAmount, setCustomAmount] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [recharging, setRecharging] = useState(false);

  // Preset recharge amounts
  const presetAmounts = [10, 20, 50, 100];

  const handleRecharge = useCallback(async () => {
    const amount = isCustom ? parseFloat(customAmount) : selectedAmount;

    if (!amount || amount < 1) {
      alert('Please enter a valid amount (minimum $1)');
      return;
    }

    setRecharging(true);
    try {
      await onRecharge(amount);
    } finally {
      setRecharging(false);
    }
  }, [isCustom, customAmount, selectedAmount, onRecharge]);

  const estimatedMinutes = useCallback((amount) => {
    return Math.floor(amount / costPerMinute);
  }, [costPerMinute]);

  const isBalanceCritical = currentBalance < costPerMinute;

  return (
    <div className="recharge-popup">
      <div className="recharge-content">
        {/* Warning Icon */}
        <div className={`recharge-icon ${isBalanceCritical ? 'critical' : 'warning'}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>

        {/* Title */}
        <h2 className="recharge-title">
          {isBalanceCritical ? 'Critical: Low Balance!' : 'Low Balance Alert'}
        </h2>

        {/* Balance Info */}
        <div className="recharge-balance-info">
          <div className="balance-item">
            <span className="balance-label">Current Balance:</span>
            <span className={`balance-value ${isBalanceCritical ? 'critical' : 'warning'}`}>
              ${currentBalance.toFixed(2)}
            </span>
          </div>
          <div className="balance-item">
            <span className="balance-label">Call Rate:</span>
            <span className="balance-value">${costPerMinute.toFixed(2)}/min</span>
          </div>
          <div className="balance-item">
            <span className="balance-label">Time Remaining:</span>
            <span className={`balance-value ${minutesRemaining < 2 ? 'critical' : ''}`}>
              ~{minutesRemaining} minute{minutesRemaining !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Warning Message */}
        <p className="recharge-message">
          {isBalanceCritical ? (
            <>
              Your balance is critically low! The call may be disconnected soon. 
              Please recharge immediately to continue.
            </>
          ) : (
            <>
              Your balance is running low. Recharge now to avoid call interruption.
            </>
          )}
        </p>

        {/* Recharge Amount Selection */}
        <div className="recharge-amounts">
          <label className="recharge-label">Select Recharge Amount:</label>
          
          {/* Preset Amounts */}
          <div className="amount-buttons">
            {presetAmounts.map((amount) => (
              <button
                key={amount}
                className={`amount-btn ${!isCustom && selectedAmount === amount ? 'active' : ''}`}
                onClick={() => {
                  setIsCustom(false);
                  setSelectedAmount(amount);
                }}
                disabled={recharging || isLoading}
              >
                <span className="amount-value">${amount}</span>
                <span className="amount-minutes">~{estimatedMinutes(amount)} min</span>
              </button>
            ))}
          </div>

          {/* Custom Amount */}
          <div className="custom-amount">
            <button
              className={`custom-btn ${isCustom ? 'active' : ''}`}
              onClick={() => setIsCustom(true)}
              disabled={recharging || isLoading}
            >
              Custom Amount
            </button>
            
            {isCustom && (
              <div className="custom-input-wrapper">
                <span className="currency-symbol">$</span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  placeholder="Enter amount"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="custom-input"
                  disabled={recharging || isLoading}
                />
                {customAmount && parseFloat(customAmount) >= 1 && (
                  <span className="estimated-minutes">
                    ~{estimatedMinutes(parseFloat(customAmount))} minutes
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="recharge-actions">
          <button
            onClick={handleRecharge}
            className="recharge-btn recharge-btn-primary"
            disabled={recharging || isLoading}
          >
            {recharging || isLoading ? (
              <>
                <span className="spinner-small"></span>
                Processing...
              </>
            ) : (
              'Recharge Now'
            )}
          </button>

          {!isBalanceCritical && (
            <button
              onClick={onContinue}
              className="recharge-btn recharge-btn-secondary"
              disabled={recharging || isLoading}
            >
              Continue Call
            </button>
          )}

          <button
            onClick={onClose}
            className="recharge-btn recharge-btn-text"
            disabled={recharging || isLoading}
          >
            Close
          </button>
        </div>
      </div>

      <style jsx>{`
        .recharge-popup {
          background-color: #1e293b;
          border-radius: 1rem;
          border: 1px solid #334155;
          max-width: 32rem;
          width: 100%;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
          animation: slideUp 0.3s ease-out;
        }

        .recharge-content {
          padding: 2rem 1.5rem;
        }

        .recharge-icon {
          width: 4rem;
          height: 4rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
        }

        .recharge-icon.warning {
          background-color: rgba(245, 158, 11, 0.2);
          color: #f59e0b;
        }

        .recharge-icon.critical {
          background-color: rgba(239, 68, 68, 0.2);
          color: #ef4444;
          animation: pulse 2s infinite;
        }

        .recharge-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .recharge-balance-info {
          background-color: rgba(15, 23, 42, 0.5);
          border-radius: 0.75rem;
          padding: 1rem;
          margin-bottom: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .balance-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .balance-label {
          font-size: 0.875rem;
          color: #94a3b8;
        }

        .balance-value {
          font-size: 1rem;
          font-weight: 600;
          color: #10b981;
        }

        .balance-value.warning {
          color: #f59e0b;
        }

        .balance-value.critical {
          color: #ef4444;
        }

        .recharge-message {
          font-size: 0.9375rem;
          color: #cbd5e1;
          text-align: center;
          margin-bottom: 1.5rem;
          line-height: 1.5;
        }

        .recharge-amounts {
          margin-bottom: 1.5rem;
        }

        .recharge-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: #e2e8f0;
          margin-bottom: 0.75rem;
        }

        .amount-buttons {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .amount-btn {
          padding: 1rem;
          border-radius: 0.5rem;
          border: 2px solid #334155;
          background-color: #0f172a;
          color: white;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
        }

        .amount-btn:hover:not(:disabled) {
          border-color: #3b82f6;
          background-color: #1e293b;
        }

        .amount-btn.active {
          border-color: #3b82f6;
          background-color: rgba(59, 130, 246, 0.1);
        }

        .amount-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .amount-value {
          font-size: 1.25rem;
          font-weight: 700;
        }

        .amount-minutes {
          font-size: 0.75rem;
          color: #94a3b8;
        }

        .custom-amount {
          margin-top: 1rem;
        }

        .custom-btn {
          width: 100%;
          padding: 0.75rem;
          border-radius: 0.5rem;
          border: 2px solid #334155;
          background-color: #0f172a;
          color: white;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.9375rem;
          font-weight: 500;
        }

        .custom-btn:hover:not(:disabled) {
          border-color: #3b82f6;
        }

        .custom-btn.active {
          border-color: #3b82f6;
          background-color: rgba(59, 130, 246, 0.1);
        }

        .custom-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .custom-input-wrapper {
          margin-top: 0.75rem;
          position: relative;
        }

        .currency-symbol {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          font-size: 1rem;
          pointer-events: none;
        }

        .custom-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2rem;
          border-radius: 0.5rem;
          border: 2px solid #334155;
          background-color: #0f172a;
          color: white;
          font-size: 1rem;
          transition: all 0.2s;
        }

        .custom-input:focus {
          outline: none;
          border-color: #3b82f6;
        }

        .custom-input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .estimated-minutes {
          display: block;
          margin-top: 0.5rem;
          font-size: 0.75rem;
          color: #94a3b8;
          text-align: right;
        }

        .recharge-actions {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .recharge-btn {
          padding: 0.875rem 1.5rem;
          border-radius: 0.5rem;
          font-size: 0.9375rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .recharge-btn-primary {
          background-color: #3b82f6;
          color: white;
        }

        .recharge-btn-primary:hover:not(:disabled) {
          background-color: #2563eb;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }

        .recharge-btn-secondary {
          background-color: #475569;
          color: white;
        }

        .recharge-btn-secondary:hover:not(:disabled) {
          background-color: #334155;
        }

        .recharge-btn-text {
          background-color: transparent;
          color: #94a3b8;
        }

        .recharge-btn-text:hover:not(:disabled) {
          color: white;
          background-color: rgba(148, 163, 184, 0.1);
        }

        .recharge-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .spinner-small {
          width: 1rem;
          height: 1rem;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @media (min-width: 640px) {
          .amount-buttons {
            grid-template-columns: repeat(4, 1fr);
          }

          .recharge-actions {
            flex-direction: row;
          }

          .recharge-btn {
            flex: 1;
          }

          .recharge-btn-text {
            flex: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default RechargePopup;


