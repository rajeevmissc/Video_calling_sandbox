// import { useState, useEffect, createContext, useContext, useCallback, useMemo, memo } from 'react';
// import {
//   Wallet, CreditCard, Plus, CheckCircle, AlertCircle, RefreshCw, Receipt,
//   ArrowUpRight, ArrowDownLeft, DollarSign, Eye, EyeOff, History, Download,
//   Phone, Video, MapPin, X, AlertTriangle, Bell, Search, Lock,
//   Smartphone, Building2, ExternalLink, Shield, ArrowRight
// } from 'lucide-react';
// import Loder from '../../components/Loading';
// import { FaRupeeSign } from 'react-icons/fa';

// // ==================== CONSTANTS ====================
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002/api';
// const CASHFREE_APP_ID = '11403793dac4227dd9e9561b5519730411' || 'TEST_APP_ID';
// const CASHFREE_MODE = 'production' || 'sandbox'; // 'sandbox' or 'production'

// const PAYMENT_OPTIONS = Object.freeze([
//   {
//     id: 'card',
//     name: 'Credit/Debit Cards',
//     description: 'Visa, MasterCard, RuPay, Amex',
//     icon: CreditCard,
//     popular: true,
//     cashfreeType: 'cc,dc'
//   },
//   {
//     id: 'upi',
//     name: 'UPI',
//     description: 'Google Pay, PhonePe, Paytm, BHIM',
//     icon: Smartphone,
//     popular: true,
//     cashfreeType: 'upi'
//   },
//   {
//     id: 'netbanking',
//     name: 'Net Banking',
//     description: 'All major Indian banks',
//     icon: Building2,
//     popular: true,
//     cashfreeType: 'nb'
//   },
//   {
//     id: 'wallet',
//     name: 'Wallets',
//     description: 'Paytm, PhonePe & more',
//     icon: Wallet,
//     popular: false,
//     cashfreeType: 'wallet'
//   }
// ]);

// const QUICK_AMOUNTS = Object.freeze([100, 200, 500, 750, 1000, 2000, 3000, 5000, 7500, 10000, 15000, 20000]);

// const TOAST_TYPES = Object.freeze({
//   SUCCESS: 'success',
//   ERROR: 'error',
//   WARNING: 'warning',
//   INFO: 'info'
// });

// const TOAST_DURATION = 5000;

// // ==================== UTILITY FUNCTIONS ====================
// const formatCurrency = (amount) => {
//   if (amount === undefined || amount === null || isNaN(amount)) return '₹0.00';
//   return `₹${Number(amount).toLocaleString('en-IN', {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2
//   })}`;
// };

// const formatDate = (dateString) => {
//   return new Date(dateString).toLocaleDateString('en-IN', {
//     year: 'numeric',
//     month: 'short',
//     day: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit'
//   });
// };

// const getServiceIcon = (serviceType) => {
//   const iconMap = {
//     call: Phone,
//     video: Video,
//     visit: MapPin
//   };
//   return iconMap[serviceType] || Receipt;
// };

// const getCashfreePaymentMethods = (methods) => {
//   return methods
//     .map(methodId => {
//       const option = PAYMENT_OPTIONS.find(opt => opt.id === methodId);
//       return option?.cashfreeType;
//     })
//     .filter(Boolean)
//     .join(',');
// };

// // ==================== CASHFREE INTEGRATION ====================
// class CashfreeManager {
//   constructor() {
//     this.cashfreePromise = null;
//   }

//   async getCashfree() {
//     if (!this.cashfreePromise) {
//       this.cashfreePromise = this.loadCashfree();
//     }
//     return this.cashfreePromise;
//   }

//   async loadCashfree() {
//     if (window.Cashfree) {
//       return window.Cashfree({ mode: CASHFREE_MODE });
//     }

//     return new Promise((resolve, reject) => {
//       const script = document.createElement('script');
//       script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
//       script.onload = () => {
//         if (window.Cashfree) {
//           resolve(window.Cashfree({ mode: CASHFREE_MODE }));
//         } else {
//           reject(new Error('Cashfree SDK loaded but not available'));
//         }
//       };
//       script.onerror = () => reject(new Error('Failed to load Cashfree SDK'));
//       document.head.appendChild(script);
//     });
//   }
// }

// const cashfreeManager = new CashfreeManager();

// // ==================== API SERVICE ====================
// class WalletAPI {
//   constructor() {
//     this.baseURL = API_BASE_URL;
//   }

//   getAuthToken() {
//     return localStorage.getItem('token') || '';
//   }

//   async request(endpoint, options = {}) {
//     const url = `${this.baseURL}${endpoint}`;
//     const token = this.getAuthToken();

//     const config = {
//       headers: {
//         'Content-Type': 'application/json',
//         ...(token && { 'Authorization': `Bearer ${token}` }),
//         ...options.headers,
//       },
//       ...options,
//     };

//     const response = await fetch(url, config);
//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.error || `HTTP error! status: ${response.status}`);
//     }

//     return data;
//   }

//   async getBalance() {
//     return this.request('/wallet/balance');
//   }

//   async rechargeWallet(amount, transactionId) {
//     return this.request('/wallet/recharge', {
//       method: 'POST',
//       body: JSON.stringify({
//         amount,
//         paymentMethod: 'Cashfree Checkout',
//         transactionId,
//         description: `Wallet Recharge via Cashfree`
//       }),
//     });
//   }

//   async deductFromWallet(amount, description, serviceId, serviceType, providerId, metadata = {}) {
//     console.log('data', amount, description, serviceId, serviceType, providerId, metadata)
//     return this.request('/wallet/deduct', {
//       method: 'POST',
//       body: JSON.stringify({
//         amount,
//         description,
//         serviceId,
//         serviceType,
//         providerId,
//         metadata,
//         paymentMethod: "wallet"
//       }),
//     });
//   }

//   async getWalletStats() {
//     return this.request('/wallet/stats');
//   }

