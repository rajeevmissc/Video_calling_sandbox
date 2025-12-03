import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import {
  Wallet, RefreshCw, Bell, Plus, Eye, EyeOff,
  ArrowUpRight, ArrowDownLeft, Receipt, CheckCircle,
  AlertCircle, CreditCard, Shield, ExternalLink, History,
  Search, X, Download,Gift  
} from 'lucide-react';
import Loder from '../../components/Loading';
import { useWallet, useToast } from './contexts';
import { RechargeForm, TransactionItem, RechargeModal } from './components';
import { formatCurrency, formatDate } from './constants';
import { walletAPI } from './services';
import { useWallet as useGlobalWallet } from '../Booking/hooks/useWallet';

// ==================== PAYMENT SUCCESS PAGE ====================
// ==================== PAYMENT SUCCESS PAGE ====================
export const PaymentSuccessPage = memo(({ onReturnToWallet }) => {
  const { refreshWallet } = useWallet();
  const { showSuccess } = useToast();
  const [isProcessing, setIsProcessing] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [error, setError] = useState(null);
  
  const { fetchBalance: refreshHeaderWallet } = useGlobalWallet();

  useEffect(() => {
    const processPayment = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const orderId = urlParams.get('order_id');

      if (!orderId) {
        setError('No order ID found');
        setIsProcessing(false);
        return;
      }

      try {
        const response = await walletAPI.verifyPaymentSession(orderId);

        if (response.success) {
          // 🔥 NEW: Extract breakdown from response
          const totalWalletCredit = response.data.totalWalletCredit || response.data.amount;
          const baseAmount = response.data.baseAmount || response.data.amount;
          const bonusAmount = response.data.bonusAmount || 0;
          
          // Credit the wallet with total amount (base + bonus)
          await walletAPI.rechargeWallet(totalWalletCredit, orderId);
          await refreshWallet();
          await refreshHeaderWallet();
          
          // 🔥 NEW: Store detailed payment info
          setPaymentDetails({ 
            amount: totalWalletCredit,
            baseAmount: baseAmount,
            bonusAmount: bonusAmount,
            orderId, 
            status: 'success' 
          });
          
          showSuccess(`₹${totalWalletCredit} added to your wallet!`);
        } else {
          throw new Error('Payment verification failed');
        }
      } catch (err) {
        console.error('Payment processing error:', err);
        setError(err.message || 'Failed to process payment');
      } finally {
        setIsProcessing(false);
      }
    };

    processPayment();
  }, [refreshWallet, showSuccess, refreshHeaderWallet]);

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/40 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg max-w-sm w-full p-6 text-center">
          <Loder />
          <h2 className="text-xl font-bold mb-2 mt-4">Processing Payment</h2>
          <p className="text-gray-600 text-sm">Please wait while we confirm your transaction...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/40 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg max-w-sm w-full p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
          <h2 className="text-xl font-bold mb-2">Payment Failed</h2>
          <p className="text-gray-600 text-sm mb-4">{error}</p>
          <button
            onClick={onReturnToWallet}
            className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 font-medium text-sm"
          >
            Return to Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-sm w-full p-6 text-center">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <CheckCircle className="w-6 h-6 text-green-600" />
        </div>
        <h2 className="text-xl font-bold mb-2">Payment Successful!</h2>
        <p className="text-gray-600 text-sm mb-4">Your wallet has been recharged successfully</p>

        {paymentDetails && (
          <div className="bg-gray-50 rounded-xl p-4 mb-4 text-left space-y-2">
            {/* 🔥 NEW: Show bonus breakdown if exists */}
            {paymentDetails.bonusAmount > 0 && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Base Amount:</span>
                  <span className="font-semibold text-gray-900">₹{paymentDetails.baseAmount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-1">
                    <Gift className="w-3 h-3 text-green-600" />
                    Bonus Amount:
                  </span>
                  <span className="font-semibold text-green-600">+₹{paymentDetails.bonusAmount}</span>
                </div>
                <div className="border-t border-gray-200 my-2"></div>
              </>
            )}
            
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Total Credited:</span>
              <span className="font-bold text-green-600 text-lg">₹{paymentDetails.amount}</span>
            </div>
            
            <div className="flex justify-between pt-2 border-t border-gray-200">
              <span className="text-gray-500 text-xs">Transaction ID:</span>
              <span className="text-gray-700 font-mono text-xs">
                {paymentDetails.orderId?.slice(0, 20)}...
              </span>
            </div>
          </div>
        )}

        <button
          onClick={onReturnToWallet}
          className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all text-sm"
        >
          Go to Wallet
        </button>
      </div>
    </div>
  );
});

