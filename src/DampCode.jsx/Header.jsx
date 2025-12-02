import { useState, useEffect, useRef } from 'react';
import { User, Wallet, Home, Share2, Bell, Menu, X, ChevronDown, LogOut, Check, Trash2, Clock, CalendarCheck, Search } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../hooks/useAuth';
import { useWallet } from '../Screen/Booking/hooks/useWallet';
import { usePresence } from "../context/UserStatusContext";
import { useProviderId } from '../hooks/useProviderId';
import axios from 'axios';
import blacklogo from "../Logos/SVG/Black.svg";
const dummyProviders = [
  'Priya Sharma', 'Jashvik S', 'Kartik A', 'Shaurya S', 'Bharat B',
  'Sonu A', 'Rohit K', 'Akash G', 'Permish M', 'Sumit S',
  'Vijay K', 'Prithvi A', 'Ayush K', 'Ajay M', 'Abhishek C',
  'Veer P', 'Rakesh K',
];

const allServices = [
  'Active listening', 'Empathy training', 'Conflict resolution', 'Storytelling',
  'Motivational speaking', 'Public speaking', 'Cross-cultural communication',
  'Stress counseling (non-clinical)', 'Break-up support', 'Conversational English practice',
  'Singing (Bollywood songs)', 'Singing (Classical Indian music)', 'Guitar playing',
  'Piano/Keyboard', 'Tabla/Dholak', 'Karaoke hosting', 'Painting (acrylics, oils)',
  'Sketching & doodling', 'Calligraphy', 'Poetry recitation (Hindi/Urdu/Kavita)',
  'Creative writing coach', 'Theatre/acting games', 'Storytelling for kids',
  'Stand-up comedy basics', 'Origami', 'Reading books aloud', 'Newspaper discussion',
  'History talks (Indian history)', 'Mythology storytelling (Ramayana/Mahabharata)',
  'Science trivia sharing', 'Current affairs discussion', 'Spirituality talks',
  'Philosophy basics', 'Mindfulness practices', 'TED-talk style knowledge sharing',
  'Chess partner', 'Carrom partner', 'Table tennis partner', 'Badminton partner',
  'Cricket net practice buddy', 'Football buddy', 'Squash partner', 'Volleyball partner',
  'Kabaddi partner', 'Running/jogging companion', 'Cycling buddy', 'Yoga partner',
  'Meditation guide', 'Zumba fitness partner', 'Walking companion', 'Ludo',
  'Snakes & ladders', 'Monopoly', 'Cards (Rummy, UNO)', 'Scrabble', 'Crossword solving',
  'Puzzles (Sudoku, logic)', 'Gaming (PlayStation/Xbox)', 'Mobile gaming (PUBG/Free Fire)',
  'PC gaming (FIFA, Counter-Strike)', 'Basic English tutoring', 'Hindi tutoring',
  'Spoken French practice', 'Spoken Spanish practice', 'Computer basics',
  'MS Office training', 'Smartphone literacy for elders', 'Social media basics',
  'Digital payments guidance', 'Resume writing help', 'Job interview practice',
  'Public speaking practice', 'Financial literacy basics', 'Goal setting & planning',
  'Basic coding (Scratch, Python)', 'Cooking simple Indian meals', 'Baking cakes/cookies',
  'Tea/coffee making rituals', 'Gardening basics', 'Pet care & dog walking',
  'Grocery shopping companion', 'Wardrobe organizing', 'Decluttering coach',
  'Home decoration ideas', 'Festival celebration guide (Diwali, Holi)',
  'Bollywood dance', 'Classical dance (Kathak, Bharatanatyam)', 'Folk dance (Bhangra, Garba)',
  'Karaoke nights', 'Movie discussion club', 'TV serial gossip', 'Theatre appreciation',
  'Museum companion', 'Temple/mosque/gurudwara companion', 'Wedding/festival plus-one service',
  'Guided relaxation', 'Breathing exercises', 'Gratitude journaling companion',
  'Life reflections sharing', 'Bucket list planning buddy'
];

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeItem, setActiveItem] = useState('home');
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  
  const { socket, presenceMap } = usePresence();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const isLoggedIn = isAuthenticated;
  const { balance, loading } = useWallet();
  
  // ✅ Use custom hook to get providerId from localStorage
  const providerId = useProviderId();
  
  console.log("👀 Provider ID in Header:", providerId);

  const initialStatus = providerId && presenceMap[providerId]?.status === "online" 
    ? "online" 
    : "offline";

  const [status, setStatus] = useState(initialStatus);
  const [loadingStatus, setLoadingStatus] = useState(false);

  // ✅ Update instantly when presenceMap changes (real-time)
  useEffect(() => {
    if (providerId && presenceMap[providerId]) {
      setStatus(presenceMap[providerId].status);
    }
  }, [presenceMap, providerId]);

  const updateStatus = async (newStatus) => {
    if (!providerId) {
      console.error("❌ Cannot update status: providerId is undefined");
      return;
    }

    setLoadingStatus(true);
    const previousStatus = status;
    setStatus(newStatus);

    try {
      // ✅ Update backend via REST API
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL || "https://socket-server-d9ts.onrender.com"}/api/providers/update-status`,
        {
          providerId,
          status: newStatus,
        }
      );

      // ✅ Emit to socket.io for real-time update
      socket.emit("updatePresence", {
        providerId,
        isOnline: newStatus === "online",
      });

      console.log("✅ Status updated to:", newStatus);
    } catch (err) {
      console.error("❌ Error updating status:", err);
      // Revert status on error
      setStatus(previousStatus);
    }

    setLoadingStatus(false);
  };

  const fetchSuggestions = (query) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const lower = query.toLowerCase();

    const matchScore = (text) => {
      const t = text.toLowerCase();
      if (t.startsWith(lower)) return 6;
      if (t.split(" ").some(word => word.startsWith(lower))) return 4;
      if (t.includes(lower)) return 2;
      return 0;
    };

    const rankedMatches = (list, type) =>
      list
        .map((item) => ({ name: item, type, score: matchScore(item) }))
        .filter((i) => i.score > 0)
        .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));

    const serviceMatches = rankedMatches(allServices, "Service");
    const providerMatches = rankedMatches(dummyProviders, "Provider");

    const combined = [...serviceMatches, ...providerMatches].slice(0, 8);

    setSuggestions(combined);
    setShowSuggestions(true);
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    navigate(`/services?search=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery("");
    setShowSuggestions(false);
  };

  const maskPhone = (phone) => {
    if (!phone) return '';
    const str = phone.toString().replace(/\D/g, '');
    if (str.length < 3) return phone;

    if (str.length === 10) {
      const lastSeven = str.slice(-7);
      const middleThree = lastSeven.slice(0, 3);
      const lastFour = lastSeven.slice(3);
      return `***${middleThree}-${lastFour}`;
    }

    const lastThree = str.slice(-3);
    return '***' + lastThree;
  };

  const getDisplayName = () => {
    if (user?.profile?.fullName && user.profile.fullName.trim() !== '') {
      return user.profile.fullName;
    }
    if (user?.phoneNumber) {
      return maskPhone(user.phoneNumber);
    }
    return 'User';
  };

  const userName = getDisplayName();

  useEffect(() => {
    if (isLoggedIn) {
      fetchNotifications();
    }
  }, [isLoggedIn]);

  const fetchNotifications = async () => {
    try {
      const mockNotifications = [
        {
          id: 1,
          type: 'booking',
          title: 'Service Booking Confirmed',
          message: 'Your plumbing service has been confirmed for tomorrow at 10 AM',
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          read: false,
          icon: '🔧'
        },
        {
          id: 2,
          type: 'wallet',
          title: 'Payment Received',
          message: 'You received ₹500 in your wallet',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
          read: false,
          icon: '💰'
        },
        {
          id: 3,
          type: 'service',
          title: 'Service Completed',
          message: 'Your electrical service has been marked as completed',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
          read: false,
          icon: '✅'
        },
        {
          id: 4,
          type: 'promo',
          title: 'Special Offer',
          message: 'Get 20% off on your next AC service',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
          read: true,
          icon: '🎉'
        }
      ];

      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.read).length);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const formatTimestamp = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const markAsRead = async (notificationId) => {
    try {
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const notification = notifications.find(n => n.id === notificationId);
      if (!notification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setActiveItem('home');
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      setActiveItem('home');
      navigate('/');
    }
  };

  const baseNavItems = [
    { id: 'home', label: 'Home', icon: Home, href: '/' },
    { id: 'services', label: 'Services', icon: User, href: '/services' },
    { id: 'share', label: 'Share', icon: Share2, href: '/share' },
  ];

  const walletItem = { id: 'wallet', label: 'Wallet', icon: Wallet, href: '/wallet' };

  const navItems = isLoggedIn
    ? [baseNavItems[0], walletItem, ...baseNavItems.slice(1)]
    : baseNavItems;

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md' : 'bg-white shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex items-center">
            <a 
              href="/" 
              onClick={(e) => { 
                e.preventDefault(); 
                navigate('/'); 
              }} 
              className="flex items-center space-x-2 group"
            >
             <img src={blacklogo} alt="ServiceConnect Logo" className="h-12 w-auto" />
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeItem === item.id;

              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveItem(item.id);
                    navigate(item.href);
                  }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <IconComponent size={18} />
                  <span>{item.label}</span>

                  {item.id === 'wallet' && !loading && (
                    <span className="ml-1 text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-md">
                      ₹{balance?.toFixed(2) ?? 0}
                    </span>
                  )}
                </a>
              );
            })}
          </nav>

          {/* Search Bar */}
          <div className="relative hidden lg:flex items-center w-56">
            <Search
              size={18}
              className="absolute left-3 text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search providers or services..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              value={searchQuery}
              onChange={(e) => {
                const val = e.target.value;
                setSearchQuery(val);
                fetchSuggestions(val);
              }}
              onFocus={() => searchQuery && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />

            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-lg z-50 max-h-56 overflow-y-auto">
                {suggestions.map((item, idx) => (
                  <li
                    key={idx}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 cursor-pointer flex justify-between"
                    onMouseDown={() => {
                      setSearchQuery(item.name);
                      setShowSuggestions(false);
                      navigate(`/services?search=${encodeURIComponent(item.name)}`);
                    }}
                  >
                    <span>{item.name}</span>
                    <span className="text-gray-400 text-xs">{item.type}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Desktop Right Section */}
          <div className="hidden lg:flex items-center space-x-3">
            {!isLoggedIn ? (
              <button
                onClick={() => navigate("/auth/login")}
                className="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                type="button"
              >
                Sign In
              </button>
            ) : (
              <>
                {/* Notification Bell */}
                <div className="relative" ref={notificationRef}>
                  <button
                    onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                    className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    type="button"
                  >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs font-semibold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {isNotificationOpen && (
                    <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900">Notifications</h3>
                          {notifications.length > 0 && unreadCount > 0 && (
                            <button
                              onClick={markAllAsRead}
                              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                              type="button"
                            >
                              Mark all read
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="py-12 px-4 text-center">
                            <Bell size={40} className="mx-auto text-gray-300 mb-2" />
                            <p className="text-sm text-gray-500">No notifications</p>
                          </div>
                        ) : (
                          notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors ${
                                !notification.read ? 'bg-indigo-50/30' : ''
                              }`}
                            >
                              <div className="px-4 py-3 flex items-start space-x-3">
                                <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-lg">
                                  {notification.icon}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1 pr-2">
                                      <div className="flex items-center space-x-2">
                                        <h4 className="text-sm font-semibold text-gray-900">
                                          {notification.title}
                                        </h4>
                                        {!notification.read && (
                                          <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                                        )}
                                      </div>
                                      <p className="text-sm text-gray-600 mt-0.5">
                                        {notification.message}
                                      </p>
                                      <div className="flex items-center space-x-1 mt-1 text-xs text-gray-400">
                                        <Clock size={12} />
                                        <span>{formatTimestamp(notification.timestamp)}</span>
                                      </div>
                                    </div>

                                    <div className="flex items-center space-x-1">
                                      {!notification.read && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            markAsRead(notification.id);
                                          }}
                                          className="p-1 text-indigo-600 hover:bg-indigo-100 rounded transition-colors"
                                          title="Mark as read"
                                          type="button"
                                        >
                                          <Check size={14} />
                                        </button>
                                      )}
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          deleteNotification(notification.id);
                                        }}
                                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                        title="Delete"
                                        type="button"
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {notifications.length > 0 && (
                        <div className="border-t border-gray-200 px-4 py-2 bg-gray-50">
                          <button
                            onClick={() => {
                              navigate('/notifications');
                              setIsNotificationOpen(false);
                            }}
                            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium w-full text-center"
                            type="button"
                          >
                            View all notifications
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                    type="button"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-gray-900 max-w-32 truncate hidden xl:block">
                      {userName}
                    </span>
                    <ChevronDown size={16} className="text-gray-500" />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{userName}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{user?.phoneNumber || ''}</p>
                      </div>
                      
                      <button
                        onClick={() => {
                          if (user.role === 'provider') {
                            navigate('/service-provider-profile');
                          } else if (user.role === 'user') {
                            navigate('/dashboard');
                          } else if (user.role === 'admin') {
                            navigate('/admin');
                          }
                          setIsProfileOpen(false);
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        type="button"
                      >
                        <User size={16} />
                        <span>My Profile</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          navigate('/wallet');
                          setIsProfileOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        type="button"
                      >
                        <div className="flex items-center space-x-3">
                          <Wallet size={16} />
                          <span>Wallet</span>
                        </div>
                        {!loading && (
                          <span className="text-xs font-semibold text-green-600">
                            ₹{balance?.toFixed(2) ?? 0}
                          </span>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          navigate('/appointment');
                          setIsProfileOpen(false);
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        type="button"
                      >
                        <CalendarCheck size={16} />
                        <span>History</span>
                      </button>

                      {/* ✅ Only show availability toggle for providers */}
                      {user?.role === 'provider' && providerId && (
                        <>
                          <div className="border-t border-gray-100 my-1"></div>
                          <div className="px-4 py-2.5">
                            <p className="text-xs font-semibold text-gray-500 mb-2">Availability</p>
                            <label className="flex items-center cursor-pointer space-x-3">
                              <span className="text-sm text-gray-700">
                                {status === "online" ? "Online" : "Offline"}
                              </span>
                              <div className="relative">
                                <input
                                  type="checkbox"
                                  className="sr-only"
                                  checked={status === "online"}
                                  disabled={loadingStatus}
                                  onChange={(e) =>
                                    updateStatus(e.target.checked ? "online" : "offline")
                                  }
                                />
                                <div
                                  className={`w-10 h-5 rounded-full transition-colors ${
                                    status === "online" ? "bg-green-500" : "bg-gray-400"
                                  }`}
                                />
                                <div
                                  className={`absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-all ${
                                    status === "online" ? "translate-x-5" : ""
                                  }`}
                                />
                              </div>
                            </label>
                          </div>
                        </>
                      )}

                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsProfileOpen(false);
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        type="button"
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            type="button"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-1">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeItem === item.id;

                return (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveItem(item.id);
                      navigate(item.href);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-indigo-600 bg-indigo-50'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <IconComponent size={20} />
                    <span>{item.label}</span>
                  </a>
                );
              })}

              {isLoggedIn && (
                <>
                  <button
                    onClick={() => {
                      navigate('/notifications');
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    type="button"
                  >
                    <Bell size={20} />
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  <div className="border-t border-gray-200 mt-4 pt-4">
                    <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-lg mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-full flex items-center justify-center text-white font-semibold">
                        {userName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-gray-900">{userName}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.phoneNumber || ''}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 border border-red-200 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors"
                      type="button"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              )}

              {!isLoggedIn && (
                <div className="border-t border-gray-200 mt-4 pt-4">
                  <button
                    onClick={() => {
                      navigate("/auth/login");
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                    type="button"
                  >
                    Sign In
                  </button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;



