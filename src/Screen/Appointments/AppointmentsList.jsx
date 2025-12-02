import { useState, useEffect, useMemo, useCallback } from 'react';
import { MapPin, Clock, Calendar, User, RefreshCw, Filter, Search, X, AlertCircle, CheckCircle, Loader, Eye, Navigation, MoreVertical, FileText, Download, Shield, Home, Building, CreditCard, IdCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { bookingService } from '../../Screen/Booking/services/bookingService';
import axios from "axios";
import { Helmet } from 'react-helmet-async';
const AppointmentsList = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [notification, setNotification] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [userRole, setUserRole] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Initialize user role
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUserRole(user.role || 'user');
      } catch (error) {
        console.error("Error parsing user data:", error);
        setUserRole('user');
      }
    } else {
      setUserRole('user');
    }
    
    fetchBookings();
  }, []);

  // Fetch bookings based on user role
  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const userData = localStorage.getItem('userData');
      const user = userData ? JSON.parse(userData) : { role: 'user' };
      
      let result;
      
      if (user.role === 'provider') {
        result = await bookingService.getProviderBookings();
      } else if (user.role === 'admin') {
        result = await bookingService.getAllBookings();
      } else {
        result = await bookingService.getUserBookings();
      }
      
      if (result.success) {
        const bookingsData = Array.isArray(result.data) ? result.data : [];
        setBookings(bookingsData);
      } else {
        const errorMessage = result.error || 'Failed to fetch bookings';
        console.error('Booking fetch error:', errorMessage);
        setError('Unable to load appointments. Please try again later.');
        showNotification('Failed to load appointments', 'error');
      }
    } catch (err) {
      console.error('Unexpected error fetching bookings:', err);
      setError('An unexpected error occurred. Please refresh the page.');
      showNotification('Error loading appointments', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  // Normalize booking data
  const normalizeBooking = useCallback((booking) => {
    if (!booking) return null;
    
    try {
      return {
        ...booking,
        _id: booking._id?.$oid || booking._id || 'unknown',
        userId: booking.userId?.$oid || booking.userId?.id || booking.userId?._id || booking.userId,
        providerId: booking.providerId?.$oid || booking.providerId?.id || booking.providerId?._id || booking.providerId,
        providerName: booking.providerName || 'Unknown Provider',
        userName: booking.userName || booking.userId?.profile?.fullName || 'Unknown User',
        duration: booking.duration?.$numberInt || booking.duration || 30,
        price: booking.price?.$numberInt || booking.price || 0,
        date: booking.date?.$date?.$numberLong 
          ? new Date(parseInt(booking.date.$date.$numberLong)).toISOString()
          : booking.date?.$date || booking.date || new Date().toISOString(),
        timeSlot: booking.timeSlot || '00:00',
        mode: 'visit',
        status: booking.status || 'pending',
        bookingId: booking.bookingId || `BOOK-${Date.now()}`,
        verification: booking.verification || null,
        verificationId: booking.verificationId || booking.verification?._id || null,
        address: booking.address || booking.verification?.address || null
      };
    } catch (err) {
      console.error('Error normalizing booking:', err, booking);
      return null;
    }
  }, []);

  // Filter bookings with useMemo for performance
  const filteredBookings = useMemo(() => {
    let filtered = bookings
      .map(normalizeBooking)
      .filter(booking => booking !== null);

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(booking => 
        booking.providerName?.toLowerCase().includes(searchLower) ||
        booking.userName?.toLowerCase().includes(searchLower) ||
        booking.bookingId?.toLowerCase().includes(searchLower)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    // Sort by date
    filtered.sort((a, b) => new Date(a.date) - new Date(b.date));

    return filtered;
  }, [bookings, searchTerm, statusFilter, normalizeBooking]);

  // Cancel booking
  const handleCancelBooking = useCallback(async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment? This action cannot be undone.')) {
      return;
    }

    setCancellingId(bookingId);
    
    try {
      const result = await bookingService.cancelBooking(bookingId);
      
      if (result.success) {
        showNotification('Appointment cancelled successfully', 'success');
        setShowDetailsModal(false);
        setShowMobileMenu(null);
        await fetchBookings();
      } else {
        showNotification(result.error || 'Failed to cancel appointment', 'error');
      }
    } catch (err) {
      console.error('Cancel booking error:', err);
      showNotification('Failed to cancel appointment', 'error');
    } finally {
      setCancellingId(null);
    }
  }, [fetchBookings]);

  // Update booking status
  const handleUpdateStatus = useCallback(async () => {
    if (!newStatus || !selectedBooking) return;

    setUpdatingStatusId(selectedBooking._id);
    
    try {
      const result = await bookingService.updateBookingStatus(selectedBooking._id, newStatus);
      
      if (result.success) {
        showNotification(`Status updated to ${newStatus}`, 'success');
        setShowStatusModal(false);
        setShowDetailsModal(false);
        setShowMobileMenu(null);
        await fetchBookings();
      } else {
        showNotification(result.error || 'Failed to update status', 'error');
      }
    } catch (err) {
      console.error('Update status error:', err);
      showNotification('Failed to update status', 'error');
    } finally {
      setUpdatingStatusId(null);
    }
  }, [newStatus, selectedBooking, fetchBookings]);

  // View booking details
  const handleViewDetails = useCallback(async (booking) => {
    const token = localStorage.getItem("token");

    try {
      setLoadingDetails(true);
      console.log("➡️ Loading booking details...");

      const bookingId = booking?._id;
      if (!bookingId) {
        console.error("❌ booking._id missing");
        return;
      }

      // Fetch verification details
      const verificationRes = await axios.get(
        `https://socket-server-sandbox.onrender.com/api/verification/${bookingId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const verificationData = verificationRes.data?.data || null;

      // Merge verification + booking
      const mergedBookingData = {
        ...booking,
        verification: verificationData,
      };

      console.log("📦 Merged Booking Data:", mergedBookingData);

      // Normalize booking
      const normalizedBooking = normalizeBooking(mergedBookingData);

      // Update UI state
      setSelectedBooking(normalizedBooking);
      setShowDetailsModal(true);
      setShowMobileMenu(null);

    } catch (error) {
      console.error("❌ Error loading booking details:", error);
      showNotification('Failed to load complete details', 'error');
      
      // Still show modal with basic info
      const normalizedBooking = normalizeBooking(booking);
      setSelectedBooking(normalizedBooking);
      setShowDetailsModal(true);
      setShowMobileMenu(null);
    } finally {
      setLoadingDetails(false);
    }
  }, [normalizeBooking]);

  // Modify booking status
  const handleModifyStatus = useCallback((booking) => {
    const normalizedBooking = normalizeBooking(booking);
    setSelectedBooking(normalizedBooking);
    setNewStatus(normalizedBooking.status);
    setShowStatusModal(true);
    setShowMobileMenu(null);
  }, [normalizeBooking]);

  // Navigate to location
  const handleNavigateToLocation = useCallback((booking) => {
    const address = booking.address || booking.verification?.address;
    if (address) {
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
      window.open(mapsUrl, '_blank');
    } else {
      showNotification('Location information not available', 'error');
    }
  }, []);

  // Download file
  const handleDownloadFile = useCallback((fileUrl, fileName) => {
    if (!fileUrl) {
      showNotification('File not available', 'error');
      return;
    }
    window.open(fileUrl, '_blank');
  }, []);

  // Permission checks
  const canCancelBooking = useCallback((booking) => {
    return booking.status === 'confirmed' || booking.status === 'pending';
  }, []);

  const canModifyStatus = useCallback((booking) => {
    return (userRole === 'provider' || userRole === 'admin') && 
           booking.status !== 'cancelled' && 
           booking.status !== 'completed';
  }, [userRole]);

  // Show notification
  const showNotification = useCallback((message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  }, []);

  // Get status color
  const getStatusColor = useCallback((status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'completed': return 'bg-gray-100 text-gray-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      case 'verification_pending': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }, []);

  // Get address type icon
  const getAddressTypeIcon = useCallback((type) => {
    switch (type?.toLowerCase()) {
      case 'home': return <Home className="w-4 h-4" />;
      case 'office': case 'work': return <Building className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  }, []);

  // Get ID type icon
  const getIdTypeIcon = useCallback((type) => {
    switch (type?.toLowerCase()) {
      case 'aadhaar': return <CreditCard className="w-4 h-4" />;
      case 'pan': return <IdCard className="w-4 h-4" />;
      case 'passport': return <Shield className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  }, []);

  // Format date
  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
  }, []);

  // Format file size
  const formatFileSize = useCallback((bytes) => {
    if (!bytes) return 'Unknown size';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }, []);

  // Get page title based on role
  const pageTitle = useMemo(() => {
    switch (userRole) {
      case 'provider':
        return 'Provider Appointments';
      case 'admin':
        return 'All Appointments';
      default:
        return 'My Appointments';
    }
  }, [userRole]);

  // Get page description based on role
  const pageDescription = useMemo(() => {
    switch (userRole) {
      case 'provider':
        return 'Manage your client appointments';
      case 'admin':
        return 'View and manage all appointments';
      default:
        return 'Track your scheduled consultations';
    }
  }, [userRole]);

  // Statistics
  const statistics = useMemo(() => ({
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    pending: bookings.filter(b => b.status === 'pending').length,
    completed: bookings.filter(b => b.status === 'completed').length,
  }), [bookings]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Error Loading</h3>
          <p className="text-gray-600 mb-6 text-sm">{error}</p>
          <button
            onClick={fetchBookings}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors w-full sm:w-auto"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
    <Helmet>
  <title>Your Appointments | View & Manage Sessions</title>
  <meta name="description" content="ICheck your upcoming and past emotional support sessions easily." />
  <meta name="keywords" content="appointments emotional support, session management India" />
  
  <meta property="og:title" content="Your Appointments" />
  <meta property="og:image" content="/seo-logo.png" />
</Helmet>
    <div className="min-h-screen bg-gray-50 py-4 md:py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Notification Toast */}
        {notification && (
          <div
            className={`fixed top-4 right-4 left-4 md:left-auto z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${
              notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            } text-white`}
          >
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span className="font-medium text-sm flex-1">{notification.message}</span>
            <button onClick={() => setNotification(null)} className="hover:bg-white/20 rounded p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Header Section */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{pageTitle}</h1>
              <p className="text-sm text-gray-600">{pageDescription}</p>
              {userRole && (
                <span className="inline-block mt-2 px-2.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                  {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                </span>
              )}
            </div>
            <button
              onClick={fetchBookings}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg shadow-sm transition-colors border border-gray-200"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or booking ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center justify-center gap-2 px-4 py-2 font-medium rounded-lg transition-colors ${
                  showFilters ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>

            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <label className="block text-xs font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Statuses</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="verification_pending">Verification Pending</option>
                </select>
              </div>
            )}
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <p className="text-gray-600 text-xs mb-1">Total</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900">{statistics.total}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <p className="text-gray-600 text-xs mb-1">Confirmed</p>
              <p className="text-xl md:text-2xl font-bold text-green-600">{statistics.confirmed}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <p className="text-gray-600 text-xs mb-1">Pending</p>
              <p className="text-xl md:text-2xl font-bold text-yellow-600">{statistics.pending}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <p className="text-gray-600 text-xs mb-1">Completed</p>
              <p className="text-xl md:text-2xl font-bold text-gray-600">{statistics.completed}</p>
            </div>
          </div>
        </div>

        {/* Appointments List */}
        {filteredBookings.length > 0 ? (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
              <div className="bg-gray-50 border-b border-gray-200">
                <div className={`grid ${userRole === 'user' ? 'grid-cols-9' : 'grid-cols-12'} gap-4 px-6 py-3 text-xs font-semibold text-gray-600 uppercase`}>
                  <div className="col-span-3">{userRole === 'provider' ? 'Client' : 'Provider'}</div>
                  <div className="col-span-2">Date & Time</div>
                  <div className="col-span-1">Duration</div>
                  <div className="col-span-1">Amount</div>
                  <div className="col-span-2">Status</div>
                  {(userRole === 'provider' || userRole === 'admin') && (
                    <div className="col-span-3 text-right">Actions</div>
                  )}
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {filteredBookings.map((booking) => {
                  const bookingId = booking._id;
                  const displayName = userRole === 'provider' ? booking.userName : booking.providerName;
                  
                  return (
                    <div
                      key={bookingId}
                      onMouseEnter={() => setHoveredRow(bookingId)}
                      onMouseLeave={() => setHoveredRow(null)}
                      className={`grid ${userRole === 'user' ? 'grid-cols-9' : 'grid-cols-12'} gap-4 px-6 py-4 transition-colors ${
                        hoveredRow === bookingId ? 'bg-blue-50' : 'bg-white'
                      }`}
                    >
                      <div className="col-span-3 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-gray-900 truncate">{displayName}</p>
                          <p className="text-xs text-gray-500 truncate">{booking.bookingId}</p>
                        </div>
                      </div>

                      <div className="col-span-2 flex flex-col justify-center">
                        <div className="flex items-center gap-2 text-sm text-gray-900 mb-0.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span className="font-medium">{formatDate(booking.date)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span>{booking.timeSlot}</span>
                        </div>
                      </div>

                      <div className="col-span-1 flex items-center">
                        <span className="text-sm text-gray-700">{booking.duration} min</span>
                      </div>

                      <div className="col-span-1 flex items-center">
                        <span className="text-sm font-bold text-gray-900">₹{booking.price}</span>
                      </div>

                      <div className="col-span-2 flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current mr-2"></span>
                          <span className="capitalize">{booking.status.replace('_', ' ')}</span>
                        </span>
                      </div>

                      {(userRole === 'provider' || userRole === 'admin') && (
                        <div className="col-span-3 flex items-center justify-end gap-2">                          
                          <button
                            onClick={() => handleViewDetails(booking)}
                            className="inline-flex items-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Details</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile & Tablet Card View */}
            <div className="lg:hidden space-y-4">
              {filteredBookings.map((booking) => {
                const bookingId = booking._id;
                const displayName = userRole === 'provider' ? booking.userName : booking.providerName;
                
                return (
                  <div key={bookingId} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Card Header */}
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-base font-bold text-gray-900 truncate">{displayName}</p>
                            <p className="text-xs text-gray-500 truncate">{booking.bookingId}</p>
                          </div>
                        </div>
                        
                        <div className="relative">
                          <button
                            onClick={() => setShowMobileMenu(showMobileMenu === bookingId ? null : bookingId)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <MoreVertical className="w-5 h-5 text-gray-600" />
                          </button>
                          
                          {/* Mobile Menu Dropdown */}
                          {showMobileMenu === bookingId && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                              <button
                                onClick={() => handleViewDetails(booking)}
                                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                                <span>View Details</span>
                              </button>
                              
                              {canModifyStatus(booking) && (
                                <button
                                  onClick={() => handleModifyStatus(booking)}
                                  className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-100"
                                >
                                  <RefreshCw className="w-4 h-4" />
                                  <span>Update Status</span>
                                </button>
                              )}
                              
                              {canCancelBooking(booking) && userRole !== 'admin' && (
                                <button
                                  onClick={() => handleCancelBooking(bookingId)}
                                  disabled={cancellingId === bookingId}
                                  className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
                                >
                                  <X className="w-4 h-4" />
                                  <span>{cancellingId === bookingId ? 'Cancelling...' : 'Cancel Appointment'}</span>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current mr-2"></span>
                          <span className="capitalize">{booking.status.replace('_', ' ')}</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                          <MapPin className="w-4 h-4" />
                          <span>In-Person Visit</span>
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <div className="flex items-center gap-2 text-gray-600 mb-1">
                            <Calendar className="w-4 h-4" />
                            <span className="text-xs font-medium">Date</span>
                          </div>
                          <p className="text-sm font-semibold text-gray-900">{formatDate(booking.date)}</p>
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2 text-gray-600 mb-1">
                            <Clock className="w-4 h-4" />
                            <span className="text-xs font-medium">Time</span>
                          </div>
                          <p className="text-sm font-semibold text-gray-900">{booking.timeSlot}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                        <div>
                          <p className="text-xs text-gray-600 mb-0.5">Duration</p>
                          <p className="text-sm font-semibold text-gray-900">{booking.duration} min</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-600 mb-0.5">Amount</p>
                          <p className="text-lg font-bold text-gray-900">₹{booking.price}</p>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer - Action Buttons */}
                    <div className="p-4 bg-gray-50 border-t border-gray-200">
                      <div className="flex gap-2">
                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => handleNavigateToLocation(booking)}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg transition-all"
                          >
                            <Navigation className="w-4 h-4" />
                            <span>Navigate</span>
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleViewDetails(booking)}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-700 hover:bg-gray-800 text-white text-sm font-semibold rounded-lg transition-all"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Details</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-8 md:p-12 text-center border border-gray-200">
            <Calendar className="mx-auto w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg md:text-xl font-bold text-gray-700 mb-2">
              {searchTerm || statusFilter !== 'all'
                ? 'No Matching Appointments' 
                : 'No Appointments'}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : "You don't have any scheduled appointments yet."}
            </p>
            {(searchTerm || statusFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Clear Filters</span>
              </button>
            )}
          </div>
        )}

        {/* Enhanced Details Modal */}
        {showDetailsModal && selectedBooking && (
          <div className="fixed inset-0 z-50 overflow-y-auto" onClick={() => setShowDetailsModal(false)}>
            <div className="flex items-center justify-center min-h-screen p-4">
              <div className="fixed inset-0 bg-black bg-opacity-50" />
              
              <div className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="sticky top-0 bg-white px-4 md:px-6 py-4 border-b border-gray-200 z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-gray-900">Appointment Details</h3>
                      <p className="text-xs md:text-sm text-gray-500 mt-0.5">{selectedBooking.bookingId}</p>
                    </div>
                    <button
                      onClick={() => setShowDetailsModal(false)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>

                {loadingDetails && (
                  <div className="px-4 md:px-6 py-4 bg-blue-50 border-b border-blue-100">
                    <div className="flex items-center gap-3">
                      <Loader className="w-4 h-4 text-blue-600 animate-spin" />
                      <span className="text-sm text-blue-700">Loading complete details...</span>
                    </div>
                  </div>
                )}

                <div className="px-4 md:px-6 py-6 space-y-6">
                  {/* Person Information */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {userRole === 'provider' ? 'Client Information' : 'Provider Information'}
                    </h4>
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center shadow-md">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-lg">
                            {userRole === 'provider' ? selectedBooking.userName : selectedBooking.providerName}
                          </p>
                          <p className="text-sm text-gray-600">In-Person Consultation</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Appointment Details */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Appointment Details
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                          <Calendar className="w-4 h-4" />
                          <span className="text-xs font-medium">Date</span>
                        </div>
                        <p className="font-semibold text-gray-900">{formatDate(selectedBooking.date)}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(selectedBooking.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                          <Clock className="w-4 h-4" />
                          <span className="text-xs font-medium">Time</span>
                        </div>
                        <p className="font-semibold text-gray-900">{selectedBooking.timeSlot}</p>
                        <p className="text-xs text-gray-500 mt-1">{selectedBooking.duration} minutes duration</p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                          <MapPin className="w-4 h-4" />
                          <span className="text-xs font-medium">Consultation Mode</span>
                        </div>
                        <p className="font-semibold text-gray-900">In-Person Visit</p>
                        <p className="text-xs text-gray-500 mt-1">Face-to-face consultation</p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                          <span className="text-xs font-medium">Status</span>
                        </div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(selectedBooking.status)}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current mr-2"></span>
                          <span className="capitalize">{selectedBooking.status.replace('_', ' ')}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Verification Details Section */}
                  {selectedBooking.verification && (
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3 flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Verification Information
                      </h4>
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 space-y-4">
                        {/* Verification Status */}
                        <div className="flex items-center justify-between pb-3 border-b border-blue-200">
                          <span className="text-sm font-medium text-gray-700">Verification Status</span>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            selectedBooking.verification.status === 'verified' ? 'bg-green-100 text-green-700' :
                            selectedBooking.verification.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {selectedBooking.verification.status === 'verified' && <CheckCircle className="w-3 h-3 mr-1" />}
                            <span className="capitalize">{selectedBooking.verification.status}</span>
                          </span>
                        </div>

                        {/* Full Name */}
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Full Name</p>
                          <p className="text-sm font-semibold text-gray-900">{selectedBooking.verification.fullName || 'Not provided'}</p>
                        </div>

                        {/* Government ID */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                              {getIdTypeIcon(selectedBooking.verification.governmentIdType)}
                              ID Type
                            </p>
                            <p className="text-sm font-semibold text-gray-900 capitalize">
                              {selectedBooking.verification.governmentIdType || 'Not specified'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 mb-1">ID Number</p>
                            <p className="text-sm font-semibold text-gray-900 font-mono">
                              {selectedBooking.verification.governmentIdNumber || 'Not provided'}
                            </p>
                          </div>
                        </div>

                        {/* Address Information */}
                        {selectedBooking.verification.address && (
                          <div className="pt-3 border-t border-blue-200">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-xs text-gray-600 flex items-center gap-1">
                                {getAddressTypeIcon(selectedBooking.verification.addressType)}
                                Address ({selectedBooking.verification.addressType || 'home'})
                              </p>
                            </div>
                            <div className="bg-white rounded-lg p-3 space-y-2">
                              <p className="text-sm font-medium text-gray-900">{selectedBooking.verification.address}</p>
                              <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                                {selectedBooking.verification.city && (
                                  <span className="bg-gray-100 px-2 py-1 rounded">{selectedBooking.verification.city}</span>
                                )}
                                {selectedBooking.verification.state && (
                                  <span className="bg-gray-100 px-2 py-1 rounded">{selectedBooking.verification.state}</span>
                                )}
                                {selectedBooking.verification.pincode && (
                                  <span className="bg-gray-100 px-2 py-1 rounded">PIN: {selectedBooking.verification.pincode}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Document Files */}
                        {(selectedBooking.verification.idProofFile || selectedBooking.verification.addressProofFile) && (
                          <div className="pt-3 border-t border-blue-200">
                            <p className="text-xs font-medium text-gray-700 mb-3">Uploaded Documents</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {selectedBooking.verification.idProofFile && (
                                <div className="bg-white rounded-lg p-3 border border-gray-200">
                                  <div className="flex items-start gap-2">
                                    <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-gray-900 mb-1">ID Proof</p>
                                      <p className="text-xs text-gray-600 truncate">
                                        {selectedBooking.verification.idProofFile.originalName || 'document.pdf'}
                                      </p>
                                      <p className="text-xs text-gray-500 mt-1">
                                        {formatFileSize(selectedBooking.verification.idProofFile.size)}
                                      </p>
                                      <button
                                        onClick={() => handleDownloadFile(
                                          selectedBooking.verification.idProofFile.url,
                                          selectedBooking.verification.idProofFile.originalName
                                        )}
                                        className="mt-2 inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
                                      >
                                        <Download className="w-3 h-3" />
                                        <span>View/Download</span>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {selectedBooking.verification.addressProofFile && (
                                <div className="bg-white rounded-lg p-3 border border-gray-200">
                                  <div className="flex items-start gap-2">
                                    <FileText className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-gray-900 mb-1">Address Proof</p>
                                      <p className="text-xs text-gray-600 truncate">
                                        {selectedBooking.verification.addressProofFile.originalName || 'document.pdf'}
                                      </p>
                                      <p className="text-xs text-gray-500 mt-1">
                                        {formatFileSize(selectedBooking.verification.addressProofFile.size)}
                                      </p>
                                      <button
                                        onClick={() => handleDownloadFile(
                                          selectedBooking.verification.addressProofFile.url,
                                          selectedBooking.verification.addressProofFile.originalName
                                        )}
                                        className="mt-2 inline-flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 font-medium"
                                      >
                                        <Download className="w-3 h-3" />
                                        <span>View/Download</span>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Payment Information */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3 flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Payment Information
                    </h4>
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700 font-medium">Total Amount</span>
                        <span className="text-3xl font-bold text-gray-900">₹{selectedBooking.price}</span>
                      </div>
                      {selectedBooking.walletTransactionId && (
                        <div className="mt-3 pt-3 border-t border-green-200">
                          <p className="text-xs text-gray-600 mb-1">Transaction ID</p>
                          <p className="text-xs font-mono text-gray-800 bg-white px-2 py-1 rounded inline-block">
                            {selectedBooking.walletTransactionId}
                          </p>
                        </div>
                      )}
                      <div className="mt-3 flex items-center gap-2 text-xs text-green-700">
                        <CheckCircle className="w-4 h-4" />
                        <span>Payment Confirmed</span>
                      </div>
                    </div>
                  </div>

                  {/* Location Information */}
                  {selectedBooking.address && (
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Visit Location
                      </h4>
                      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                        <p className="text-sm text-gray-900 mb-3">{selectedBooking.address}</p>
                        <button
                          onClick={() => handleNavigateToLocation(selectedBooking)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg transition-colors"
                        >
                          <Navigation className="w-4 h-4" />
                          <span>Open in Google Maps</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="sticky bottom-0 bg-gray-50 px-4 md:px-6 py-4 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row gap-3">
                    {selectedBooking.status === 'confirmed' && (
                      <button
                        onClick={() => {
                          setShowDetailsModal(false);
                          handleNavigateToLocation(selectedBooking);
                        }}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
                      >
                        <Navigation className="w-4 h-4" />
                        <span className="text-sm">Navigate to Location</span>
                      </button>
                    )}

                    {canModifyStatus(selectedBooking) && (
                      <button
                        onClick={() => {
                          setShowDetailsModal(false);
                          handleModifyStatus(selectedBooking);
                        }}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span className="text-sm">Update Status</span>
                      </button>
                    )}
                    
                    {canCancelBooking(selectedBooking) && userRole !== 'admin' && (
                      <button
                        onClick={() => handleCancelBooking(selectedBooking._id)}
                        disabled={cancellingId === selectedBooking._id}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {cancellingId === selectedBooking._id ? (
                          <>
                            <Loader className="w-4 h-4 animate-spin" />
                            <span className="text-sm">Cancelling...</span>
                          </>
                        ) : (
                          <>
                            <X className="w-4 h-4" />
                            <span className="text-sm">Cancel Appointment</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Status Update Modal */}
        {showStatusModal && selectedBooking && (
          <div className="fixed inset-0 z-50 overflow-y-auto" onClick={() => setShowStatusModal(false)}>
            <div className="flex items-center justify-center min-h-screen p-4">
              <div className="fixed inset-0 bg-black bg-opacity-50" />
              
              <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <div className="px-4 md:px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg md:text-xl font-bold text-gray-900">Update Status</h3>
                    <button
                      onClick={() => setShowStatusModal(false)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>

                <div className="px-4 md:px-6 py-6">
                  <p className="text-sm text-gray-600 mb-4">
                    Update the status for appointment with <strong className="text-gray-900">
                      {userRole === 'provider' ? selectedBooking.userName : selectedBooking.providerName}
                    </strong>
                  </p>
                  
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select New Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="rescheduled">Rescheduled</option>
                    <option value="verification_pending">Verification Pending</option>
                  </select>
                </div>

                <div className="px-4 md:px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3">
                  <button
                    onClick={() => setShowStatusModal(false)}
                    className="flex-1 px-4 py-3 bg-white border-2 border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateStatus}
                    disabled={updatingStatusId === selectedBooking._id || newStatus === selectedBooking.status}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updatingStatusId === selectedBooking._id ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Update Status</span>
                      </>
                    )}
                  </button>
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

export default AppointmentsList;