//   async createCheckoutSession(amount, paymentMethods = ['card']) {
//     return this.request('/payments/create-checkout-session', {
//       method: 'POST',
//       body: JSON.stringify({
//         amount: amount * 100, // Convert to smallest currency unit
//         currency: 'INR',
//         payment_method_types: paymentMethods,
//         metadata: { type: 'wallet_recharge' }
//       }),
//     });
//   }

//   async verifyPaymentSession(sessionId) {
//     return this.request(`/payments/verify-session/${sessionId}`);
//   }

//   async getTransactions(page = 1, limit = 10) {
//     return this.request(`/transactions?page=${page}&limit=${limit}`);
//   }
// }

// const walletAPI = new WalletAPI();

// // ==================== TOAST SYSTEM ====================
// const ToastContext = createContext(null);

// export const useToast = () => {
//   const context = useContext(ToastContext);
//   if (!context) {
//     throw new Error('useToast must be used within ToastProvider');
//   }
//   return context;
// };

// const Toast = memo(({ toast, onClose }) => {
//   const icons = {
//     [TOAST_TYPES.SUCCESS]: CheckCircle,
//     [TOAST_TYPES.ERROR]: AlertCircle,
//     [TOAST_TYPES.WARNING]: AlertTriangle
//   };

//   const colors = {
//     [TOAST_TYPES.SUCCESS]: 'bg-green-50 border-green-200 text-green-800',
//     [TOAST_TYPES.ERROR]: 'bg-red-50 border-red-200 text-red-800',
//     [TOAST_TYPES.WARNING]: 'bg-yellow-50 border-yellow-200 text-yellow-800'
//   };

//   const Icon = icons[toast.type];

//   return (
//     <div className={`flex items-center gap-3 p-3 rounded-xl border shadow-lg ${colors[toast.type]} animate-slide-in`}>
//       <Icon className="w-4 h-4 flex-shrink-0" />
//       <p className="font-medium text-sm flex-1">{toast.message}</p>
//       <button
//         onClick={onClose}
//         className="p-1 hover:bg-black/10 rounded-lg flex-shrink-0"
//         aria-label="Close notification"
//       >
//         <X className="w-3 h-3" />
//       </button>
//     </div>
//   );
// });

// const ToastContainer = memo(({ toasts, removeToast }) => {
//   if (toasts.length === 0) return null;

//   return (
//     <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
//       {toasts.map(toast => (
//         <Toast
//           key={toast.id}
//           toast={toast}
//           onClose={() => removeToast(toast.id)}
//         />
//       ))}
//     </div>
//   );
// });

// export const ToastProvider = ({ children }) => {
//   const [toasts, setToasts] = useState([]);

//   const addToast = useCallback((message, type = TOAST_TYPES.INFO, duration = TOAST_DURATION) => {
//     const id = Date.now();
//     setToasts(prev => [...prev, { id, message, type, duration }]);

//     if (duration > 0) {
//       setTimeout(() => {
//         setToasts(prev => prev.filter(t => t.id !== id));
//       }, duration);
//     }

//     return id;
//   }, []);

//   const removeToast = useCallback((id) => {
//     setToasts(prev => prev.filter(t => t.id !== id));
//   }, []);

//   const contextValue = useMemo(() => ({
//     showSuccess: (message) => addToast(message, TOAST_TYPES.SUCCESS),
//     showError: (message) => addToast(message, TOAST_TYPES.ERROR),
//     showWarning: (message) => addToast(message, TOAST_TYPES.WARNING),
//     showInfo: (message) => addToast(message, TOAST_TYPES.INFO)
//   }), [addToast]);

//   return (
//     <ToastContext.Provider value={contextValue}>
//       {children}
//       <ToastContainer toasts={toasts} removeToast={removeToast} />
//     </ToastContext.Provider>
//   );
// };

// // ==================== WALLET CONTEXT ====================
// const WalletContext = createContext(null);

// export const useWallet = () => {
//   const context = useContext(WalletContext);
//   if (!context) {
//     throw new Error('useWallet must be used within WalletProvider');
//   }
//   return context;
// };

// export const WalletProvider = ({ children }) => {
//   const [state, setState] = useState({
//     balance: 0,
//     transactions: [],
//     stats: null,
//     isLoading: false,
//     isInitialized: false,
//     error: null
//   });

//   const { showSuccess, showError, showWarning } = useToast();

//   const initializeWallet = useCallback(async () => {
//     setState(prev => ({ ...prev, isLoading: true, error: null }));

//     try {
//       const [balanceResponse, statsResponse, transactionsResponse] = await Promise.all([
//         walletAPI.getBalance(),
//         walletAPI.getWalletStats(),
//         walletAPI.getTransactions(1, 20)
//       ]);

//       const balance = balanceResponse.data?.balance || 0;
//       const statsData = statsResponse.data?.summary || {
//         credit: { totalAmount: 0, count: 0 },
//         debit: { totalAmount: 0, count: 0 }
//       };

//       const transactions = (transactionsResponse.data?.transactions || []).map(t => ({
//         id: t.id || t.reference,
//         reference: t.reference,
//         type: t.type,
//         amount: t.amount,
//         description: t.description,
//         timestamp: t.createdAt,
//         status: t.status,
//         serviceType: t.serviceType
//       }));

//       setState({
//         balance,
//         stats: {
//           totalCredits: statsData.credit.totalAmount,
//           totalDebits: statsData.debit.totalAmount,
//           totalTransactions: statsData.credit.count + statsData.debit.count
//         },
//         transactions,
//         isInitialized: true,
//         isLoading: false,
//         error: null
//       });
//     } catch (error) {
//       console.error('Failed to initialize wallet:', error);
//       setState(prev => ({
//         ...prev,
//         error: error.message,
//         isLoading: false,
//         isInitialized: true
//       }));
//       showError('Failed to load wallet data');
//     }
//   }, [showError]);

//   const rechargeWallet = useCallback(async (amount, paymentMethods = ['card']) => {
//     setState(prev => ({ ...prev, isLoading: true }));

