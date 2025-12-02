import { useState } from 'react';
import { LayoutDashboard, Calendar, DollarSign, MessageSquare, Users, BookIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import OverviewTab from './Tabs/OverviewTab';
import TransactionsTab from './Tabs/TransactionsTab';
import TestimonialsTab from './Tabs/TestimonialsTab';
import { SessionsManagement } from './SessionsManagement';
import { Helmet } from 'react-helmet-async';
const UnifiedAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'transactions', label: 'Transactions', icon: DollarSign },
    { id: 'bookingManagement', label: 'Booking_Management', icon: BookIcon },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
    { id: 'onBoardProvider', label: 'On Board Provider', icon: Users },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);

    // Add navigation only for specific tabs
    if (tabId === 'onBoardProvider') {
      navigate('/provider-onboard-from');
    }
    if (tabId === 'bookingManagement') {
      navigate('/appointment');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'bookings':
        return <SessionsManagement />;
      case 'transactions':
        return <TransactionsTab />;
      case 'testimonials':
        return <TestimonialsTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Manage Users, Providers & Analytics</title>
        <meta name="description" content="Monitor users, providers, bookings, transactions and overall platform performance." />
        <meta name="keywords" content="admin panel emotional app, dashboard monitoring India, manage support service" />
        <meta property="og:title" content="Admin Dashboard" />
        <meta property="og:image" content="/seo-logo.png" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-600 mt-1">Manage your platform from one place</p>
          </div>

          {/* Tabs Navigation */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-6">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-semibold whitespace-nowrap transition-all duration-200 ${activeTab === tab.id
                      ? 'bg-white shadow-md text-blue-600'
                      : 'text-slate-600 hover:bg-white/50'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="animate-fadeIn">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </>
  );
};

export default UnifiedAdminDashboard;