// ==================== TRANSACTIONS TAB ====================
const TransactionsTab = memo(() => {
  const { transactions, isLoading } = useWallet();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const matchesFilter = filter === 'all' || transaction.type === filter;
      const matchesSearch = !searchTerm ||
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [transactions, filter, searchTerm]);

  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setFilter('all');
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border p-4">
        <div className="flex items-center justify-center p-6">
          <Loder />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F0F0F0] rounded-2xl shadow-lg border p-4">
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Transaction History</h3>
          <button className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium text-sm">
            <Download className="w-3 h-3" />
            Export
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white w-full pl-9 pr-4 py-2 bg-gray-100 rounded-lg border border-transparent focus:border-blue-500 focus:bg-white transition-all text-sm"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-white flex-1 px-3 py-2 bg-gray-100 rounded-lg border border-transparent focus:border-blue-500 focus:bg-white transition-all text-sm"
            >
              <option value="all">All Types</option>
              <option value="credit">Credits Only</option>
              <option value="debit">Debits Only</option>
            </select>

            <button
              onClick={handleClearFilters}
              className="bg-white px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              aria-label="Clear filters"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {filteredTransactions.length > 0 ? (
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {filteredTransactions.map((transaction) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              detailed
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">
            {searchTerm ? 'No transactions found' : 'No transactions yet'}
          </p>
          <p className="text-gray-400 text-xs">
            {searchTerm ? 'Try adjusting your search terms' : 'Your transactions will appear here'}
          </p>
        </div>
      )}
    </div>
  );
});

// ==================== OVERVIEW TAB ====================
const OverviewTab = memo(() => {
  const { transactions, isLoading } = useWallet();

  const recentTransactions = useMemo(() => transactions.slice(0, 5), [transactions]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loder />
      </div>
    );
  }

  return (
    <div className="bg-[#F0F0F0] rounded-2xl shadow-lg border p-4">
      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
        <History className="w-5 h-5 text-blue-600" />
        Recent Activity
      </h3>

      {recentTransactions.length > 0 ? (
        <div className="space-y-2">
          {recentTransactions.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">No recent transactions</p>
        </div>
      )}
    </div>
  );
});

// ==================== PAYMENT FEATURE ====================
const PaymentFeature = memo(({ icon: Icon, title, description }) => (
  <div className="flex items-start gap-2">
    <div className="p-1.5 bg-blue-100 rounded-lg mt-0.5">
      <Icon className="w-3.5 h-3.5 text-blue-600" />
    </div>
    <div className="flex-1">
      <h4 className="font-medium text-sm text-gray-900">{title}</h4>
      <p className="text-xs text-gray-600">{description}</p>
    </div>
  </div>
));

// ==================== RECHARGE TAB ====================
const RechargeTab = memo(() => (
  <div className="space-y-4">
    <RechargeForm />

    <div className="bg-[#F0F0F0] rounded-2xl shadow-lg border p-4">
      <h3 className="text-lg font-bold text-gray-900 mb-3">Why Choose Cashfree?</h3>
      <div className="space-y-3">
        <PaymentFeature
          icon={Shield}
          title="Bank-Level Security"
          description="PCI-DSS compliant with 256-bit encryption"
        />
        <PaymentFeature
          icon={CreditCard}
          title="Multiple Payment Options"
          description="UPI, Cards, Net Banking, Wallets - all supported"
        />
        <PaymentFeature
          icon={CheckCircle}
          title="Instant Processing"
          description="Your wallet is credited immediately after payment"
        />
        <PaymentFeature
          icon={RefreshCw}
          title="Easy Refunds"
          description="Quick refund processing for failed transactions"
        />
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-xl">
        <div className="flex items-center gap-2 mb-1">
          <ExternalLink className="w-4 h-4 text-blue-600" />
          <span className="font-medium text-sm text-blue-800">Powered by Cashfree</span>
        </div>
        <p className="text-blue-700 text-xs">
          Cashfree is trusted by 300,000+ businesses. Your payment information is processed securely.
        </p>
      </div>
    </div>
  </div>
));