//     try {
//       const cashfree = await cashfreeManager.getCashfree();
//       if (!cashfree) throw new Error('Cashfree failed to initialize');

//       const validMethods = paymentMethods.filter(method =>
//         ['card', 'upi', 'netbanking', 'wallet'].includes(method)
//       );

//       if (validMethods.length === 0) {
//         throw new Error('No valid payment methods selected');
//       }

//       const response = await walletAPI.createCheckoutSession(amount, validMethods);
//       const { sessionId, url } = response.data;

//       if (!sessionId && !url) throw new Error('Failed to create checkout session');

//       showSuccess('Redirecting to payment gateway...');

//       // Use direct URL redirect (recommended for Cashfree)
//       if (url) {
//         window.location.href = url;
//       } else if (sessionId) {
//         // Fallback: use Cashfree SDK checkout
//         const checkoutOptions = {
//           paymentSessionId: sessionId,
//           returnUrl: `${window.location.origin}/wallet?order_id={order_id}`,
//         };
        
//         cashfree.checkout(checkoutOptions).then((result) => {
//           if (result.error) {
//             console.error('Payment failed:', result.error);
//             setState(prev => ({ ...prev, isLoading: false }));
//             showError('Payment failed: ' + result.error.message);
//           }
//           if (result.redirect) {
//             console.log('Payment will be redirected');
//           }
//           if (result.paymentDetails) {
//             console.log('Payment completed:', result.paymentDetails);
//             showSuccess('Payment successful!');
//           }
//         }).catch((error) => {
//           console.error('Cashfree checkout error:', error);
//           setState(prev => ({ ...prev, isLoading: false }));
//           showError('Payment initialization failed');
//         });
//       }
//     } catch (error) {
//       setState(prev => ({ ...prev, isLoading: false }));
//       showError('Failed to initiate payment: ' + error.message);
//       console.error('Payment error:', error);
//     }
//   }, [showSuccess, showError]);

//   const deductFromWallet = useCallback(async (amount, description, serviceDetails = {}) => {
//     if (state.balance < amount) {
//       showWarning('Insufficient wallet balance');
//       throw new Error('Insufficient balance');
//     }

//     setState(prev => ({ ...prev, isLoading: true }));

//     try {
//       await walletAPI.deductFromWallet(
//         amount,
//         description,
//         serviceDetails.serviceId,
//         serviceDetails.serviceType,
//         serviceDetails.providerId,
//         serviceDetails.metadata
//       );

//       await initializeWallet();
//       showSuccess('Payment successful!');
//       return { success: true };
//     } catch (error) {
//       setState(prev => ({ ...prev, isLoading: false }));
//       showError('Payment failed');
//       throw error;
//     }
//   }, [state.balance, showSuccess, showError, showWarning, initializeWallet]);

//   useEffect(() => {
//     initializeWallet();
//   }, [initializeWallet]);

//   const contextValue = useMemo(() => ({
//     ...state,
//     rechargeWallet,
//     deductFromWallet,
//     refreshWallet: initializeWallet
//   }), [state, rechargeWallet, deductFromWallet, initializeWallet]);

//   return (
//     <WalletContext.Provider value={contextValue}>
//       {children}
//     </WalletContext.Provider>
//   );
// };

// // ==================== PAYMENT METHOD SELECTOR ====================
// const PaymentMethodOption = memo(({ option, isSelected, onToggle }) => {
//   const Icon = option.icon;

//   return (
//     <div
//       onClick={onToggle}
//       className={`p-3 border rounded-xl cursor-pointer transition-all ${isSelected
//         ? 'border-blue-500 bg-blue-50'
//         : 'border-gray-200 bg-white hover:border-gray-300'
//         }`}
//     >
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-100' : 'bg-gray-100'}`}>
//             <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
//           </div>
//           <div className="flex-1 min-w-0">
//             <div className="flex items-center gap-1">
//               <span className="font-medium text-sm truncate">{option.name}</span>
//               {option.popular && (
//                 <span className="px-1.5 py-0.5 bg-green-100 text-green-800 text-xs rounded-full flex-shrink-0">
//                   Popular
//                 </span>
//               )}
//             </div>
//             <p className="text-xs text-gray-600 truncate">{option.description}</p>
//           </div>
//         </div>
//         <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
//           }`}>
//           {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
//         </div>
//       </div>
//     </div>
//   );
// });

// const PaymentMethodSelector = memo(({
//   selectedMethods,
//   onMethodsChange,
//   onProceed,
//   amount,
//   isLoading
// }) => {
//   const handleMethodToggle = useCallback((methodId) => {
//     const newMethods = selectedMethods.includes(methodId)
//       ? selectedMethods.filter(id => id !== methodId)
//       : [...selectedMethods, methodId];
//     onMethodsChange(newMethods);
//   }, [selectedMethods, onMethodsChange]);

//   const handleProceed = useCallback(() => {
//     const cashfreePaymentMethods = getCashfreePaymentMethods(selectedMethods);
//     onProceed(selectedMethods);
//   }, [selectedMethods, onProceed]);

//   return (
//     <div className="bg-[#F0F0F0] space-y-4">
//       <div className="space-y-2 max-h-full overflow-y-auto">
//         {PAYMENT_OPTIONS.map((option) => (
//           <PaymentMethodOption
//             key={option.id}
//             option={option}
//             isSelected={selectedMethods.includes(option.id)}
//             onToggle={() => handleMethodToggle(option.id)}
//           />
//         ))}
//       </div>

//       <div className="p-3 bg-green-50 rounded-xl">
//         <div className="flex items-center justify-between">
//           <span className="font-medium text-sm text-green-800">Amount to Add:</span>
//           <span className="font-bold text-lg text-green-600">{formatCurrency(amount)}</span>
//         </div>
//       </div>

//       <button
//         onClick={handleProceed}
//         disabled={selectedMethods.length === 0 || isLoading}
//         className="w-full py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
//       >
//         {isLoading ? (
//           <>
//             <RefreshCw className="w-4 h-4 animate-spin" />
//             Processing...
//           </>
//         ) : (
//           <>
//             <Lock className="w-4 h-4" />
//             Proceed to Secure Checkout
//           </>
//         )}
//       </button>
//     </div>
//   );
// });

