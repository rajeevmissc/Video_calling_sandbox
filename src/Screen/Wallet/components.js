import { memo, useState, useCallback, useMemo } from 'react';
import {
  Plus, Lock, RefreshCw, CheckCircle, AlertCircle, X,
  ArrowRight, Shield, Search, Download, Receipt, History,
  Phone, Video, MapPin, Wallet
} from 'lucide-react';
import { FaRupeeSign } from 'react-icons/fa';
import Loder from '../../components/Loading';
import { useWallet, useToast } from './contexts';
import {
  PAYMENT_OPTIONS,
  QUICK_AMOUNTS,
  formatCurrency,
  formatDate,
  getServiceIcon,
  getCashfreePaymentMethods
} from './constants';

// ==================== PAYMENT METHOD OPTION ====================
const PaymentMethodOption = memo(({ option, isSelected, onToggle }) => {
  const Icon = option.icon;

  return (
    <div
      onClick={onToggle}
      className={`p-3 border rounded-xl cursor-pointer transition-all ${
        isSelected
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-100' : 'bg-gray-100'}`}>
            <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="font-medium text-sm truncate">{option.name}</span>
              {option.popular && (
                <span className="px-1.5 py-0.5 bg-green-100 text-green-800 text-xs rounded-full flex-shrink-0">
                  Popular
                </span>
              )}
            </div>
            <p className="text-xs text-gray-600 truncate">{option.description}</p>
          </div>
        </div>
        <div
          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
            isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
          }`}
        >
          {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
        </div>
      </div>
    </div>
  );
});

// ==================== PAYMENT METHOD SELECTOR ====================
export const PaymentMethodSelector = memo(({
  selectedMethods,
  onMethodsChange,
  onProceed,
  amount,
  isLoading
}) => {
  const handleMethodToggle = useCallback((methodId) => {
    const newMethods = selectedMethods.includes(methodId)
      ? selectedMethods.filter(id => id !== methodId)
      : [...selectedMethods, methodId];
    onMethodsChange(newMethods);
  }, [selectedMethods, onMethodsChange]);

  const handleProceed = useCallback(() => {
    const cashfreePaymentMethods = getCashfreePaymentMethods(selectedMethods);
    onProceed(selectedMethods);
  }, [selectedMethods, onProceed]);

  return (
    <div className="bg-[#F0F0F0] space-y-4">
      <div className="space-y-2 max-h-full overflow-y-auto">
        {PAYMENT_OPTIONS.map((option) => (
          <PaymentMethodOption
            key={option.id}
            option={option}
            isSelected={selectedMethods.includes(option.id)}
            onToggle={() => handleMethodToggle(option.id)}
          />
        ))}
      </div>

      <div className="p-3 bg-green-50 rounded-xl">
        <div className="flex items-center justify-between">
          <span className="font-medium text-sm text-green-800">Amount to Add:</span>
          <span className="font-bold text-lg text-green-600">{formatCurrency(amount)}</span>
        </div>
      </div>

      <button
        onClick={handleProceed}
        disabled={selectedMethods.length === 0 || isLoading}
        className="w-full py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
      >
        {isLoading ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Lock className="w-4 h-4" />
            Proceed to Secure Checkout
          </>
        )}
      </button>
    </div>
  );
});

// ==================== QUICK AMOUNT BUTTON ====================
const QuickAmountButton = memo(({ amount, onClick }) => (
  <button
    onClick={() => onClick(amount)}
    className="bg-white p-2 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all"
  >
    <div className="font-bold text-sm">₹{amount.toLocaleString('en-IN')}</div>
    <div className="text-xs text-gray-500">Quick Add</div>
  </button>
));

// ==================== RECHARGE FORM ====================
export const RechargeForm = memo(() => {
  const { balance, rechargeWallet, isLoading } = useWallet();
  const { showError } = useToast();
  const [amount, setAmount] = useState('');
  const [selectedMethods, setSelectedMethods] = useState(['card']);
  const [showCheckout, setShowCheckout] = useState(false);

  const handleQuickAmount = useCallback((quickAmount) => {
    setAmount(quickAmount.toString());
    setShowCheckout(true);
  }, []);

  const handleProceedToCheckout = useCallback(async (paymentMethods) => {
    const rechargeAmount = parseFloat(amount);

    if (!rechargeAmount || rechargeAmount < 1) {
      showError('Please enter a valid amount');
      return;
    }

    if (rechargeAmount > 50000) {
      showError('Maximum recharge limit is ₹50,000');
      return;
    }

    if (paymentMethods.length === 0) {
      showError('Please select at least one payment method');
      return;
    }

    await rechargeWallet(rechargeAmount, paymentMethods);
  }, [amount, rechargeWallet, showError]);

  if (showCheckout) {
    return (
      <div className="bg-[#F0F0F0] h-full rounded-2xl shadow-lg border p-4">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => setShowCheckout(false)}
            className="p-1.5 hover:bg-gray-100 rounded-lg"
          >
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex flex-col leading-tight">
            <h3 className="text-lg font-bold text-gray-900">Select Payment Method</h3>
            <p className="text-xs text-gray-600">Choose how you want to pay</p>
          </div>
        </div>

        <PaymentMethodSelector
          selectedMethods={selectedMethods}
          onMethodsChange={setSelectedMethods}
          onProceed={handleProceedToCheckout}
          amount={parseFloat(amount) || 0}
          isLoading={isLoading}
        />
      </div>
    );
  }

  return (
    <div className="bg-[#F0F0F0] rounded-2xl shadow-lg border p-4">
      <div className="flex items-center gap-2 p-2">
        <Wallet className="w-5 h-5 text-gray-900" />
        <h2 className="text-lg font-bold text-gray-900">Add Money to Wallet</h2>
      </div>

      <div className="p-3 bg-blue-50 rounded-xl mb-4">
        <div className="flex items-center justify-between">
          <span className="font-medium text-sm text-blue-800">Current Balance:</span>
          <span className="font-bold text-blue-600">{formatCurrency(balance)}</span>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Quick Select</label>
        <div className="grid grid-cols-2 gap-2">
          {QUICK_AMOUNTS.map((quickAmount) => (
            <QuickAmountButton
              key={quickAmount}
              amount={quickAmount}
              onClick={handleQuickAmount}
            />
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Custom Amount</label>
        <div className="relative">
          <FaRupeeSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount (₹1 - ₹50,000)"
            min="1"
            max="50000"
            className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-sm"
          />
        </div>
      </div>

      <button
        onClick={() => setShowCheckout(true)}
        disabled={!amount || parseFloat(amount) < 1 || parseFloat(amount) > 50000}
        className="w-full py-3 bg-[#1A1A1A] text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
      >
        <Plus className="w-4 h-4" />
        Add {amount ? formatCurrency(parseFloat(amount)) : '₹0'}
      </button>
      <div className="mt-4 flex items-center justify-center gap-1 text-xs text-gray-500">
        <Shield className="w-3 h-3" />
        <span>Powered by Cashfree • Bank-level security</span>
      </div>
    </div>
  );
});

// ==================== TRANSACTION ITEM ====================
export const TransactionItem = memo(({ transaction, detailed = false }) => {
  const ServiceIcon = getServiceIcon(transaction.serviceType);

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div
          className={`p-2 rounded-lg ${
            transaction.type === 'credit'
              ? 'bg-green-100 text-green-600'
              : 'bg-red-100 text-red-600'
          }`}
        >
          <ServiceIcon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm text-gray-900 truncate">
            {transaction.description}
          </div>
          <div className="text-xs text-gray-500">
            {formatDate(transaction.timestamp)}
          </div>
          {detailed && transaction.reference && (
            <div className="text-xs text-gray-400 truncate">
              Ref: {transaction.reference}
            </div>
          )}
        </div>
      </div>
      <div className="text-right flex-shrink-0 ml-2">
        <div
          className={`font-bold text-sm ${
            transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
        </div>
        <div
          className={`text-xs px-1.5 py-0.5 rounded-full ${
            transaction.status === 'completed'
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {transaction.status || 'completed'}
        </div>
      </div>
    </div>
  );
});

// ==================== RECHARGE MODAL ====================
export const RechargeModal = memo(({ onClose }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm border max-h-[90vh] overflow-hidden relative">
      <button
        onClick={onClose}
        className="p-1.5 bg-white hover:bg-red-500 rounded-lg absolute top-2 right-2"
        aria-label="Close modal"
      >
        <X className="w-4 h-4" />
      </button>
      <div className="overflow-y-auto max-h-[calc(90vh-40px)]">
        <RechargeForm />
      </div>
    </div>
  </div>
));

// ==================== SERVICE BOOKING WITH WALLET ====================
export const ServiceBookingWithWallet = memo(({ provider, mode, onClose }) => {
  const { balance, deductFromWallet, isLoading } = useWallet();
  const { showSuccess, showError } = useToast();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const servicePrice = useMemo(() => provider.price?.[mode] || 0, [provider.price, mode]);
  const hasInsufficientBalance = useMemo(() => balance < servicePrice, [balance, servicePrice]);
  const balanceAfterPayment = useMemo(() => balance - servicePrice, [balance, servicePrice]);

  const handleBooking = useCallback(async () => {
    if (hasInsufficientBalance) {
      showError('Insufficient wallet balance');
      return;
    }

    try {
      await deductFromWallet(
        servicePrice,
        `${mode.charAt(0).toUpperCase() + mode.slice(1)} Service - ${provider.name}`,
        {
          serviceType: mode,
          providerId: provider._id,
          serviceId: `service_${Date.now()}`,
          metadata: {
            providerName: provider.name,
            serviceMode: mode,
            bookingTime: new Date().toISOString()
          }
        }
      );

      setShowConfirmation(false);
      setBookingSuccess(true);

      setTimeout(() => {
        setBookingSuccess(false);
        onClose();
      }, 3000);
    } catch (error) {
      console.error('Booking failed:', error);
    }
  }, [hasInsufficientBalance, deductFromWallet, servicePrice, mode, provider, showError, onClose]);

  if (bookingSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-lg max-w-sm w-full p-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
          <p className="text-gray-600 text-sm mb-3">Your service has been booked successfully</p>
          <div className="text-xs text-gray-500">
            Payment of {formatCurrency(servicePrice)} deducted from wallet
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-sm w-full border">
        {!showConfirmation ? (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Book Service</h3>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-gray-100 rounded-lg"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mb-4 p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  {provider.name?.charAt(0) || 'P'}
                </div>
                <div>
                  <div className="font-medium text-sm">{provider.name}</div>
                  <div className="text-xs text-gray-600 capitalize">{mode} Consultation</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">Service Fee:</span>
                <span className="font-bold text-base">{formatCurrency(servicePrice)}</span>
              </div>
            </div>

            <div className="mb-4 p-3 bg-blue-50 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm text-blue-800">Wallet Balance:</span>
                <span className="font-bold text-base text-blue-600">{formatCurrency(balance)}</span>
              </div>
              {hasInsufficientBalance && (
                <div className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Insufficient balance. Please add money.
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium text-sm transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowConfirmation(true)}
                disabled={hasInsufficientBalance}
                className="flex-1 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {hasInsufficientBalance ? 'Insufficient' : 'Proceed to Pay'}
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">Confirm Payment</h3>

            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between">
                <span>Service Fee:</span>
                <span className="font-bold">{formatCurrency(servicePrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Current Balance:</span>
                <span className="font-bold">{formatCurrency(balance)}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between font-bold">
                <span>Balance After:</span>
                <span className="text-blue-600">{formatCurrency(balanceAfterPayment)}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium text-sm transition-all"
              >
                Back
              </button>
              <button
                onClick={handleBooking}
                disabled={isLoading}
                className="flex-1 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-1 text-sm"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Confirm Payment'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});