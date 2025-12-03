// import {
//   CreditCard, Smartphone, Building2, Wallet,
//   Phone, Video, MapPin, Receipt
// } from 'lucide-react';

// // ==================== API CONFIGURATION ====================
// export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002/api';
// export const CASHFREE_APP_ID = '11403793dac4227dd9e9561b5519730411' || 'TEST_APP_ID';
// export const CASHFREE_MODE = 'production' || 'sandbox'; // 'sandbox' or 'production'

// // ==================== PAYMENT OPTIONS ====================
// export const PAYMENT_OPTIONS = Object.freeze([
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

// // ==================== QUICK AMOUNTS ====================
// export const QUICK_AMOUNTS = Object.freeze([
//   100, 200, 500, 750, 1000, 2000, 3000, 5000, 7500, 10000, 15000, 20000
// ]);

// // ==================== TOAST TYPES ====================
// export const TOAST_TYPES = Object.freeze({
//   SUCCESS: 'success',
//   ERROR: 'error',
//   WARNING: 'warning',
//   INFO: 'info'
// });

// export const TOAST_DURATION = 5000;

// // ==================== UTILITY FUNCTIONS ====================
// export const formatCurrency = (amount) => {
//   if (amount === undefined || amount === null || isNaN(amount)) return '₹0.00';
//   return `₹${Number(amount).toLocaleString('en-IN', {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2
//   })}`;
// };

// export const formatDate = (dateString) => {
//   return new Date(dateString).toLocaleDateString('en-IN', {
//     year: 'numeric',
//     month: 'short',
//     day: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit'
//   });
// };

// export const getServiceIcon = (serviceType) => {
//   const iconMap = {
//     call: Phone,
//     video: Video,
//     visit: MapPin
//   };
//   return iconMap[serviceType] || Receipt;
// };

// export const getCashfreePaymentMethods = (methods) => {
//   return methods
//     .map(methodId => {
//       const option = PAYMENT_OPTIONS.find(opt => opt.id === methodId);
//       return option?.cashfreeType;
//     })
//     .filter(Boolean)
//     .join(',');
// };








import {
  CreditCard, Smartphone, Building2, Wallet,
  Phone, Video, MapPin, Receipt
} from 'lucide-react';

// ==================== API CONFIGURATION ====================
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002/api';
export const CASHFREE_APP_ID = '11403793dac4227dd9e9561b5519730411' || 'TEST_APP_ID';
export const CASHFREE_MODE = 'production' || 'sandbox';

// ==================== DISCOUNT TIERS ====================
export const DISCOUNT_TIERS = Object.freeze([
  { min: 2000, discount: 40, label: 'Best Value' },
  { min: 1500, discount: 35, label: 'Great Deal' },
  { min: 1000, discount: 30, label: 'Popular' },
  { min: 750, discount: 25, label: 'Good Deal' },
  { min: 100, discount: 20, label: 'Starter' }
]);

export const GST_RATE = 0.18; // 18% GST

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
  100, 200, 500, 750, 1000, 1500, 2000, 3000, 5000, 10000
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

// ==================== DISCOUNT CALCULATION ====================
export const calculateDiscount = (amount) => {
  const tier = DISCOUNT_TIERS.find(t => amount >= t.min);
  
  if (!tier) {
    return {
      discountPercent: 0,
      discountAmount: 0,
      bonusAmount: 0,
      totalWalletCredit: amount,
      label: null
    };
  }

  const bonusAmount = (amount * tier.discount) / 100;
  
  return {
    discountPercent: tier.discount,
    discountAmount: bonusAmount,
    bonusAmount: bonusAmount,
    totalWalletCredit: amount + bonusAmount,
    label: tier.label
  };
};

export const calculatePaymentBreakdown = (amount) => {
  const discount = calculateDiscount(amount);
  const gstAmount = amount * GST_RATE;
  const finalPayableAmount = amount + gstAmount;

  return {
    baseAmount: amount,
    gstAmount: gstAmount,
    gstPercent: GST_RATE * 100,
    finalPayableAmount: finalPayableAmount,
    ...discount
  };
};