// // ==================== RECHARGE FORM ====================
// const QuickAmountButton = memo(({ amount, onClick }) => (
//   <button
//     onClick={() => onClick(amount)}
//     className="bg-white p-2 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all"
//   >
//     <div className="font-bold text-sm">₹{amount.toLocaleString('en-IN')}</div>
//     <div className="text-xs text-gray-500">Quick Add</div>
//   </button>
// ));

// const RechargeForm = memo(() => {
//   const { balance, rechargeWallet, isLoading } = useWallet();
//   const { showError } = useToast();
//   const [amount, setAmount] = useState('');
//   const [selectedMethods, setSelectedMethods] = useState(['card']);
//   const [showCheckout, setShowCheckout] = useState(false);

//   const handleQuickAmount = useCallback((quickAmount) => {
//     setAmount(quickAmount.toString());
//     setShowCheckout(true);
//   }, []);

//   const handleProceedToCheckout = useCallback(async (paymentMethods) => {
//     const rechargeAmount = parseFloat(amount);

//     if (!rechargeAmount || rechargeAmount < 1) {
//       showError('Please enter a valid amount');
//       return;
//     }

//     if (rechargeAmount > 50000) {
//       showError('Maximum recharge limit is ₹50,000');
//       return;
//     }

//     if (paymentMethods.length === 0) {
//       showError('Please select at least one payment method');
//       return;
//     }

//     await rechargeWallet(rechargeAmount, paymentMethods);
//   }, [amount, rechargeWallet, showError]);

//   if (showCheckout) {
//     return (
//       <div className="bg-[#F0F0F0] h-full rounded-2xl shadow-lg border p-4">
//         <div className="flex items-center gap-3 mb-4">
//           {/* Back Button */}
//           <button
//             onClick={() => setShowCheckout(false)}
//             className="p-1.5 hover:bg-gray-100 rounded-lg"
//           >
//             <ArrowRight className="w-4 h-4" />
//           </button>

//           {/* Title + Subtitle */}
//           <div className="flex flex-col leading-tight">
//             <h3 className="text-lg font-bold text-gray-900">Select Payment Method</h3>
//             <p className="text-xs text-gray-600">Choose how you want to pay</p>
//           </div>
//         </div>

//         <PaymentMethodSelector
//           selectedMethods={selectedMethods}
//           onMethodsChange={setSelectedMethods}
//           onProceed={handleProceedToCheckout}
//           amount={parseFloat(amount) || 0}
//           isLoading={isLoading}
//         />
//       </div>
//     );
//   }

//   return (
//     <div className="bg-[#F0F0F0] rounded-2xl shadow-lg border p-4">
//        <div className="flex items-center gap-2 p-2">
//           <Wallet className="w-5 h-5 text-gray-900" />
//           <h2 className="text-lg font-bold text-gray-900">Add Money to Wallet</h2>
//         </div>

//       <div className="p-3 bg-blue-50 rounded-xl mb-4">
//         <div className="flex items-center justify-between">
//           <span className="font-medium text-sm text-blue-800">Current Balance:</span>
//           <span className="font-bold text-blue-600">{formatCurrency(balance)}</span>
//         </div>
//       </div>

//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700 mb-2">Quick Select</label>
//         <div className="grid grid-cols-2 gap-2">
//           {QUICK_AMOUNTS.map((quickAmount) => (
//             <QuickAmountButton
//               key={quickAmount}
//               amount={quickAmount}
//               onClick={handleQuickAmount}
//             />
//           ))}
//         </div>
//       </div>

//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700 mb-2">Custom Amount</label>
//         <div className="relative">
//           <FaRupeeSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//           <input
//             type="number"
//             value={amount}
//             onChange={(e) => setAmount(e.target.value)}
//             placeholder="Enter amount (₹1 - ₹50,000)"
//             min="1"
//             max="50000"
//             className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-sm"
//           />
//         </div>
//       </div>

//       <button
//         onClick={() => setShowCheckout(true)}
//         disabled={!amount || parseFloat(amount) < 1 || parseFloat(amount) > 50000}
//         className="w-full py-3 bg-[#1A1A1A] text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
//       >
//         <Plus className="w-4 h-4" />
//         Add {amount ? formatCurrency(parseFloat(amount)) : '₹0'}
//       </button>
//       <div className="mt-4 flex items-center justify-center gap-1 text-xs text-gray-500">
//         <Shield className="w-3 h-3" />
//         <span>Powered by Cashfree • Bank-level security</span>
//       </div>
//     </div>
//   );
// });

// // ==================== PAYMENT SUCCESS PAGE ====================
// const PaymentSuccessPage = memo(({ onReturnToWallet }) => {
//   const { refreshWallet } = useWallet();
//   const { showSuccess } = useToast();
//   const [isProcessing, setIsProcessing] = useState(true);
//   const [paymentDetails, setPaymentDetails] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const processPayment = async () => {
//       const urlParams = new URLSearchParams(window.location.search);
//       const orderId = urlParams.get('order_id'); // Changed from session_id to order_id

//       if (!orderId) {
//         setError('No order ID found');
//         setIsProcessing(false);
//         return;
//       }

//       try {
//         const response = await walletAPI.verifyPaymentSession(orderId);

//         if (response.success) {
//           const amount = response.data.amount;
//           await walletAPI.rechargeWallet(amount, orderId);
//           await refreshWallet();

//           setPaymentDetails({ amount, orderId, status: 'success' });
//           showSuccess(`₹${amount} added to your wallet!`);
//         } else {
//           throw new Error('Payment verification failed');
//         }
//       } catch (err) {
//         console.error('Payment processing error:', err);
//         setError(err.message || 'Failed to process payment');
//       } finally {
//         setIsProcessing(false);
//       }
//     };

