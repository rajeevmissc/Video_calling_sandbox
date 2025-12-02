import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Helmet } from 'react-helmet-async';
import {
    Share2,
    Copy,
    Check,
    Gift,
    Wallet,
    TrendingUp,
    Users,
    IndianRupee,
    Facebook,
    Twitter,
    Linkedin,
    Mail,
    MessageCircle,
    Link as LinkIcon,
    Sparkles,
    Award,
    ChevronRight,
    ExternalLink,
    Heart,
    Star,
    Activity
} from 'lucide-react';

const ShareComponent = () => {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState('share');
    const [referralStats, setReferralStats] = useState({
        totalReferrals: 0,
        successfulReferrals: 0,
        totalEarnings: 0,
        pendingEarnings: 0
    });

    const baseUrl = 'https://serviceconnect.app';
    const referralCode = user?.referralCode || 'DEMO123';
    const referralLink = `${baseUrl}?ref=${referralCode}`;
    const shareMessage = 'Join ServiceConnect - Your trusted companion services platform!';
    const referralMessage = `I'm using ServiceConnect for all my service needs! Use my referral code ${referralCode} to get up to 10% rewards on your first recharge, and we both earn!`;

    useEffect(() => {
        if (isAuthenticated) {
            // Load referral stats from API
            loadReferralStats();
        }
    }, [isAuthenticated]);

    const loadReferralStats = async () => {
        try {
            // Simulated API call - replace with actual API
            setReferralStats({
                totalReferrals: 12,
                successfulReferrals: 8,
                totalEarnings: 240,
                pendingEarnings: 60
            });
        } catch (error) {
            console.error('Failed to load referral stats:', error);
        }
    };

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const shareToSocialMedia = (platform) => {
        const message = isAuthenticated ? referralMessage : shareMessage;
        const url = isAuthenticated ? referralLink : baseUrl;

        const shareUrls = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(message)}`,
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(url)}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
            whatsapp: `https://wa.me/?text=${encodeURIComponent(message + ' ' + url)}`,
            email: `mailto:?subject=${encodeURIComponent('Check out ServiceConnect')}&body=${encodeURIComponent(message + '\n\n' + url)}`
        };

        if (shareUrls[platform]) {
            window.open(shareUrls[platform], '_blank', 'width=600,height=400');
        }
    };

    const SocialButton = ({ icon: Icon, name, color, onClick }) => (
        <button
            onClick={onClick}
            className={`flex flex-col items-center justify-center p-4 rounded-xl bg-white hover:shadow-lg transition-all duration-300 transform hover:scale-105 border-2 border-transparent hover:border-${color}-200 group`}
        >
            <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="text-white" size={24} />
            </div>
            <span className="text-sm font-medium text-gray-700">{name}</span>
        </button>
    );

    return (
        <>
            <Helmet>
                <title>Share GetCompanion | Spread Happiness</title>
                <meta name="description" content="Invite someone who may be feeling lonely or overwhelmed. A simple share can change a life." />
                <meta name="keywords" content="share emotional support app, help lonely people, invite friends India" />

                <meta property="og:title" content="Share GetCompanion" />
                <meta property="og:description" content="Help others connect to real emotional support." />
                <meta property="og:image" content="/seo-logo.png" />
            </Helmet>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mb-4 shadow-lg">
                            <Share2 className="text-white" size={32} />
                        </div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                            Share ServiceConnect
                        </h1>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            {isAuthenticated
                                ? 'Share with friends and earn rewards for every successful referral!'
                                : 'Help others discover our trusted companion services platform'
                            }
                        </p>
                    </div>

                    {/* Tabs */}
                    {isAuthenticated && (
                        <div className="flex justify-center mb-8">
                            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-2 inline-flex space-x-2">
                                <button
                                    onClick={() => setActiveTab('share')}
                                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${activeTab === 'share'
                                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                                            : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    <div className="flex items-center space-x-2">
                                        <Share2 size={18} />
                                        <span>Share & Earn</span>
                                    </div>
                                </button>
                                <button
                                    onClick={() => setActiveTab('rewards')}
                                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${activeTab === 'rewards'
                                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                                            : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    <div className="flex items-center space-x-2">
                                        <Gift size={18} />
                                        <span>My Rewards</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Content */}
                    {activeTab === 'share' && (
                        <div className="space-y-6">
                            {/* Referral Benefits - Only for logged in users */}
                            {isAuthenticated && (
                                <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 text-white mb-6">
                                    <div className="flex flex-col md:flex-row items-center justify-between">
                                        <div className="mb-6 md:mb-0">
                                            <h2 className="text-3xl font-bold mb-3 flex items-center space-x-2">
                                                <Sparkles size={32} />
                                                <span>Refer & Earn Rewards!</span>
                                            </h2>
                                            <p className="text-indigo-100 text-lg mb-4">
                                                Share your unique referral code and earn money for every friend who signs up
                                            </p>
                                            <div className="flex flex-wrap gap-4">
                                                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                                                    <span className="font-semibold">10% of first recharge of referral</span>
                                                </div>
                                                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                                                    <Gift size={20} />
                                                    <span className="font-semibold">Friends get up to 10% on recharge</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center">
                                            <Wallet className="mx-auto mb-2" size={48} />
                                            <p className="text-sm text-indigo-100 mb-2">Total Earnings</p>
                                            <p className="text-4xl font-bold">₹{referralStats.totalEarnings}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Login CTA for non-authenticated users */}
                            {!isAuthenticated && (
                                <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-2xl shadow-xl p-8 text-white mb-6">
                                    <div className="flex flex-col md:flex-row items-center justify-between">
                                        <div className="mb-6 md:mb-0">
                                            <h2 className="text-3xl font-bold mb-3 flex items-center space-x-2">
                                                <Gift size={32} />
                                                <span>Want to Earn Money?</span>
                                            </h2>
                                            <p className="text-orange-100 text-lg mb-4">
                                                Sign in to get your unique referral code and start earning ₹20 for every friend you refer!
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => navigate('/auth/login')}
                                            className="bg-white text-orange-600 px-8 py-4 rounded-xl font-bold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                                        >
                                            <span>Sign In to Earn</span>
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Referral Link - Only for authenticated users */}
                            {isAuthenticated && (
                                <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-8">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                                        <LinkIcon className="text-indigo-600" size={24} />
                                        <span>Your Referral Link</span>
                                    </h3>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <div className="flex-1 flex items-center bg-gray-100 rounded-xl px-4 py-3 border-2 border-gray-200">
                                            <input
                                                type="text"
                                                value={referralLink}
                                                readOnly
                                                className="flex-1 bg-transparent text-gray-800 font-mono text-sm outline-none"
                                            />
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard(referralLink)}
                                            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 ${copied
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg'
                                                }`}
                                        >
                                            {copied ? (
                                                <>
                                                    <Check size={20} />
                                                    <span>Copied!</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy size={20} />
                                                    <span>Copy Link</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    <div className="mt-4 p-4 bg-indigo-50 rounded-xl border-2 border-indigo-100">
                                        <p className="text-sm text-indigo-800">
                                            <strong>Your Referral Code:</strong> <span className="font-mono text-lg">{referralCode}</span>
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Social Media Sharing */}
                            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                                    <Share2 className="text-indigo-600" size={24} />
                                    <span>Share on Social Media</span>
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                                    <SocialButton
                                        icon={Facebook}
                                        name="Facebook"
                                        color="from-blue-500 to-blue-600"
                                        onClick={() => shareToSocialMedia('facebook')}
                                    />
                                    <SocialButton
                                        icon={Twitter}
                                        name="Twitter"
                                        color="from-sky-400 to-sky-500"
                                        onClick={() => shareToSocialMedia('twitter')}
                                    />
                                    <SocialButton
                                        icon={Linkedin}
                                        name="LinkedIn"
                                        color="from-blue-600 to-blue-700"
                                        onClick={() => shareToSocialMedia('linkedin')}
                                    />
                                    <SocialButton
                                        icon={MessageCircle}
                                        name="WhatsApp"
                                        color="from-green-500 to-green-600"
                                        onClick={() => shareToSocialMedia('whatsapp')}
                                    />
                                    <SocialButton
                                        icon={Mail}
                                        name="Email"
                                        color="from-gray-500 to-gray-600"
                                        onClick={() => shareToSocialMedia('email')}
                                    />
                                </div>
                            </div>

                            {/* How It Works */}
                            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                                    <Award className="text-indigo-600" size={24} />
                                    <span>How It Works</span>
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                            <Share2 className="text-white" size={28} />
                                        </div>
                                        <h4 className="font-bold text-gray-900 mb-2">1. Share Your Link</h4>
                                        <p className="text-gray-600 text-sm">
                                            {isAuthenticated
                                                ? 'Share your unique referral link with friends and family'
                                                : 'Share ServiceConnect with your network on social media'
                                            }
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                            <Users className="text-white" size={28} />
                                        </div>
                                        <h4 className="font-bold text-gray-900 mb-2">2. They Sign Up & Recharge</h4>
                                        <p className="text-gray-600 text-sm">
                                            {isAuthenticated
                                                ? 'Your friend signs up with your code and gets up to 10% rewards when they recharge their wallet'
                                                : 'Help people discover our trusted services platform'
                                            }
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                            {isAuthenticated ? (
                                                <IndianRupee className="text-white" size={28} />
                                            ) : (
                                                <Heart className="text-white" size={28} />
                                            )}
                                        </div>
                                        <h4 className="font-bold text-gray-900 mb-2">
                                            {isAuthenticated ? '3. You Earn Money' : '3. Make an Impact'}
                                        </h4>
                                        <p className="text-gray-600 text-sm">
                                            {isAuthenticated
                                                ? 'Get ₹20 credited to your wallet for each successful referral'
                                                : 'Help build a community of trusted service connections'
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Rewards Tab - Only for authenticated users */}
                    {activeTab === 'rewards' && isAuthenticated && (
                        <div className="space-y-6">
                            {/* Stats Overview */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-white/90 backdrop-blur-xl rounded-xl shadow-lg border border-white/50 p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                                            <Users className="text-white" size={24} />
                                        </div>
                                        <TrendingUp className="text-green-500" size={20} />
                                    </div>
                                    <p className="text-sm text-gray-600 font-medium mb-1">Total Referrals</p>
                                    <p className="text-3xl font-bold text-gray-900">{referralStats.totalReferrals}</p>
                                </div>

                                <div className="bg-white/90 backdrop-blur-xl rounded-xl shadow-lg border border-white/50 p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                            <Star className="text-white" size={24} />
                                        </div>
                                        <Check className="text-green-500" size={20} />
                                    </div>
                                    <p className="text-sm text-gray-600 font-medium mb-1">Successful</p>
                                    <p className="text-3xl font-bold text-gray-900">{referralStats.successfulReferrals}</p>
                                </div>

                                <div className="bg-white/90 backdrop-blur-xl rounded-xl shadow-lg border border-white/50 p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                            <Wallet className="text-white" size={24} />
                                        </div>
                                        <IndianRupee className="text-green-500" size={20} />
                                    </div>
                                    <p className="text-sm text-gray-600 font-medium mb-1">Total Earnings</p>
                                    <p className="text-3xl font-bold text-gray-900">₹{referralStats.totalEarnings}</p>
                                </div>

                                <div className="bg-white/90 backdrop-blur-xl rounded-xl shadow-lg border border-white/50 p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                                            <Gift className="text-white" size={24} />
                                        </div>
                                        <Activity className="text-orange-500" size={20} />
                                    </div>
                                    <p className="text-sm text-gray-600 font-medium mb-1">Pending</p>
                                    <p className="text-3xl font-bold text-gray-900">₹{referralStats.pendingEarnings}</p>
                                </div>
                            </div>

                            {/* Earnings Breakdown */}
                            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center justify-between">
                                    <span className="flex items-center space-x-2">
                                        <TrendingUp className="text-indigo-600" size={24} />
                                        <span>Earnings Breakdown</span>
                                    </span>
                                    <button
                                        onClick={() => navigate('/wallet')}
                                        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
                                    >
                                        <Wallet size={18} />
                                        <span>View Wallet</span>
                                        <ExternalLink size={16} />
                                    </button>
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border-2 border-green-100">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                                                <Check className="text-white" size={20} />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">Completed Referrals</p>
                                                <p className="text-sm text-gray-600">{referralStats.successfulReferrals} referrals</p>
                                            </div>
                                        </div>
                                        <p className="text-2xl font-bold text-green-600">₹{referralStats.totalEarnings}</p>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl border-2 border-orange-100">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                                                <Activity className="text-white" size={20} />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">Pending Referrals</p>
                                                <p className="text-sm text-gray-600">
                                                    {referralStats.totalReferrals - referralStats.successfulReferrals} pending verification
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-2xl font-bold text-orange-600">₹{referralStats.pendingEarnings}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Referral Tips */}
                            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 text-white">
                                <h3 className="text-2xl font-bold mb-4 flex items-center space-x-2">
                                    <Sparkles size={28} />
                                    <span>Pro Tips to Maximize Earnings</span>
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                                        <p className="font-semibold mb-2">Share with Everyone</p>
                                        <p className="text-sm text-indigo-100">
                                            The more people you share with, the higher your earning potential
                                        </p>
                                    </div>
                                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                                        <p className="font-semibold mb-2">Use Multiple Channels</p>
                                        <p className="text-sm text-indigo-100">
                                            Share on Facebook, WhatsApp, Twitter, and Email for maximum reach
                                        </p>
                                    </div>
                                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                                        <p className="font-semibold mb-2">Personal Touch</p>
                                        <p className="text-sm text-indigo-100">
                                            Add a personal message when sharing to increase conversion rates
                                        </p>
                                    </div>
                                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                                        <p className="font-semibold mb-2">Follow Up</p>
                                        <p className="text-sm text-indigo-100">
                                            Check in with friends who haven't signed up yet
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ShareComponent;