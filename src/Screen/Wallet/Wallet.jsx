import React from 'react';
import WalletApp from './WalletApp';
import { ToastProvider, WalletProvider } from './contexts';
import { Helmet } from 'react-helmet-async';
/**
 * Main Wallet Component with Providers
 * This is the entry point for the wallet feature
 * 
 * Usage:
 * import Wallet from './wallet/Wallet';
 * <Wallet />
 */
const Wallet = () => {
  return (
    <>
     <Helmet>
        <title>Your Wallet | Add Credits & View Transactions</title>
        <meta name="description" content="Manage your balance, transactions and secure payments easily." />
        <meta name="keywords" content="wallet emotional app, add credits online India, transaction history support" />

        <meta property="og:title" content="Your Wallet" />
        <meta property="og:description" content="wallet emotional app, add credits online India, transaction history support" />
        <meta property="og:image" content="/seo-logo.png" />
      </Helmet>
    <ToastProvider>
      <WalletProvider>
        <WalletApp />
      </WalletProvider>
    </ToastProvider>
   </>
  );
};

export default Wallet;