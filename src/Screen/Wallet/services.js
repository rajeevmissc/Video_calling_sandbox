import { API_BASE_URL, CASHFREE_MODE } from './constants';

// ==================== CASHFREE MANAGER ====================
class CashfreeManager {
  constructor() {
    this.cashfreePromise = null;
  }

  async getCashfree() {
    if (!this.cashfreePromise) {
      this.cashfreePromise = this.loadCashfree();
    }
    return this.cashfreePromise;
  }

  async loadCashfree() {
    if (window.Cashfree) {
      return window.Cashfree({ mode: CASHFREE_MODE });
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
      script.onload = () => {
        if (window.Cashfree) {
          resolve(window.Cashfree({ mode: CASHFREE_MODE }));
        } else {
          reject(new Error('Cashfree SDK loaded but not available'));
        }
      };
      script.onerror = () => reject(new Error('Failed to load Cashfree SDK'));
      document.head.appendChild(script);
    });
  }
}

export const cashfreeManager = new CashfreeManager();

// ==================== WALLET API ====================
class WalletAPI {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  getAuthToken() {
    return localStorage.getItem('token') || '';
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  }

  async getBalance() {
    return this.request('/wallet/balance');
  }

  async rechargeWallet(amount, transactionId) {
    return this.request('/wallet/recharge', {
      method: 'POST',
      body: JSON.stringify({
        amount,
        paymentMethod: 'Cashfree Checkout',
        transactionId,
        description: `Wallet Recharge via Cashfree`
      }),
    });
  }

  async deductFromWallet(amount, description, serviceId, serviceType, providerId, metadata = {}) {
    console.log('data', amount, description, serviceId, serviceType, providerId, metadata);
    return this.request('/wallet/deduct', {
      method: 'POST',
      body: JSON.stringify({
        amount,
        description,
        serviceId,
        serviceType,
        providerId,
        metadata,
        paymentMethod: "wallet"
      }),
    });
  }

  async getWalletStats() {
    return this.request('/wallet/stats');
  }

  async createCheckoutSession(amount, paymentMethods = ['card']) {
    return this.request('/payments/create-checkout-session', {
      method: 'POST',
      body: JSON.stringify({
        amount: amount * 100, // Convert to smallest currency unit
        currency: 'INR',
        payment_method_types: paymentMethods,
        metadata: { type: 'wallet_recharge' }
      }),
    });
  }

  async verifyPaymentSession(sessionId) {
    return this.request(`/payments/verify-session/${sessionId}`);
  }

  async getTransactions(page = 1, limit = 10) {
    return this.request(`/transactions?page=${page}&limit=${limit}`);
  }
}

export const walletAPI = new WalletAPI();