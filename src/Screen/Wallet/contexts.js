// import { useState, useEffect, createContext, useContext, useCallback, useMemo, memo } from 'react';
// import { CheckCircle, AlertCircle, AlertTriangle, X } from 'lucide-react';
// import { TOAST_TYPES, TOAST_DURATION } from './constants';
// import { walletAPI, cashfreeManager } from './services';

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
//     console.log('deduction data',  amount,
//         description,
//         serviceDetails.serviceId,
//         serviceDetails.serviceType,
//         serviceDetails.providerId,
//         serviceDetails.metadata)
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








import { useState, useEffect, createContext, useContext, useCallback, useMemo, memo } from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, X } from 'lucide-react';
import { TOAST_TYPES, TOAST_DURATION } from './constants';
import { walletAPI, cashfreeManager } from './services';

// ==================== TOAST SYSTEM (UNCHANGED) ====================
const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

const Toast = memo(({ toast, onClose }) => {
  const icons = {
    [TOAST_TYPES.SUCCESS]: CheckCircle,
    [TOAST_TYPES.ERROR]: AlertCircle,
    [TOAST_TYPES.WARNING]: AlertTriangle
  };

  const colors = {
    [TOAST_TYPES.SUCCESS]: 'bg-green-50 border-green-200 text-green-800',
    [TOAST_TYPES.ERROR]: 'bg-red-50 border-red-200 text-red-800',
    [TOAST_TYPES.WARNING]: 'bg-yellow-50 border-yellow-200 text-yellow-800'
  };

  const Icon = icons[toast.type];

  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl border shadow-lg ${colors[toast.type]} animate-slide-in`}>
      <Icon className="w-4 h-4 flex-shrink-0" />
      <p className="font-medium text-sm flex-1">{toast.message}</p>
      <button
        onClick={onClose}
        className="p-1 hover:bg-black/10 rounded-lg flex-shrink-0"
        aria-label="Close notification"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
});

const ToastContainer = memo(({ toasts, removeToast }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          toast={toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
});

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = TOAST_TYPES.INFO, duration = TOAST_DURATION) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, duration }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const contextValue = useMemo(() => ({
    showSuccess: (message) => addToast(message, TOAST_TYPES.SUCCESS),
    showError: (message) => addToast(message, TOAST_TYPES.ERROR),
    showWarning: (message) => addToast(message, TOAST_TYPES.WARNING),
    showInfo: (message) => addToast(message, TOAST_TYPES.INFO)
  }), [addToast]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

// ==================== WALLET CONTEXT (UPDATED) ====================
const WalletContext = createContext(null);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }) => {
  const [state, setState] = useState({
    balance: 0,
    transactions: [],
    stats: null,
    isLoading: false,
    isInitialized: false,
    error: null
  });

  const { showSuccess, showError, showWarning } = useToast();

  const initializeWallet = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const [balanceResponse, statsResponse, transactionsResponse] = await Promise.all([
        walletAPI.getBalance(),
        walletAPI.getWalletStats(),
        walletAPI.getTransactions(1, 20)
      ]);

      const balance = balanceResponse.data?.balance || 0;
      const statsData = statsResponse.data?.summary || {
        credit: { totalAmount: 0, count: 0 },
        debit: { totalAmount: 0, count: 0 }
      };

      const transactions = (transactionsResponse.data?.transactions || []).map(t => ({
        id: t.id || t.reference,
        reference: t.reference,
        type: t.type,
        amount: t.amount,
        description: t.description,
        timestamp: t.createdAt,
        status: t.status,
        serviceType: t.serviceType
      }));

      setState({
        balance,
        stats: {
          totalCredits: statsData.credit.totalAmount,
          totalDebits: statsData.debit.totalAmount,
          totalTransactions: statsData.credit.count + statsData.debit.count
        },
        transactions,
        isInitialized: true,
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error('Failed to initialize wallet:', error);
      setState(prev => ({
        ...prev,
        error: error.message,
        isLoading: false,
        isInitialized: true
      }));
      showError('Failed to load wallet data');
    }
  }, [showError]);

  // UPDATED: Now accepts payment breakdown
  const rechargeWallet = useCallback(async (payableAmount, walletCreditAmount, breakdown, paymentMethods = ['card']) => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const cashfree = await cashfreeManager.getCashfree();
      if (!cashfree) throw new Error('Cashfree failed to initialize');

      const validMethods = paymentMethods.filter(method =>
        ['card', 'upi', 'netbanking', 'wallet'].includes(method)
      );

      if (validMethods.length === 0) {
        throw new Error('No valid payment methods selected');
      }

      const response = await walletAPI.createCheckoutSession(
        payableAmount, 
        walletCreditAmount, 
        breakdown, 
        validMethods
      );
      
      const { sessionId, url } = response.data;

      if (!sessionId && !url) throw new Error('Failed to create checkout session');

      showSuccess('Redirecting to payment gateway...');

      // Use direct URL redirect (recommended for Cashfree)
      if (url) {
        window.location.href = url;
      } else if (sessionId) {
        // Fallback: use Cashfree SDK checkout
        const checkoutOptions = {
          paymentSessionId: sessionId,
          returnUrl: `${window.location.origin}/wallet?order_id={order_id}`,
        };
        
        cashfree.checkout(checkoutOptions).then((result) => {
          if (result.error) {
            console.error('Payment failed:', result.error);
            setState(prev => ({ ...prev, isLoading: false }));
            showError('Payment failed: ' + result.error.message);
          }
          if (result.redirect) {
            console.log('Payment will be redirected');
          }
          if (result.paymentDetails) {
            console.log('Payment completed:', result.paymentDetails);
            showSuccess('Payment successful!');
          }
        }).catch((error) => {
          console.error('Cashfree checkout error:', error);
          setState(prev => ({ ...prev, isLoading: false }));
          showError('Payment initialization failed');
        });
      }
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      showError('Failed to initiate payment: ' + error.message);
      console.error('Payment error:', error);
    }
  }, [showSuccess, showError]);

  // UNCHANGED: deductFromWallet remains the same
  const deductFromWallet = useCallback(async (amount, description, serviceDetails = {}) => {
    if (state.balance < amount) {
      showWarning('Insufficient wallet balance');
      throw new Error('Insufficient balance');
    }

    setState(prev => ({ ...prev, isLoading: true }));
    console.log('deduction data',  amount,
        description,
        serviceDetails.serviceId,
        serviceDetails.serviceType,
        serviceDetails.providerId,
        serviceDetails.metadata)
    
    try {
      await walletAPI.deductFromWallet(
        amount,
        description,
        serviceDetails.serviceId,
        serviceDetails.serviceType,
        serviceDetails.providerId,
        serviceDetails.metadata
      );

      await initializeWallet();
      showSuccess('Payment successful!');
      return { success: true };
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      showError('Payment failed');
      throw error;
    }
  }, [state.balance, showSuccess, showError, showWarning, initializeWallet]);

  useEffect(() => {
    initializeWallet();
  }, [initializeWallet]);

  const contextValue = useMemo(() => ({
    ...state,
    rechargeWallet,
    deductFromWallet,
    refreshWallet: initializeWallet
  }), [state, rechargeWallet, deductFromWallet, initializeWallet]);

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
};