//     processPayment();
//   }, [refreshWallet, showSuccess]);

//   if (isProcessing) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/40 flex items-center justify-center p-4">
//         <div className="bg-white rounded-2xl shadow-lg max-w-sm w-full p-6 text-center">
//           <Loder />
//           <h2 className="text-xl font-bold mb-2 mt-4">Processing Payment</h2>
//           <p className="text-gray-600 text-sm">Please wait while we confirm your transaction...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/40 flex items-center justify-center p-4">
//         <div className="bg-white rounded-2xl shadow-lg max-w-sm w-full p-6 text-center">
//           <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
//           <h2 className="text-xl font-bold mb-2">Payment Failed</h2>
//           <p className="text-gray-600 text-sm mb-4">{error}</p>
//           <button
//             onClick={onReturnToWallet}
//             className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 font-medium text-sm"
//           >
//             Return to Wallet
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/40 flex items-center justify-center p-4">
//       <div className="bg-white rounded-2xl shadow-lg max-w-sm w-full p-6 text-center">
//         <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
//           <CheckCircle className="w-6 h-6 text-green-600" />
//         </div>
//         <h2 className="text-xl font-bold mb-2">Payment Successful!</h2>
//         <p className="text-gray-600 text-sm mb-4">Your wallet has been recharged successfully</p>

//         {paymentDetails && (
//           <div className="bg-gray-50 rounded-xl p-3 mb-4 text-left text-sm">
//             <div className="flex justify-between mb-1">
//               <span className="text-gray-600">Amount Added:</span>
//               <span className="font-bold text-green-600">₹{paymentDetails.amount}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-500">Transaction ID:</span>
//               <span className="text-gray-700 font-mono text-xs">
//                 {paymentDetails.orderId?.slice(0, 20)}...
//               </span>
//             </div>
//           </div>
//         )}

//         <button
//           onClick={onReturnToWallet}
//           className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all text-sm"
//         >
//           Go to Wallet
//         </button>
//       </div>
//     </div>
//   );
// });

// // ==================== TRANSACTION ITEM ====================
// const TransactionItem = memo(({ transaction, detailed = false }) => {
//   const ServiceIcon = getServiceIcon(transaction.serviceType);

//   return (
//     <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
//       <div className="flex items-center gap-3 flex-1 min-w-0">
//         <div className={`p-2 rounded-lg ${transaction.type === 'credit'
//           ? 'bg-green-100 text-green-600'
//           : 'bg-red-100 text-red-600'
//           }`}>
//           <ServiceIcon className="w-4 h-4" />
//         </div>
//         <div className="flex-1 min-w-0">
//           <div className="font-medium text-sm text-gray-900 truncate">
//             {transaction.description}
//           </div>
//           <div className="text-xs text-gray-500">
//             {formatDate(transaction.timestamp)}
//           </div>
//           {detailed && transaction.reference && (
//             <div className="text-xs text-gray-400 truncate">
//               Ref: {transaction.reference}
//             </div>
//           )}
//         </div>
//       </div>
//       <div className="text-right flex-shrink-0 ml-2">
//         <div className={`font-bold text-sm ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
//           }`}>
//           {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
//         </div>
//         <div className={`text-xs px-1.5 py-0.5 rounded-full ${transaction.status === 'completed'
//           ? 'bg-green-100 text-green-800'
//           : 'bg-yellow-100 text-yellow-800'
//           }`}>
//           {transaction.status || 'completed'}
//         </div>
//       </div>
//     </div>
//   );
// });

// // ==================== TRANSACTIONS TAB ====================
// const TransactionsTab = memo(() => {
//   const { transactions, isLoading } = useWallet();
//   const [filter, setFilter] = useState('all');
//   const [searchTerm, setSearchTerm] = useState('');

//   const filteredTransactions = useMemo(() => {
//     return transactions.filter(transaction => {
//       const matchesFilter = filter === 'all' || transaction.type === filter;
//       const matchesSearch = !searchTerm ||
//         transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
//       return matchesFilter && matchesSearch;
//     });
//   }, [transactions, filter, searchTerm]);

//   const handleClearFilters = useCallback(() => {
//     setSearchTerm('');
//     setFilter('all');
//   }, []);

//   if (isLoading) {
//     return (
//       <div className="bg-white rounded-2xl shadow-lg border p-4">
//         <div className="flex items-center justify-center p-6">
//           <Loder />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-[#F0F0F0] rounded-2xl shadow-lg border p-4">
//       <div className="flex flex-col gap-3 mb-4">
//         <div className="flex items-center justify-between">
//           <h3 className="text-lg font-bold text-gray-900">Transaction History</h3>
//           <button className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium text-sm">
//             <Download className="w-3 h-3" />
//             Export
//           </button>
//         </div>

//         <div className="flex flex-col gap-2">
//           <div className="relative">
//             <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search transactions..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="bg-white w-full pl-9 pr-4 py-2 bg-gray-100 rounded-lg border border-transparent focus:border-blue-500 focus:bg-white transition-all text-sm"
//             />
//           </div>

//           <div className="flex gap-2">
//             <select
//               value={filter}
//               onChange={(e) => setFilter(e.target.value)}
//               className="bg-white flex-1 px-3 py-2 bg-gray-100 rounded-lg border border-transparent focus:border-blue-500 focus:bg-white transition-all text-sm"
//             >
//               <option value="all">All Types</option>
//               <option value="credit">Credits Only</option>
//               <option value="debit">Debits Only</option>
//             </select>

//             <button
//               onClick={handleClearFilters}
//               className="bg-white px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
//               aria-label="Clear filters"
//             >
//               <X className="w-4 h-4" />
//             </button>
//           </div>
//         </div>
//       </div>

