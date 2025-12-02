import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import {
  FaVideo,
  FaPhone,
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaMoneyBillWave,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
  FaFilter,
  FaSearch,
  FaSignOutAlt,
  FaHistory,
  FaStar,
  FaChevronRight
} from 'react-icons/fa';

function BookingDashboard() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMode, setFilterMode] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login/user');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUser(decoded);
      fetchBookings(token, decoded);
    } catch (error) {
      console.error('Token decode error:', error);
      navigate('/login/user');
    }
  }, [navigate]);

  const fetchBookings = async (token, userData) => {
    try {
      // Replace with your actual API endpoint
      const endpoint = userData.type === 'host' 
        ? '/api/bookings/provider' 
        : '/api/bookings/user';
      
      const response = await axios.get(
        `${process.env.REACT_APP_API}${endpoint}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const bookingsData = Array.isArray(response.data) 
        ? response.data 
        : response.data.bookings || [];
      
      setBookings(bookingsData);
      setFilteredBookings(bookingsData);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
      setFilteredBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = bookings;

    if (filterStatus !== 'all') {
      filtered = filtered.filter(b => b.status === filterStatus);
    }

    if (filterMode !== 'all') {
      filtered = filtered.filter(b => b.mode === filterMode);
    }

    if (searchTerm) {
      filtered = filtered.filter(b => 
        b.providerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.bookingId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredBookings(filtered);
  }, [filterStatus, filterMode, searchTerm, bookings]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <FaCheckCircle />;
      case 'pending': return <FaHourglassHalf />;
      case 'completed': return <FaCheckCircle />;
      case 'cancelled': return <FaTimesCircle />;
      default: return <FaClock />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeSlot) => {
    const [hours, minutes] = timeSlot.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const canJoinCall = (booking) => {
    if (booking.status !== 'confirmed') return false;
    
    const bookingDate = new Date(booking.date);
    const [hours, minutes] = booking.timeSlot.split(':');
    bookingDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    const now = new Date();
    const timeDiff = bookingDate - now;
    const minutesDiff = timeDiff / (1000 * 60);
    
    // Allow joining 10 minutes before and up to duration after
    return minutesDiff <= 10 && minutesDiff >= -(booking.duration || 45);
  };

  const handleJoinCall = (booking) => {
    if (!canJoinCall(booking)) {
      alert('Call is not available yet. You can join 10 minutes before the scheduled time.');
      return;
    }

    const channelName = `${booking.bookingId}-${booking.userId}-${booking.providerId}`;
    navigate(`/call/${channelName}/${booking.mode}?bookingId=${booking._id}`);
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login/user');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <h2 className="text-2xl font-bold text-gray-900 mt-4">Loading appointments...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <FaCalendarAlt className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
                <p className="text-sm text-gray-600">Manage your bookings and sessions</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <FaUser className="w-4 h-4 text-white" />
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm font-medium text-gray-900">{user?.name || 'User'}</div>
                  <div className="text-xs text-gray-500">{user?.email || ''}</div>
                </div>
              </div>

              <button 
                onClick={logout} 
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200"
              >
                <FaSignOutAlt className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-900">{bookings.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FaCalendarAlt className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Confirmed</p>
                <p className="text-3xl font-bold text-gray-900">
                  {bookings.filter(b => b.status === 'confirmed').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <FaCheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Completed</p>
                <p className="text-3xl font-bold text-gray-900">
                  {bookings.filter(b => b.status === 'completed').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <FaHistory className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">This Month</p>
                <p className="text-3xl font-bold text-gray-900">
                  {bookings.filter(b => {
                    const bookingDate = new Date(b.date);
                    const now = new Date();
                    return bookingDate.getMonth() === now.getMonth() && 
                           bookingDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <FaStar className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by provider or booking ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <FaFilter className="w-5 h-5 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="all">All Status</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <select
                value={filterMode}
                onChange={(e) => setFilterMode(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="all">All Modes</option>
                <option value="video">Video Call</option>
                <option value="audio">Audio Call</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
              <FaCalendarAlt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
              <p className="text-gray-500">Try adjusting your filters or search criteria</p>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <div
                key={booking._id || booking.bookingId}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Booking Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {booking.providerName || 'Provider'}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)} flex items-center space-x-1`}>
                            {getStatusIcon(booking.status)}
                            <span className="ml-1 capitalize">{booking.status}</span>
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 font-mono">{booking.bookingId}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <FaCalendarAlt className="w-4 h-4 text-blue-500" />
                        <span className="text-sm">{formatDate(booking.date)}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-gray-600">
                        <FaClock className="w-4 h-4 text-purple-500" />
                        <span className="text-sm">{formatTime(booking.timeSlot)}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-gray-600">
                        {booking.mode === 'video' ? (
                          <FaVideo className="w-4 h-4 text-green-500" />
                        ) : (
                          <FaPhone className="w-4 h-4 text-orange-500" />
                        )}
                        <span className="text-sm capitalize">{booking.mode} Call</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-gray-600">
                        <FaMoneyBillWave className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-medium">₹{booking.price}</span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center space-x-2 text-sm text-gray-500">
                      <FaClock className="w-4 h-4" />
                      <span>Duration: {booking.duration || 45} minutes</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex items-center space-x-3">
                    {canJoinCall(booking) ? (
                      <button
                        onClick={() => handleJoinCall(booking)}
                        className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg"
                      >
                        {booking.mode === 'video' ? (
                          <FaVideo className="w-5 h-5" />
                        ) : (
                          <FaPhone className="w-5 h-5" />
                        )}
                        <span>Join Now</span>
                      </button>
                    ) : (
                      <button
                        disabled
                        className="flex items-center space-x-2 bg-gray-300 text-gray-500 px-6 py-3 rounded-xl font-medium cursor-not-allowed"
                      >
                        <FaClock className="w-5 h-5" />
                        <span>Not Available</span>
                      </button>
                    )}
                    
                    <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200">
                      <FaChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default BookingDashboard;