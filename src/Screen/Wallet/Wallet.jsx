import React from 'react';
import WalletApp from './WalletApp';
import { Helmet } from 'react-helmet-async';

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
      <WalletApp />
    </>
  );
};

export default Wallet;