//       {filteredTransactions.length > 0 ? (
//         <div className="space-y-2 max-h-80 overflow-y-auto">
//           {filteredTransactions.map((transaction) => (
//             <TransactionItem
//               key={transaction.id}
//               transaction={transaction}
//               detailed
//             />
//           ))}
//         </div>
//       ) : (
//         <div className="text-center py-8">
//           <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-3" />
//           <p className="text-gray-500 text-sm">
//             {searchTerm ? 'No transactions found' : 'No transactions yet'}
//           </p>
//           <p className="text-gray-400 text-xs">
//             {searchTerm ? 'Try adjusting your search terms' : 'Your transactions will appear here'}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// });

// // ==================== OVERVIEW TAB ====================
// const OverviewTab = memo(() => {
//   const { transactions, isLoading } = useWallet();

//   const recentTransactions = useMemo(() =>
//     transactions.slice(0, 5),
//     [transactions]
//   );

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center p-6">
//         <Loder />
//       </div>
//     );
//   }

//   return (
//     <div className="bg-[#F0F0F0] rounded-2xl shadow-lg border p-4">
//       <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
//         <History className="w-5 h-5 text-blue-600" />
//         Recent Activity
//       </h3>

//       {recentTransactions.length > 0 ? (
//         <div className="space-y-2">
//           {recentTransactions.map((transaction) => (
//             <TransactionItem
//               key={transaction.id}
//               transaction={transaction}
//             />
//           ))}
//         </div>
//       ) : (
//         <div className="text-center py-6">
//           <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-2" />
//           <p className="text-gray-500 text-sm">No recent transactions</p>
//         </div>
//       )}
//     </div>
//   );
// });

// // ==================== PAYMENT FEATURE ====================
// const PaymentFeature = memo(({ icon: Icon, title, description }) => (
//   <div className="flex items-start gap-2">
//     <div className="p-1.5 bg-blue-100 rounded-lg mt-0.5">
//       <Icon className="w-3.5 h-3.5 text-blue-600" />
//     </div>
//     <div className="flex-1">
//       <h4 className="font-medium text-sm text-gray-900">{title}</h4>
//       <p className="text-xs text-gray-600">{description}</p>
//     </div>
//   </div>
// ));

// // ==================== RECHARGE TAB ====================
// const RechargeTab = memo(() => (
//   <div className="space-y-4">
//     <RechargeForm />

//     <div className="bg-[#F0F0F0] rounded-2xl shadow-lg border p-4">
//       <h3 className="text-lg font-bold text-gray-900 mb-3">Why Choose Cashfree?</h3>
//       <div className="space-y-3">
//         <PaymentFeature
//           icon={Shield}
//           title="Bank-Level Security"
//           description="PCI-DSS compliant with 256-bit encryption"
//         />
//         <PaymentFeature
//           icon={CreditCard}
//           title="Multiple Payment Options"
//           description="UPI, Cards, Net Banking, Wallets - all supported"
//         />
//         <PaymentFeature
//           icon={CheckCircle}
//           title="Instant Processing"
//           description="Your wallet is credited immediately after payment"
//         />
//         <PaymentFeature
//           icon={RefreshCw}
//           title="Easy Refunds"
//           description="Quick refund processing for failed transactions"
//         />
//       </div>

//       <div className="mt-4 p-3 bg-blue-50 rounded-xl">
//         <div className="flex items-center gap-2 mb-1">
//           <ExternalLink className="w-4 h-4 text-blue-600" />
//           <span className="font-medium text-sm text-blue-800">Powered by Cashfree</span>
//         </div>
//         <p className="text-blue-700 text-xs">
//           Cashfree is trusted by 300,000+ businesses. Your payment information is processed securely.
//         </p>
//       </div>
//     </div>
//   </div>
// ));

// // ==================== RECHARGE MODAL ====================
// const RechargeModal = memo(({ onClose }) => (
//   <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
//     <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm border max-h-[90vh] overflow-hidden relative">
//       <button
//         onClick={onClose}
//         className="p-1.5 bg-white hover:bg-red-500 rounded-lg absolute top-2 right-2"
//         aria-label="Close modal"
//       >
//         <X className="w-4 h-4" />
//       </button>
//       <div className="overflow-y-auto max-h-[calc(90vh-40px)]">
//         <RechargeForm />
//       </div>
//     </div>
//   </div>
// ));

// // ==================== STATS CARD ====================
// const StatCard = memo(({ icon: Icon, value, label, bgColor, textColor, iconColor }) => (
//   <div className={`text-center p-2 ${bgColor} rounded-lg`}>
//     <Icon className={`w-4 h-4 ${iconColor} mx-auto mb-1`} />
//     <div className={`font-bold ${textColor} text-sm`}>{value}</div>
//     <div className={`text-xs ${textColor}`}>{label}</div>
//   </div>
// ));

// // ==================== WALLET DASHBOARD ====================
// const WalletDashboard = memo(() => {
//   const { balance, stats, isLoading, isInitialized, refreshWallet } = useWallet();
//   const [showBalance, setShowBalance] = useState(true);
//   const [activeTab, setActiveTab] = useState('overview');
//   const [showRecharge, setShowRecharge] = useState(false);

//   const handleToggleBalance = useCallback(() => {
//     setShowBalance(prev => !prev);
//   }, []);

//   const handleTabChange = useCallback((tab) => {
//     setActiveTab(tab);
//   }, []);

//   const handleRefresh = useCallback(() => {
//     if (!isLoading) {
//       refreshWallet();
//     }
//   }, [isLoading, refreshWallet]);

//   if (!isInitialized) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/40 flex items-center justify-center p-4">
//         <Loder />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/40 p-4">
//       <div className="max-w-6xl mx-auto">
//         {/* Balance Card */}
//         <div className="bg-gray-100 rounded-3xl p-6 md:p-10">

//           {/* Top Section */}
//           <div className="flex items-start justify-between w-full">

//             {/* Left Content */}
//             <div>
//               <h1 className="text-3xl md:text-[32px] font-bold text-gray-900">
//                 Find the right companion for You
//               </h1>

//               <p className="text-gray-600 text-base mt-2 mb-6">
//                 Browse trusted, verified companions ready to talk, listen, or spend time with you, anytime.
//               </p>
//             </div>

