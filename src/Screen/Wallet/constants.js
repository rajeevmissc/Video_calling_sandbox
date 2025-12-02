import {
  CreditCard, Smartphone, Building2, Wallet,
  Phone, Video, MapPin, Receipt
} from 'lucide-react';

// ==================== API CONFIGURATION ====================
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002/api';
export const CASHFREE_APP_ID = '11403793dac4227dd9e9561b5519730411' || 'TEST_APP_ID';
export const CASHFREE_MODE = 'production' || 'sandbox'; // 'sandbox' or 'production'

// ==================== PAYMENT OPTIONS ====================
export const PAYMENT_OPTIONS = Object.freeze([
  {
    id: 'card',
    name: 'Credit/Debit Cards',
    description: 'Visa, MasterCard, RuPay, Amex',
    icon: CreditCard,
    popular: true,
    cashfreeType: 'cc,dc'
  },
  {
    id: 'upi',
    name: 'UPI',
    description: 'Google Pay, PhonePe, Paytm, BHIM',
    icon: Smartphone,
    popular: true,
    cashfreeType: 'upi'
  },
  {
    id: 'netbanking',
    name: 'Net Banking',
    description: 'All major Indian banks',
    icon: Building2,
    popular: true,
    cashfreeType: 'nb'
  },
  {
    id: 'wallet',
    name: 'Wallets',
    description: 'Paytm, PhonePe & more',
    icon: Wallet,
    popular: false,
    cashfreeType: 'wallet'
  }
]);

// ==================== QUICK AMOUNTS ====================
export const QUICK_AMOUNTS = Object.freeze([
  100, 200, 500, 750, 1000, 2000, 3000, 5000, 7500, 10000, 15000, 20000
]);

// ==================== TOAST TYPES ====================
export const TOAST_TYPES = Object.freeze({
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
});

export const TOAST_DURATION = 5000;

// ==================== UTILITY FUNCTIONS ====================
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0.00';
  return `₹${Number(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getServiceIcon = (serviceType) => {
  const iconMap = {
    call: Phone,
    video: Video,
    visit: MapPin
  };
  return iconMap[serviceType] || Receipt;
};

export const getCashfreePaymentMethods = (methods) => {
  return methods
    .map(methodId => {
      const option = PAYMENT_OPTIONS.find(opt => opt.id === methodId);
      return option?.cashfreeType;
    })
    .filter(Boolean)
    .join(',');
};