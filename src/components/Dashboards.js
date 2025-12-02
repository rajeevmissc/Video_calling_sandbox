import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services/userService';
import {
    User,
    Phone,
    Shield,
    Star,
    LogOut,
    Settings,
    Heart,
    Award,
    Users,
    Activity,
    Clock,
    MapPin,
    Globe,
    Smartphone,
    Bell,
    CreditCard,
    Calendar,
    TrendingUp,
    CheckCircle,
    AlertCircle,
    Edit,
    Eye,
    EyeOff,
    ChevronRight,
    Briefcase,
    Mail
} from 'lucide-react';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [showPhoneNumber, setShowPhoneNumber] = useState(false);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const [statsResponse, sessionsResponse] = await Promise.all([
                userService.getStats(),
                userService.getSessions()
            ]);

            if (statsResponse.success) {
                setStats(statsResponse.data.stats);
            }

            if (sessionsResponse.success) {
                setSessions(sessionsResponse.data.sessions);
            }
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const maskPhone = (phone) => {
        if (!phone) return '';
        const str = phone.toString().replace(/\D/g, '');
        if (str.length < 3) return phone;
        return '***' + str.slice(-3);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-white/20 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                <Heart className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    ServiceConnect Dashboard
                                </h1>
                                <p className="text-sm text-gray-600">
                                    Manage your account and services
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => navigate('/settings')}
                                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-300"
                            >
                                <Settings size={18} />
                                <span className="hidden sm:inline">Settings</span>
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300"
                            >
                                <LogOut size={18} />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* User Profile Card */}
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-6 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <div className="w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                                    {(user?.profile?.fullName || user?.phoneNumber)?.[0]?.toUpperCase() || 'U'}
                                </div>
                                {user?.isVerified && (
                                    <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                                        <CheckCircle className="w-4 h-4 text-white" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {user?.profile?.fullName || maskPhone(user?.phoneNumber) || 'User'}
                                </h2>
                                <div className="flex items-center space-x-2 mt-1">
                                    <Phone size={14} className="text-gray-500" />
                                    <span className="text-gray-600 text-sm">
                                        {showPhoneNumber ? user?.phoneNumber : maskPhone(user?.phoneNumber)}
                                    </span>
                                    <button
                                        onClick={() => setShowPhoneNumber(!showPhoneNumber)}
                                        className="text-indigo-600 hover:text-indigo-700"
                                    >
                                        {showPhoneNumber ? <EyeOff size={14} /> : <Eye size={14} />}
                                    </button>
                                </div>
                                <div className="flex items-center space-x-3 mt-2">
                                    <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                                        user?.status === 'active' 
                                            ? 'bg-green-100 text-green-700' 
                                            : 'bg-gray-100 text-gray-700'
                                    }`}>
                                        <div className={`w-2 h-2 rounded-full ${
                                            user?.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                                        }`}></div>
                                        <span>{user?.status || 'Unknown'}</span>
                                    </span>
                                    {user?.isVerified && (
                                        <span className="inline-flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                            <Shield size={12} />
                                            <span>Verified</span>
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/profile/edit')}
                            className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                        >
                            <Edit size={18} />
                            <span>Edit Profile</span>
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white/90 backdrop-blur-xl rounded-xl shadow-lg border border-white/50 p-6 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                                <Activity className="text-white" size={24} />
                            </div>
                            <TrendingUp className="text-green-500" size={20} />
                        </div>
                        <p className="text-sm text-gray-600 font-medium mb-1">Total Logins</p>
                        <p className="text-3xl font-bold text-gray-900">
                            {user?.stats?.totalLogins || 0}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                            Last: {formatDateTime(user?.stats?.lastLogin)}
                        </p>
                    </div>

                    <div className="bg-white/90 backdrop-blur-xl rounded-xl shadow-lg border border-white/50 p-6 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                <Users className="text-white" size={24} />
                            </div>
                            <CheckCircle className="text-green-500" size={20} />
                        </div>
                        <p className="text-sm text-gray-600 font-medium mb-1">Active Sessions</p>
                        <p className="text-3xl font-bold text-gray-900">
                            {sessions.length || 0}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                            Across all devices
                        </p>
                    </div>

                    <div className="bg-white/90 backdrop-blur-xl rounded-xl shadow-lg border border-white/50 p-6 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                <Calendar className="text-white" size={24} />
                            </div>
                            <Star className="text-yellow-500" size={20} />
                        </div>
                        <p className="text-sm text-gray-600 font-medium mb-1">Member Since</p>
                        <p className="text-3xl font-bold text-gray-900">
                            {new Date(user?.createdAt).getFullYear() || 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                            {formatDate(user?.createdAt)}
                        </p>
                    </div>

                    <div className="bg-white/90 backdrop-blur-xl rounded-xl shadow-lg border border-white/50 p-6 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                                <Shield className="text-white" size={24} />
                            </div>
                            {user?.isVerified ? (
                                <CheckCircle className="text-green-500" size={20} />
                            ) : (
                                <AlertCircle className="text-orange-500" size={20} />
                            )}
                        </div>
                        <p className="text-sm text-gray-600 font-medium mb-1">Account Status</p>
                        <p className="text-3xl font-bold text-gray-900 capitalize">
                            {user?.status || 'Active'}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                            {user?.isVerified ? 'Fully verified' : 'Pending verification'}
                        </p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-6">
                    <div className="bg-white/90 backdrop-blur-xl rounded-xl shadow-lg border border-white/50 p-2 inline-flex space-x-2">
                        {['overview', 'sessions', 'preferences'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                                    activeTab === tab
                                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* Account Information */}
                        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                                <User size={24} className="text-indigo-600" />
                                <span>Account Information</span>
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600 flex items-center space-x-2 mb-2">
                                            <User size={16} />
                                            <span>Full Name</span>
                                        </label>
                                        <p className="text-gray-900 font-semibold">
                                            {user?.profile?.fullName || 'Not set'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600 flex items-center space-x-2 mb-2">
                                            <Phone size={16} />
                                            <span>Phone Number</span>
                                        </label>
                                        <p className="text-gray-900 font-semibold">
                                            {user?.phoneNumber}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600 flex items-center space-x-2 mb-2">
                                            <Globe size={16} />
                                            <span>Country Code</span>
                                        </label>
                                        <p className="text-gray-900 font-semibold">
                                            +{user?.countryCode}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600 flex items-center space-x-2 mb-2">
                                            <Calendar size={16} />
                                            <span>Account Created</span>
                                        </label>
                                        <p className="text-gray-900 font-semibold">
                                            {formatDate(user?.createdAt)}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600 flex items-center space-x-2 mb-2">
                                            <Clock size={16} />
                                            <span>Last Updated</span>
                                        </label>
                                        <p className="text-gray-900 font-semibold">
                                            {formatDate(user?.updatedAt)}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600 flex items-center space-x-2 mb-2">
                                            <Shield size={16} />
                                            <span>Verification Status</span>
                                        </label>
                                        <p className={`font-semibold ${
                                            user?.isVerified ? 'text-green-600' : 'text-orange-600'
                                        }`}>
                                            {user?.isVerified ? 'Verified' : 'Not Verified'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                                <Briefcase size={24} className="text-indigo-600" />
                                <span>Quick Actions</span>
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <button
                                    onClick={() => navigate('/profile/edit')}
                                    className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 rounded-xl transition-all duration-300 group"
                                >
                                    <div className="flex items-center space-x-3">
                                        <Edit className="text-indigo-600" size={20} />
                                        <span className="font-medium text-gray-900">Edit Profile</span>
                                    </div>
                                    <ChevronRight className="text-gray-400 group-hover:text-indigo-600 transition-colors" size={20} />
                                </button>
                                <button
                                    onClick={() => navigate('/wallet')}
                                    className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-xl transition-all duration-300 group"
                                >
                                    <div className="flex items-center space-x-3">
                                        <CreditCard className="text-green-600" size={20} />
                                        <span className="font-medium text-gray-900">My Wallet</span>
                                    </div>
                                    <ChevronRight className="text-gray-400 group-hover:text-green-600 transition-colors" size={20} />
                                </button>
                                <button
                                    onClick={() => navigate('/notifications')}
                                    className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 rounded-xl transition-all duration-300 group"
                                >
                                    <div className="flex items-center space-x-3">
                                        <Bell className="text-orange-600" size={20} />
                                        <span className="font-medium text-gray-900">Notifications</span>
                                    </div>
                                    <ChevronRight className="text-gray-400 group-hover:text-orange-600 transition-colors" size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'sessions' && (
                    <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                                <Smartphone size={24} className="text-indigo-600" />
                                <span>Active Sessions</span>
                            </h3>
                            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
                                {sessions.length} Active
                            </span>
                        </div>

                        <div className="space-y-4">
                            {sessions.length > 0 ? sessions.map((session, index) => (
                                <div key={session.id || index} className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors duration-300">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                                            <Smartphone className="text-white" size={20} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                {session.deviceInfo?.platform || 'Unknown Device'}
                                            </p>
                                            <div className="flex items-center space-x-4 mt-1">
                                                <span className="text-sm text-gray-600 flex items-center space-x-1">
                                                    <Clock size={14} />
                                                    <span>{formatDateTime(session.lastActivity)}</span>
                                                </span>
                                                <span className="text-sm text-gray-600 flex items-center space-x-1">
                                                    <MapPin size={14} />
                                                    <span>{session.ipAddress || 'Unknown'}</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {session.isCurrent && (
                                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                            Current
                                        </span>
                                    )}
                                </div>
                            )) : (
                                <div className="text-center py-12">
                                    <Smartphone className="mx-auto text-gray-400 mb-4" size={48} />
                                    <p className="text-gray-600">No active sessions found</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'preferences' && (
                    <div className="space-y-6">
                        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                                <Settings size={24} className="text-indigo-600" />
                                <span>Preferences</span>
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <label className="text-sm font-medium text-gray-600 flex items-center space-x-2 mb-3">
                                        <Globe size={16} />
                                        <span>Language</span>
                                    </label>
                                    <p className="text-gray-900 font-semibold capitalize">
                                        {user?.preferences?.language || 'English'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600 flex items-center space-x-2 mb-3">
                                        <Bell size={16} />
                                        <span>Notification Settings</span>
                                    </label>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <span className="text-gray-700">SMS Notifications</span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                user?.preferences?.notifications?.sms 
                                                    ? 'bg-green-100 text-green-700' 
                                                    : 'bg-gray-200 text-gray-700'
                                            }`}>
                                                {user?.preferences?.notifications?.sms ? 'On' : 'Off'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <span className="text-gray-700">Email Notifications</span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                user?.preferences?.notifications?.email 
                                                    ? 'bg-green-100 text-green-700' 
                                                    : 'bg-gray-200 text-gray-700'
                                            }`}>
                                                {user?.preferences?.notifications?.email ? 'On' : 'Off'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <span className="text-gray-700">Push Notifications</span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                user?.preferences?.notifications?.push 
                                                    ? 'bg-green-100 text-green-700' 
                                                    : 'bg-gray-200 text-gray-700'
                                            }`}>
                                                {user?.preferences?.notifications?.push ? 'On' : 'Off'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600 flex items-center space-x-2 mb-3">
                                        <Activity size={16} />
                                        <span>Theme</span>
                                    </label>
                                    <p className="text-gray-900 font-semibold capitalize">
                                        {user?.preferences?.theme || 'Auto'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Login Stats */}
                        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                                <Activity size={24} className="text-indigo-600" />
                                <span>Login Statistics</span>
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                                    <span className="text-gray-700 font-medium">Last Login</span>
                                    <span className="text-gray-900 font-semibold">{formatDateTime(user?.stats?.lastLogin)}</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                                    <span className="text-gray-700 font-medium">Last Login IP</span>
                                    <span className="text-gray-900 font-semibold">{user?.stats?.lastLoginIP || 'N/A'}</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                                    <span className="text-gray-700 font-medium">Account Created IP</span>
                                    <span className="text-gray-900 font-semibold">{user?.stats?.accountCreatedIP || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;