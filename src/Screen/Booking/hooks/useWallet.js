import { useState, useEffect, useCallback } from 'react';
import { walletService } from '../services/walletService';
import { checkWalletThreshold } from '../utils/bookingValidation';

// Stripe configuration - matching your existing setup
const STRIPE_PUBLISHABLE_KEY = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_51234567890abcdef';

let stripePromise;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe();
  }
  return stripePromise;
};

const loadStripe = async () => {
  if (window.Stripe) {
    return window.Stripe(STRIPE_PUBLISHABLE_KEY);
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.onload = () => resolve(window.Stripe(STRIPE_PUBLISHABLE_KEY));
    script.onerror = () => reject(new Error('Failed to load Stripe'));
    document.head.appendChild(script);
  });
};

export const useWallet = () => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [walletData, setWalletData] = useState(null);

  const fetchBalance = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await walletService.getBalance();
      if (response.success) {
        setBalance(response.data.balance);
        setWalletData(response.data);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);


  const checkBalance = useCallback((servicePrice) => {
    return checkWalletThreshold(balance, servicePrice);
  }, [balance]);

  // Recharge using Stripe - matching your existing implementation
  const recharge = useCallback(async (amount, paymentMethods = ['card']) => {
    setLoading(true);
    setError(null);
    
    try {
      const stripe = await getStripe();
      if (!stripe) throw new Error('Stripe failed to initialize');

      // Ensure payment methods are valid Stripe types
      const validStripeMethods = Array.isArray(paymentMethods) 
        ? paymentMethods.filter(method => 
            ['card', 'paynow', 'fpx', 'google_pay'].includes(method)
          )
        : ['card'];

      if (validStripeMethods.length === 0) {
        throw new Error('No valid payment methods selected');
      }

      const response = await walletService.createCheckoutSession(amount, validStripeMethods);
      const { sessionId, url } = response.data;

      if (!sessionId) throw new Error('Failed to create checkout session');

      // Redirect to Stripe checkout
      if (url) {
        window.location.href = url;
      } else {
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) throw new Error(error.message);
      }

      return { success: true };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  }, []);

  const deduct = useCallback(async (amount, bookingId, description, serviceType = 'call', providerId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await walletService.deductAmount(amount, bookingId, description, serviceType, providerId);
      console.log(amount, bookingId, description, serviceType, providerId)
      if (response.success) {
        setBalance(response.data.newBalance);
        // Refresh balance to get latest data
        await fetchBalance();
        return { success: true, data: response.data };
      } else {
        setError(response.error);
        return { success: false, error: response.error };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [fetchBalance]);

  const checkSufficientBalance = useCallback(async (requiredAmount) => {
    try {
      const response = await walletService.checkBalance(requiredAmount);
      return response;
    } catch (err) {
      return {
        success: false,
        hasEnough: false,
        error: err.message
      };
    }
  }, []);

  const getStats = useCallback(async () => {
    try {
      const response = await walletService.getStats();
      return response;
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }, []);

  return {
    balance,
    loading,
    error,
    walletData,
    fetchBalance,
    checkBalance,
    recharge,
    deduct,
    checkSufficientBalance,
    getStats
  };
};