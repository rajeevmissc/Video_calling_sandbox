import api from '../../../services/api';
export const walletService = {

  getBalance: async () => {
    try {
      const data = await api.get('/wallet/balance');
      return {
        success: true,
        data: {
          balance: data.data?.balance || 0,
          currency: 'INR',
          lastUpdated: data.data?.updatedAt || new Date().toISOString(),
          walletId: data.data?._id || data.data?.walletId
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  deductAmount: async (amount, bookingId, description = 'Booking payment', serviceType = 'call', providerId) => {
    try {
      const data = await api.post('/wallet/deduct', {
        amount: parseFloat(amount),
        description,
        serviceId: bookingId,
        serviceType,
        providerId,
        paymentMethod: 'Cashfree',
        metadata: { type: serviceType, bookingId, timestamp: new Date().toISOString() }
      });
      return {
        success: true,
        data: {
          transactionId: data.data?.transactionId || data.data?._id,
          newBalance: data.data?.newBalance || data.data?.balance,
          deductedAmount: amount
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  recharge: async (amount, paymentMethod = 'card') => {
    try {
      const data = await api.post('/wallet/recharge', {
        amount: parseFloat(amount),
        paymentMethod,
        transactionId: `booking_${Date.now()}`,
        description: 'Wallet recharge for booking',
        metadata: { source: 'booking_module', timestamp: new Date().toISOString() }
      });
      return {
        success: true,
        data: {
          transactionId: data.data?.transactionId || data.data?._id,
          newBalance: data.data?.newBalance || data.data?.balance,
          addedAmount: amount,
          paymentMethod
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  getStats: async () => {
    try {
      const data = await api.get('/wallet/stats');
      return { success: true, data: data.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  checkBalance: async (requiredAmount) => {
    try {
      const balanceResponse = await walletService.getBalance();
      if (!balanceResponse.success) return { success: false, hasEnough: false, error: balanceResponse.error };
      const currentBalance = balanceResponse.data.balance;
      return {
        success: true,
        hasEnough: currentBalance >= requiredAmount,
        currentBalance,
        requiredAmount,
        shortfall: currentBalance >= requiredAmount ? 0 : requiredAmount - currentBalance
      };
    } catch (error) {
      return { success: false, hasEnough: false, error: error.message };
    }
  },

  createCheckoutSession: async (amount, paymentMethods = ['card']) => {
    try {
      const data = await api.post('/payments/create-checkout-session', {
        amount: amount,
        currency: 'inr',
        payment_method_types: paymentMethods,
        metadata: { type: 'wallet_recharge', source: 'booking_module' }
      });
      return { success: true, data: data.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};