//             {/* Right Icons */}
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={handleRefresh}
//                 disabled={isLoading}
//                 className="p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all"
//                 aria-label="Refresh wallet"
//               >
//                 <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
//               </button>

//               <button className="p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all relative">
//                 <Bell className="w-4 h-4" />
//                 <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
//               </button>
//             </div>
//           </div>

//           {/* Balance Card */}
//           <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
//             <div className="flex items-center justify-between mb-4">
//               {/* Title */}
//               <div className="flex items-center gap-2">
//                 <Wallet className="w-[20px] h-[20px] text-gray-900" />
//                 <h2 className="text-lg font-bold text-gray-900">Balance</h2>
//               </div>
//               {/* Add Money Button */}
//               <button
//                 onClick={() => setShowRecharge(true)}
//                 className="px-5 py-2.5 bg-black text-white rounded-xl flex items-center gap-2 text-sm font-medium hover:bg-gray-800 transition"
//               >
//                 <Plus className="w-[20px] h-[20px]" />
//                 Add money
//               </button>
//             </div>
//             <div className="flex items-center justify-between">
//               {/* Amount + Eye Toggle */}
//               <div className="flex items-center gap-2">
//                 <p className="text-3xl font-bold text-gray-900 tracking-tight">
//                   {showBalance ? formatCurrency(balance) : "₹••••••"}
//                 </p>
//                 <button
//                   onClick={handleToggleBalance}
//                   className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
//                 >
//                   {showBalance ? (
//                     <EyeOff className="w-4 h-4 text-gray-700" />
//                   ) : (
//                     <Eye className="w-4 h-4 text-gray-700" />
//                   )}
//                 </button>
//               </div>
//             </div>

//             {/* Stats Row */}
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
//               {/* Total Recharged */}
//               <div className="bg-gray-100 rounded-xl py-3 px-4 flex items-center gap-3">
//                 <ArrowUpRight className="w-5 h-5 text-green-600" />
//                 <p className="text-green-600 font-semibold text-[15px]">
//                   {formatCurrency(stats?.totalCredits || 0)}
//                 </p>
//                 <p className="text-xs text-gray-500">Total Recharged</p>
//               </div>

//               {/* Total Spent */}
//               <div className="bg-gray-100 rounded-xl py-3 px-4 flex items-center gap-3">
//                 <ArrowDownLeft className="w-5 h-5 text-red-600" />
//                 <p className="text-red-600 font-semibold text-[15px]">
//                   {formatCurrency(stats?.totalDebits || 0)}
//                 </p>
//                 <p className="text-xs text-gray-500">Total Spent</p>
//               </div>

//               {/* Transactions */}
//               <div className="bg-gray-100 rounded-xl py-3 px-4 flex items-center gap-3">
//                 <Receipt className="w-5 h-5 text-gray-700" />
//                 <p className="text-gray-700 font-semibold text-[15px]">
//                   {stats?.totalTransactions || 0}
//                 </p>
//                 <p className="text-xs text-gray-500">Transactions</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="flex gap-1 mb-4 mt-2 bg-[#F0F0F0] rounded-2xl shadow-lg border p-1">
//           {['overview', 'transactions', 'recharge'].map((tab) => (
//             <button
//               key={tab}
//               onClick={() => handleTabChange(tab)}
//               className={`flex-1 py-2 rounded-xl font-medium transition-all capitalize text-sm ${activeTab === tab
//                 ? 'bg-[#282828] text-white shadow-md'
//                 : 'text-gray-700 hover:bg-gray-50'
//                 }`}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>

//         {/* Tab Content */}
//         <div className="min-h-[200px]">
//           {activeTab === 'overview' && <OverviewTab />}
//           {activeTab === 'transactions' && <TransactionsTab />}
//           {activeTab === 'recharge' && <RechargeTab />}
//         </div>
//       </div>

//       {showRecharge && <RechargeModal onClose={() => setShowRecharge(false)} />}
//     </div>
//   );
// });

// // ==================== SERVICE BOOKING WITH WALLET ====================
// export const ServiceBookingWithWallet = memo(({ provider, mode, onClose }) => {
//   const { balance, deductFromWallet, isLoading } = useWallet();
//   const { showSuccess, showError } = useToast();
//   const [showConfirmation, setShowConfirmation] = useState(false);
//   const [bookingSuccess, setBookingSuccess] = useState(false);

//   const servicePrice = useMemo(() =>
//     provider.price?.[mode] || 0,
//     [provider.price, mode]
//   );

//   const hasInsufficientBalance = useMemo(() =>
//     balance < servicePrice,
//     [balance, servicePrice]
//   );

//   const balanceAfterPayment = useMemo(() =>
//     balance - servicePrice,
//     [balance, servicePrice]
//   );

//   const handleBooking = useCallback(async () => {
//     if (hasInsufficientBalance) {
//       showError('Insufficient wallet balance');
//       return;
//     }

//     try {
//       await deductFromWallet(
//         servicePrice,
//         `${mode.charAt(0).toUpperCase() + mode.slice(1)} Service - ${provider.name}`,
//         {
//           serviceType: mode,
//           providerId: provider._id,
//           serviceId: `service_${Date.now()}`,
//           metadata: {
//             providerName: provider.name,
//             serviceMode: mode,
//             bookingTime: new Date().toISOString()
//           }
//         }
//       );

//       setShowConfirmation(false);
//       setBookingSuccess(true);

//       setTimeout(() => {
//         setBookingSuccess(false);
//         onClose();
//       }, 3000);
//     } catch (error) {
//       console.error('Booking failed:', error);
//     }
//   }, [hasInsufficientBalance, deductFromWallet, servicePrice, mode, provider, showError, onClose]);

