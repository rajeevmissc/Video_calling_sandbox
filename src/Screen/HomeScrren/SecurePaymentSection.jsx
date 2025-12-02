import React from 'react';
import { Shield, Smartphone, Wallet, CreditCard, Building, Banknote, Lock } from 'lucide-react';

const SecurePaymentSection = () => {
    const paymentMethods = [
        { name: "UPI", icon: Smartphone },
        { name: "Paytm", icon: Wallet },
        { name: "Google Pay", icon: Smartphone },
        { name: "PhonePe", icon: Smartphone },
        { name: "Cards", icon: CreditCard },
        { name: "Net Banking", icon: Building },
        { name: "Wallet", icon: Banknote }
    ];

    return (
        <section className="pb-6 pt-2 lg:py-6 bg-gradient-to-b from-white via-gray-50 to-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden shadow-xl">
                    {/* Content */}
                    <div className="relative z-10 max-w-6xl mx-auto">
                        {/* Single Row Layout */}
                        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
                            {/* Left Section - Header & Trust Badges */}
                            <div className="flex-1 text-center lg:text-left">
                                <div className="flex items-center justify-center lg:justify-start gap-3 mb-3">
                                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Shield className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl sm:text-2xl font-bold">
                                            Secure Payments
                                        </h2>
                                        <p className="text-xs text-white/80 flex items-center gap-1 justify-center lg:justify-start">
                                            <Lock className="w-3 h-3" />
                                            256-bit SSL Encryption
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-center lg:justify-start gap-2 mb-3">
                                    <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm px-2 py-1 rounded text-xs border border-white/20">
                                        <Shield className="w-3 h-3" />
                                        <span>PCI DSS</span>
                                    </div>
                                    <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm px-2 py-1 rounded text-xs border border-white/20">
                                        <Lock className="w-3 h-3" />
                                        <span>100% Secure</span>
                                    </div>
                                </div>
                            </div>

                            {/* Middle Section - Payment Methods */}
                            <div className="flex-1 border-l-0 lg:border-l border-white/20 lg:pl-6">
                                <p className="text-xs text-white/80 mb-2 text-center lg:text-left">
                                    Payment Methods:
                                </p>
                                <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                                    {paymentMethods.map((method, index) => {
                                        const IconComponent = method.icon;
                                        return (
                                            <div
                                                key={index}
                                                className="flex items-center gap-1 px-2 py-1 bg-white/15 backdrop-blur-sm rounded border border-white/20 hover:bg-white/25 transition-all duration-300"
                                            >
                                                <IconComponent className="w-3 h-3" />
                                                <span className="text-xs font-medium">{method.name}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Right Section - Stats */}
                            <div className="flex lg:flex-col gap-6 lg:gap-3 border-t lg:border-t-0 lg:border-l border-white/20 pt-4 lg:pt-0 lg:pl-6">
                                <div className="text-center">
                                    <div className="text-lg font-bold">₹0</div>
                                    <div className="text-xs text-white/80">Fees</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-bold">Instant</div>
                                    <div className="text-xs text-white/80">Confirm</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-bold">100%</div>
                                    <div className="text-xs text-white/80">Refund</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                </div>
            </div>
        </section>
    );
};

export default SecurePaymentSection;