import { useState, useEffect, useRef, useCallback } from 'react';
import { Menu, X, Bell, LogOut, ChevronDown, User, Wallet, CalendarCheck } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../hooks/useAuth';
import { useWallet } from '../../Screen/Booking/hooks/useWallet';
import { usePresence } from "../../context/UserStatusContext";
import { useProviderId } from '../../hooks/useProviderId';
import axios from 'axios';
import blacklogo from "../../Logos/SVG/Black.svg";
import NotificationDropdown from './NotificationDropdown';
import ProfileDropdown from './ProfileDropdown';
import SearchBar from './SearchBar';
import { NAV_ITEMS } from './HeaderData';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeItem, setActiveItem] = useState('home');
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false); // mobile profile dropdown toggle

  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  const { socket, presenceMap } = usePresence();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const isLoggedIn = isAuthenticated;
  const { balance, loading, refreshWallet  } = useWallet();
  const providerId = useProviderId();

  // Initial status based on presenceMap (fallback to offline)
  const initialStatus =
    providerId && presenceMap[providerId]?.status
      ? presenceMap[providerId].status
      : "offline";

  const [status, setStatus] = useState(initialStatus);
  const [loadingStatus, setLoadingStatus] = useState(false);

  // Keep local status in sync with presenceMap (no unnecessary updates)
  useEffect(() => {
    if (providerId && presenceMap[providerId]) {
      const newStatus = presenceMap[providerId].status;
      if (newStatus && newStatus !== status) {
        console.log("🔄 Syncing header status from presenceMap:", newStatus);
        setStatus(newStatus);
      }
    }
  }, [presenceMap, providerId, status]);

  useEffect(() => {
  const params = new URLSearchParams(window.location.search);

  // Cashfree always returns with order_id or reference_id
  const orderId = params.get("order_id") || params.get("reference_id");

  if (orderId) {
     refreshWallet();   // 🔥 force Header wallet refresh
  }
}, [refreshWallet]);


  const updateStatus = useCallback(
    async (newStatus) => {
      if (!providerId) {
        console.error("❌ Cannot update status: providerId is undefined");
        return;
      }

      if (!socket) {
        console.error("❌ Cannot update presence: socket is not connected");
        return;
      }

      setLoadingStatus(true);
      const previousStatus = status;
      setStatus(newStatus);

      try {
        await axios.post(
          `${
            process.env.REACT_APP_BACKEND_URL ||
            "https://socket-server-sandbox.onrender.com"
          }/api/providers/update-status`,
          { providerId, status: newStatus }
        );

        socket.emit("updatePresence", {
          providerId,
          // ✅ online, busy, available, etc. are all "online"
          isOnline: newStatus !== "offline",
        });

        console.log("✅ Status updated to:", newStatus);
      } catch (err) {
        console.error("❌ Error updating status:", err);
        setStatus(previousStatus);
      }

      setLoadingStatus(false);
    },
    [providerId, socket, status]
  );

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

  const navItems = NAV_ITEMS(isLoggedIn);

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-white shadow-sm'}`}>
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
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
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium border transition-colors
                    ${isActive
                      ? "text-gray-700 bg-[#F5F5F5] border-[#E5E5E5] hover:bg-[#EDEDED]"
                      : "text-gray-900 bg-[#F5F5F5] border-[#E5E5E5] hover:bg-[#EDEDED]"
                    }
                  `}
                >
                  <IconComponent size={18} />
                  <span>{item.label}</span>

                  {item.id === "wallet" && !loading && (
                    <span className="ml-1 text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-md">
                      ₹{balance?.toFixed(2) ?? 0}
                    </span>
                  )}
                </a>
              );
            })}
          </nav>

          {/* Search Bar */}
          <SearchBar />

          {/* Desktop Right Section */}
          <div className="hidden lg:flex items-center space-x-3">
            {!isLoggedIn ? (
              <button
                onClick={() => navigate("/auth/login")}
                className="px-6 py-2 bg-[#F5F5F5] text-black text-sm font-medium rounded-xl border border-[#E5E5E5] hover:bg-[#EDEDED] transition-colors"
                type="button"
              >
                Register Now
              </button>

            ) : (
              <>
                {/* Notification Bell */}
                {/* <NotificationDropdown
                  isOpen={isNotificationOpen}
                  setIsOpen={setIsNotificationOpen}
                  notifications={notifications}
                  unreadCount={unreadCount}
                  markAsRead={markAsRead}
                  markAllAsRead={markAllAsRead}
                  deleteNotification={deleteNotification}
                  notificationRef={notificationRef}
                  navigate={navigate}
                /> */}

                {/* Profile Dropdown */}
                <ProfileDropdown
                  isOpen={isProfileOpen}
                  setIsOpen={setIsProfileOpen}
                  userName={userName}
                  user={user}
                  balance={balance}
                  loading={loading}
                  status={status}
                  loadingStatus={loadingStatus}
                  updateStatus={updateStatus}
                  providerId={providerId}
                  profileRef={profileRef}
                  navigate={navigate}
                  handleLogout={handleLogout}
                />
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-xl bg-[#F5F5F5] border border-[#E5E5E5] hover:bg-[#EDEDED] transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            type="button"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-[#E5E5E5] py-4 mt-1">
            <nav className="flex flex-col space-y-2 px-2">

              {/* Mobile nav items */}
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
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium border transition-colors
                      ${isActive
                        ? 'text-gray-900 bg-[#F5F5F5] border-[#E5E5E5]'
                        : 'text-gray-700 bg-[#F5F5F5] border-[#E5E5E5] hover:bg-[#EDEDED]'
                      }`}
                  >
                    <IconComponent size={20} />
                    <span>{item.label}</span>

                    {item.id === "wallet" && !loading && (
                      <span className="ml-auto text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-md">
                        ₹{balance?.toFixed(2) ?? 0}
                      </span>
                    )}
                  </a>
                );
              })}

              {/* Notification row (mobile) */}
              {isLoggedIn && (
                <>
                  {/* <button
                    onClick={() => {
                      navigate('/notifications');
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium bg-[#F5F5F5] border border-[#E5E5E5] hover:bg-[#EDEDED]"
                    type="button"
                  >
                    <Bell size={20} />
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                        {unreadCount}
                      </span>
                    )}
                  </button> */}

                  {/* Profile header row (mobile) */}
                  <div className="border-t border-[#E5E5E5] mt-4 pt-4">
                    <button
                      onClick={() => setMobileProfileOpen(!mobileProfileOpen)}
                      className="w-full flex items-center justify-between space-x-3 px-4 py-3 bg-[#F5F5F5] border border-[#E5E5E5] rounded-xl"
                      type="button"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-full flex items-center justify-center text-white font-semibold">
                          {userName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <p className="font-semibold text-sm text-gray-900 truncate">{userName}</p>
                          <p className="text-xs text-gray-500 truncate">{user?.phoneNumber || ''}</p>
                        </div>
                      </div>

                      <ChevronDown size={18} className={`text-gray-600 transform transition-transform ${mobileProfileOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* MOBILE PROFILE DROPDOWN */}
                    {mobileProfileOpen && (
                      <div className="mt-3 space-y-2 px-1">

                        {/* My Profile */}
                        <button
                          onClick={() => {
                            if (user.role === 'provider') navigate('/service-provider-profile');
                            else if (user.role === 'user') navigate('/dashboard');
                            else if (user.role === 'admin') navigate('/admin');
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm bg-[#F5F5F5] border border-[#E5E5E5] rounded-xl hover:bg-[#EDEDED]"
                          type="button"
                        >
                          <User size={16} />
                          <span>My Profile</span>
                        </button>

                        {/* Wallet (with balance) */}
                        <button
                          onClick={() => {
                            navigate('/wallet');
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full flex items-center justify-between px-4 py-2.5 text-sm bg-[#F5F5F5] border border-[#E5E5E5] rounded-xl hover:bg-[#EDEDED]"
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

                        {/* History */}
                        <button
                          onClick={() => {
                            navigate('/appointment');
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm bg-[#F5F5F5] border border-[#E5E5E5] rounded-xl hover:bg-[#EDEDED]"
                          type="button"
                        >
                          <CalendarCheck size={16} />
                          <span>History</span>
                        </button>

                        {/* Provider availability toggle (only show if provider) */}
                        {user?.role === 'provider' && providerId && (
                          <div className="px-4 py-2.5 bg-[#F5F5F5] border border-[#E5E5E5] rounded-xl">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs font-semibold text-gray-700">
                                  Availability
                                </p>
                                <p className="text-xs text-gray-500">
                                  {status === "online" ? "Online" : "Offline"}
                                </p>
                              </div>

                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  className="sr-only"
                                  checked={status === "online"}
                                  disabled={loadingStatus}
                                  onChange={(e) =>
                                    updateStatus(e.target.checked ? "online" : "offline")
                                  }
                                />
                                <div className={`w-10 h-5 rounded-full transition-colors ${status === "online" ? "bg-green-500" : "bg-gray-400"}`} />
                                <div className={`absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-all ${status === "online" ? "translate-x-5" : ""}`} />
                              </label>
                            </div>
                          </div>
                        )}

                        {/* Logout (inside expanded profile) */}
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-[#F5F5F5] text-red-600 border border-red-200 rounded-xl font-medium hover:bg-red-50"
                          type="button"
                        >
                          <LogOut size={18} />
                          <span>Logout</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Mobile view for logged-out users */}
              {!isLoggedIn && (
                <div className="border-t border-[#E5E5E5] mt-4 pt-4 px-2">
                  <button
                    onClick={() => {
                      navigate("/auth/login");
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl border border-indigo-700 hover:bg-indigo-700 transition-colors"
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