//   if (bookingSuccess) {
//     return (
//       <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//         <div className="bg-white rounded-2xl shadow-lg max-w-sm w-full p-6 text-center">
//           <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
//             <CheckCircle className="w-6 h-6 text-green-600" />
//           </div>
//           <h3 className="text-lg font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
//           <p className="text-gray-600 text-sm mb-3">Your service has been booked successfully</p>
//           <div className="text-xs text-gray-500">
//             Payment of {formatCurrency(servicePrice)} deducted from wallet
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl shadow-lg max-w-sm w-full border">
//         {!showConfirmation ? (
//           <div className="p-4">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-bold text-gray-900">Book Service</h3>
//               <button
//                 onClick={onClose}
//                 className="p-1.5 hover:bg-gray-100 rounded-lg"
//                 aria-label="Close modal"
//               >
//                 <X className="w-4 h-4" />
//               </button>
//             </div>

//             <div className="mb-4 p-3 bg-gray-50 rounded-xl">
//               <div className="flex items-center gap-2 mb-2">
//                 <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
//                   {provider.name?.charAt(0) || 'P'}
//                 </div>
//                 <div>
//                   <div className="font-medium text-sm">{provider.name}</div>
//                   <div className="text-xs text-gray-600 capitalize">{mode} Consultation</div>
//                 </div>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="font-medium text-sm">Service Fee:</span>
//                 <span className="font-bold text-base">{formatCurrency(servicePrice)}</span>
//               </div>
//             </div>

//             <div className="mb-4 p-3 bg-blue-50 rounded-xl">
//               <div className="flex items-center justify-between">
//                 <span className="font-medium text-sm text-blue-800">Wallet Balance:</span>
//                 <span className="font-bold text-base text-blue-600">{formatCurrency(balance)}</span>
//               </div>
//               {hasInsufficientBalance && (
//                 <div className="mt-1 text-xs text-red-600 flex items-center gap-1">
//                   <AlertCircle className="w-3 h-3" />
//                   Insufficient balance. Please add money.
//                 </div>
//               )}
//             </div>

//             <div className="flex gap-2">
//               <button
//                 onClick={onClose}
//                 className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium text-sm transition-all"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() => setShowConfirmation(true)}
//                 disabled={hasInsufficientBalance}
//                 className="flex-1 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
//               >
//                 {hasInsufficientBalance ? 'Insufficient' : 'Proceed to Pay'}
//               </button>
//             </div>
//           </div>
//         ) : (
//           <div className="p-4">
//             <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">Confirm Payment</h3>

//             <div className="space-y-2 mb-4 text-sm">
//               <div className="flex justify-between">
//                 <span>Service Fee:</span>
//                 <span className="font-bold">{formatCurrency(servicePrice)}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Current Balance:</span>
//                 <span className="font-bold">{formatCurrency(balance)}</span>
//               </div>
//               <div className="border-t border-gray-200 pt-2 flex justify-between font-bold">
//                 <span>Balance After:</span>
//                 <span className="text-blue-600">{formatCurrency(balanceAfterPayment)}</span>
//               </div>
//             </div>

//             <div className="flex gap-2">
//               <button
//                 onClick={() => setShowConfirmation(false)}
//                 className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium text-sm transition-all"
//               >
//                 Back
//               </button>
//               <button
//                 onClick={handleBooking}
//                 disabled={isLoading}
//                 className="flex-1 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-1 text-sm"
//               >
//                 {isLoading ? (
//                   <>
//                     <RefreshCw className="w-3 h-3 animate-spin" />
//                     Processing...
//                   </>
//                 ) : (
//                   'Confirm Payment'
//                 )}
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// });

// // ==================== MAIN APP ====================
// const WalletApp = () => {
//   const [isAuthenticated] = useState(true);
//   const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);

//   useEffect(() => {
//     const checkPaymentStatus = () => {
//       const urlParams = new URLSearchParams(window.location.search);
//       const orderId = urlParams.get('order_id'); // Changed from session_id to order_id

//       if (orderId) {
//         setShowPaymentSuccess(true);
//       }
//     };

//     checkPaymentStatus();
//   }, []);

//   const handleReturnToWallet = useCallback(() => {
//     window.history.pushState({}, '', '/wallet');
//     setShowPaymentSuccess(false);
//   }, []);

//   return (
//     <ToastProvider>
//       <WalletProvider>
//         <div className="min-h-screen">
//           {!isAuthenticated ? (
//             <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/40 p-4">
//               <div className="text-center bg-white p-6 rounded-2xl shadow-lg max-w-sm w-full">
//                 <h1 className="text-xl font-bold mb-2">Please Login</h1>
//                 <p className="text-gray-600 text-sm">Authentication required</p>
//               </div>
//             </div>
//           ) : showPaymentSuccess ? (
//             <PaymentSuccessPage onReturnToWallet={handleReturnToWallet} />
//           ) : (
//             <WalletDashboard />
//           )}
//         </div>
//       </WalletProvider>
//     </ToastProvider>
//   );
// };

// export default WalletApp;














import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import {
  Wallet, RefreshCw, Bell, Plus, Eye, EyeOff,
  ArrowUpRight, ArrowDownLeft, Receipt, CheckCircle,
  AlertCircle, CreditCard, Shield, ExternalLink, History,
  Search, X, Download
} from 'lucide-react';
import Loder from '../../components/Loading';
import { useWallet, useToast } from './contexts';
import { RechargeForm, TransactionItem, RechargeModal } from './components';
import { formatCurrency, formatDate } from './constants';
import { walletAPI } from './services';
import { useWallet as useGlobalWallet } from '../Booking/hooks/useWallet';

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
          const amount = response.data.amount;
          await walletAPI.rechargeWallet(amount, orderId);
          await refreshWallet();
          await refreshHeaderWallet();  // 🔥 this updates Header wallet instantly
          setPaymentDetails({ amount, orderId, status: 'success' });
          showSuccess(`₹${amount} added to your wallet!`);
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
  }, [refreshWallet, showSuccess]);

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
          <div className="bg-gray-50 rounded-xl p-3 mb-4 text-left text-sm">
            <div className="flex justify-between mb-1">
              <span className="text-gray-600">Amount Added:</span>
              <span className="font-bold text-green-600">₹{paymentDetails.amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Transaction ID:</span>
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