// ==================== WALLET DASHBOARD ====================
export const WalletDashboard = memo(() => {
  const { balance, stats, isLoading, isInitialized, refreshWallet } = useWallet();
  const [showBalance, setShowBalance] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showRecharge, setShowRecharge] = useState(false);

  const handleToggleBalance = useCallback(() => {
    setShowBalance(prev => !prev);
  }, []);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  const handleRefresh = useCallback(() => {
    if (!isLoading) {
      refreshWallet();
    }
  }, [isLoading, refreshWallet]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/40 flex items-center justify-center p-4">
        <Loder />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/40 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Balance Card */}
        <div className="bg-gray-100 rounded-3xl p-6 md:p-10">
          {/* Top Section */}
          <div className="flex items-start justify-between w-full">
            {/* Left Content */}
            <div>
              <h1 className="text-3xl md:text-[32px] font-bold text-gray-900">
                Find the right companion for You
              </h1>

              <p className="text-gray-600 text-base mt-2 mb-6">
                Browse trusted, verified companions ready to talk, listen, or spend time with you, anytime.
              </p>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all"
                aria-label="Refresh wallet"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>

              <button className="p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all relative">
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
            </div>
          </div>

          {/* Balance Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              {/* Title */}
              <div className="flex items-center gap-2">
                <Wallet className="w-[20px] h-[20px] text-gray-900" />
                <h2 className="text-lg font-bold text-gray-900">Balance</h2>
              </div>
              {/* Add Money Button */}
              <button
                onClick={() => setShowRecharge(true)}
                className="px-5 py-2.5 bg-black text-white rounded-xl flex items-center gap-2 text-sm font-medium hover:bg-gray-800 transition"
              >
                <Plus className="w-[20px] h-[20px]" />
                Add money
              </button>
            </div>
            <div className="flex items-center justify-between">
              {/* Amount + Eye Toggle */}
              <div className="flex items-center gap-2">
                <p className="text-3xl font-bold text-gray-900 tracking-tight">
                  {showBalance ? formatCurrency(balance) : "₹••••••"}
                </p>
                <button
                  onClick={handleToggleBalance}
                  className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                >
                  {showBalance ? (
                    <EyeOff className="w-4 h-4 text-gray-700" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-700" />
                  )}
                </button>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
              {/* Total Recharged */}
              <div className="bg-gray-100 rounded-xl py-3 px-4 flex items-center gap-3">
                <ArrowUpRight className="w-5 h-5 text-green-600" />
                <p className="text-green-600 font-semibold text-[15px]">
                  {formatCurrency(stats?.totalCredits || 0)}
                </p>
                <p className="text-xs text-gray-500">Total Recharged</p>
              </div>

              {/* Total Spent */}
              <div className="bg-gray-100 rounded-xl py-3 px-4 flex items-center gap-3">
                <ArrowDownLeft className="w-5 h-5 text-red-600" />
                <p className="text-red-600 font-semibold text-[15px]">
                  {formatCurrency(stats?.totalDebits || 0)}
                </p>
                <p className="text-xs text-gray-500">Total Spent</p>
              </div>

              {/* Transactions */}
              <div className="bg-gray-100 rounded-xl py-3 px-4 flex items-center gap-3">
                <Receipt className="w-5 h-5 text-gray-700" />
                <p className="text-gray-700 font-semibold text-[15px]">
                  {stats?.totalTransactions || 0}
                </p>
                <p className="text-xs text-gray-500">Transactions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-4 mt-2 bg-[#F0F0F0] rounded-2xl shadow-lg border p-1">
          {['overview', 'transactions', 'recharge'].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`flex-1 py-2 rounded-xl font-medium transition-all capitalize text-sm ${
                activeTab === tab
                  ? 'bg-[#282828] text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[200px]">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'transactions' && <TransactionsTab />}
          {activeTab === 'recharge' && <RechargeTab />}
        </div>
      </div>

      {showRecharge && <RechargeModal onClose={() => setShowRecharge(false)} />}
    </div>
  );
});

// ==================== MAIN APP ====================
const WalletApp = () => {
  const [isAuthenticated] = useState(true);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);

  useEffect(() => {
    const checkPaymentStatus = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const orderId = urlParams.get('order_id');

      if (orderId) {
        setShowPaymentSuccess(true);
      }
    };

    checkPaymentStatus();
  }, []);

  const handleReturnToWallet = useCallback(() => {
    window.history.pushState({}, '', '/wallet');
    setShowPaymentSuccess(false);
  }, []);

  return (
    <div className="min-h-screen">
      {!isAuthenticated ? (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/40 p-4">
          <div className="text-center bg-white p-6 rounded-2xl shadow-lg max-w-sm w-full">
            <h1 className="text-xl font-bold mb-2">Please Login</h1>
            <p className="text-gray-600 text-sm">Authentication required</p>
          </div>
        </div>
      ) : showPaymentSuccess ? (
        <PaymentSuccessPage onReturnToWallet={handleReturnToWallet} />
      ) : (
        <WalletDashboard />
      )}
    </div>
  );
};

export default WalletApp;