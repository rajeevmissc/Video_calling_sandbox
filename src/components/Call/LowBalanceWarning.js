import React from 'react';
import { AlertTriangle } from 'lucide-react';

const LowBalanceWarning = ({ 
  isOpen, 
  onRecharge, 
  onContinue, 
  currentBalance, 
  requiredAmount,
  callRate 
}) => {
  if (!isOpen) return null;

  const formatAmount = (paise) => `₹${(paise / 100).toFixed(2)}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 md:p-6 z-50">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-[95%] sm:max-w-md mx-auto overflow-hidden animate-fadeIn">
        {/* Header with Icon */}
        <div className="bg-gradient-to-br from-amber-500 to-orange-500 p-4 sm:p-6 text-white text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-white bg-opacity-20 rounded-full mb-2 sm:mb-3">
            <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold">Low Balance Warning</h2>
        </div>
        
        {/* Content */}
        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          {/* Balance Information */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 sm:p-4 space-y-2">
            <div className="flex justify-between items-center gap-2">
              <span className="text-gray-600 text-xs sm:text-sm">Current Balance</span>
              <span className="text-base sm:text-lg font-semibold text-gray-900">
                {formatAmount(currentBalance)}
              </span>
            </div>
            <div className="flex justify-between items-center gap-2">
              <span className="text-gray-600 text-xs sm:text-sm">Required Amount</span>
              <span className="text-base sm:text-lg font-semibold text-amber-600">
                {formatAmount(requiredAmount)}
              </span>
            </div>
            <div className="flex justify-between items-center gap-2 pt-2 border-t border-amber-200">
              <span className="text-gray-600 text-xs sm:text-sm">Call Rate</span>
              <span className="text-xs sm:text-sm font-medium text-gray-700">
                {formatAmount(callRate)}/min
              </span>
            </div>
          </div>

          {/* Warning Message */}
          <div className="flex items-start gap-2 sm:gap-3 bg-amber-50 border-l-4 border-amber-500 p-3 sm:p-4 rounded">
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              The call will continue for now, but please recharge soon to avoid interruption.
            </p>
          </div>
        </div>
        
        {/* Actions */}
        <div className="p-4 sm:p-6 pt-0 flex flex-col gap-2 sm:gap-3">
          <button
            onClick={onRecharge}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:from-amber-700 active:to-orange-700 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg text-sm sm:text-base"
          >
            Recharge Wallet
          </button>
          <button
            onClick={onContinue}
            className="w-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-200 text-sm sm:text-base"
          >
            Continue Call
          </button>
        </div>
      </div>
    </div>
  );
};

export default LowBalanceWarning;