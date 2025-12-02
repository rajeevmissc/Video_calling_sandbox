import React, { useEffect } from 'react';
import {
  Wallet,
  AlertCircle,
  CheckCircle,
  RefreshCw,
} from 'lucide-react';
import { useWallet } from '../hooks/useWallet';
import { WALLET_THRESHOLDS } from '../constants/bookingConstants';
import { useNavigate } from 'react-router-dom';

export const WalletCheck = ({ servicePrice, onBalanceChecked, mode }) => {
  const { balance, loading, checkBalance, fetchBalance, error: walletError } = useWallet();
  const navigate = useNavigate();
  console.log('mode', mode)
  // ✅ FIXED: Define requiredBalance BEFORE using it
  const requiredBalance =
  mode === "visit" || mode === undefined
    ? servicePrice * 1
    : servicePrice * WALLET_THRESHOLDS.MIN_BOOKING_MULTIPLIER;


  // const walletStatus = checkBalance(servicePrice);
  const walletStatus = checkBalance(requiredBalance);


  useEffect(() => {
    if (onBalanceChecked && !loading) {
      onBalanceChecked(walletStatus.hasEnoughBalance);
    }
  }, [walletStatus.hasEnoughBalance, loading, onBalanceChecked]);

const handleGoToWallet = () => {
  window.location.replace("/wallet?forceReload=" + Date.now());
};

  const refreshBalance = async () => {
    await fetchBalance();
  };

  /* ==========================
    LOADING STATE
  ========================== */
  if (loading) {
    return (
      <div className="bg-slate-50 rounded-xl p-4 animate-pulse">
        <div className="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
        <div className="h-8 bg-slate-200 rounded w-3/4"></div>
      </div>
    );
  }

  /* ==========================
    ERROR STATE
  ========================== */
  if (walletError) {
    return (
      <div className="bg-red-50 rounded-xl p-4 border-2 border-red-200">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <h3 className="font-semibold text-slate-900">Wallet Error</h3>
        </div>
        <p className="text-sm text-red-700 mb-3">{walletError}</p>

        <button
          onClick={refreshBalance}
          className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    );
  }

  /* ==========================
    MAIN UI
  ========================== */
  return (
    <div
      className={`rounded-xl p-4 border-2 ${walletStatus.hasEnoughBalance
          ? 'bg-green-50 border-green-200'
          : 'bg-red-50 border-red-200'
        }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Wallet
            className={`w-5 h-5 ${walletStatus.hasEnoughBalance ? 'text-green-600' : 'text-red-600'
              }`}
          />
          <h3 className="font-semibold text-slate-900">Wallet Balance</h3>
        </div>

        <button
          onClick={refreshBalance}
          className="p-1 hover:bg-white/50 rounded transition-colors"
          title="Refresh balance"
        >
          <RefreshCw className="w-4 h-4 text-slate-600" />
        </button>
      </div>

      {/* Balance */}
      <div className="space-y-2">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900">
            ₹{balance?.toFixed(2)}
          </span>
          <span className="text-sm text-slate-600">available</span>
        </div>

        {/* Not Enough Balance */}
        {!walletStatus.hasEnoughBalance && (
          <div className="space-y-2">
            <div className="text-sm text-red-700">
              <p className="font-medium">Insufficient Balance</p>
              <p className="text-xs mt-1">
                Required: ₹{requiredBalance.toFixed(2)} (
                {mode === "visit" ? "1× service price" : "5× service price"}
                )
              </p>

              <p className="text-xs">
                Shortfall: ₹{walletStatus.shortfall.toFixed(2)}
              </p>
            </div>

            {/* Navigate to Wallet Button */}
            <button
              onClick={handleGoToWallet}
              className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-sm transition-colors"
            >
              Go to Wallet
            </button>
          </div>
        )}

        {/* Enough Balance */}
        {walletStatus.hasEnoughBalance && (
          <div className="text-sm text-green-700">
            <p className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              <span className="font-medium">Ready to book</span>
            </p>
            <p className="text-xs mt-1">
              ₹{servicePrice.toFixed(2)} will be deducted on confirmation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};