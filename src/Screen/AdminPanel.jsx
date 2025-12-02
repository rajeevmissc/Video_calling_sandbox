import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Settings, 
  Search, 
  Filter, 
  Plus,
  Edit3,
  Trash2,
  Eye,
  Ban,
  CheckCircle,
  XCircle,
  AlertTriangle,
  BarChart3,
  PieChart,
  Activity,
  Star,
  MapPin,
  Phone,
  Mail,
  Clock,
  Download,
  Upload,
  RefreshCw
} from 'lucide-react';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');

  // Sample data
  const [stats, setStats] = useState({
    totalUsers: 1247,
    totalProviders: 156,
    totalSessions: 3456,
    totalRevenue: 125678,
    activeUsers: 892,
    pendingApprovals: 23,
    avgRating: 4.7,
    monthlyGrowth: 12.5
  });

  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@email.com',
      role: 'customer',
      status: 'active',
      joinDate: '2024-01-15',
      lastActive: '2024-01-20',
      totalSessions: 8,
      totalSpent: 960,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
    },
    {
      id: 2,
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@email.com',
      role: 'provider',
      status: 'active',
      joinDate: '2023-12-01',
      lastActive: '2024-01-20',
      totalSessions: 247,
      totalEarnings: 29640,
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=40&h=40&fit=crop&crop=face',
      specializations: ['Psychology', 'Therapy'],
      rating: 4.8
    },
    {
      id: 3,
      name: 'Mike Wilson',
      email: 'mike.wilson@email.com',
      role: 'customer',
      status: 'suspended',
      joinDate: '2023-11-20',
      lastActive: '2024-01-18',
      totalSessions: 3,
      totalSpent: 285,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
    }
  ]);

  const [providers, setProviders] = useState([
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      title: 'Clinical Psychologist',
      email: 'sarah.johnson@email.com',
      phone: '+1 (555) 123-4567',
      location: 'New York, NY',
      status: 'approved',
      joinDate: '2023-12-01',
      rating: 4.8,
      totalSessions: 247,
      totalEarnings: 29640,
      specializations: ['Anxiety', 'Depression', 'Relationship Counseling'],
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=40&h=40&fit=crop&crop=face',
      documents: ['license.pdf', 'certificate.pdf'],
      hourlyRate: 120
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      title: 'Life Coach',
      email: 'michael.chen@email.com',
      phone: '+1 (555) 987-6543',
      location: 'San Francisco, CA',
      status: 'pending',
      joinDate: '2024-01-15',
      rating: 0,
      totalSessions: 0,
      totalEarnings: 0,
      specializations: ['Career Development', 'Personal Growth'],
      avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=40&h=40&fit=crop&crop=face',
      documents: ['license.pdf'],
      hourlyRate: 95
    }
  ]);

  const [sessions, setSessions] = useState([
    {
      id: 1,
      customer: 'John Smith',
      provider: 'Dr. Sarah Johnson',
      date: '2024-01-20',
      time: '10:00',
      duration: 60,
      status: 'completed',
      amount: 120,
      sessionType: 'video'
    },
    {
      id: 2,
      customer: 'Emma Davis',
      provider: 'Dr. Michael Chen',
      date: '2024-01-21',
      time: '14:00',
      duration: 60,
      status: 'scheduled',
      amount: 95,
      sessionType: 'video'
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
      case 'approved':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
      case 'rejected':
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const StatCard = ({ icon: Icon, title, value, change, color }) => (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-sm font-medium ${
            change > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            <TrendingUp className="w-4 h-4" />
            {change > 0 ? '+' : ''}{change}%
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-gray-600">{title}</p>
    </div>
  );

  const UserRow = ({ user }) => (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
          <div>
            <div className="font-medium text-gray-900">{user.name}</div>
            <div className="text-gray-500 text-sm">{user.email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
          user.role === 'provider' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
        }`}>
          {user.role}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(user.status)}`}>
          {user.status}
        </span>
      </td>
      <td className="px-6 py-4 text-gray-600">
        {new Date(user.joinDate).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 text-gray-600">
        {user.totalSessions}
      </td>
      <td className="px-6 py-4 text-gray-600">
        ${user.totalSpent || user.totalEarnings || 0}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <button className="p-1 text-blue-600 hover:text-blue-800 transition-colors">
            <Eye className="w-4 h-4" />
          </button>
          <button className="p-1 text-green-600 hover:text-green-800 transition-colors">
            <Edit3 className="w-4 h-4" />
          </button>
          <button className="p-1 text-red-600 hover:text-red-800 transition-colors">
            <Ban className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );

  const ProviderCard = ({ provider, onApprove, onReject }) => (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <img
            src={provider.avatar}
            alt={provider.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{provider.name}</h3>
            <p className="text-blue-600 font-medium">{provider.title}</p>
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">{provider.location}</span>
            </div>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(provider.status)}`}>
          {provider.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">{provider.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">{provider.phone}</span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">${provider.hourlyRate}/hour</span>
        </div>
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">{provider.rating > 0 ? `${provider.rating} rating` : 'No ratings yet'}</span>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Specializations:</p>
        <div className="flex flex-wrap gap-2">
          {provider.specializations.map((spec, index) => (
            <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
              {spec}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Documents:</p>
        <div className="flex gap-2">
          {provider.documents.map((doc, index) => (
            <button key={index} className="text-blue-600 hover:text-blue-800 text-sm underline">
              {doc}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        {provider.status === 'pending' ? (
          <>
            <button 
              onClick={() => onApprove(provider._id)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              Approve
            </button>
            <button 
              onClick={() => onReject(provider._id)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <XCircle className="w-4 h-4" />
              Reject
            </button>
          </>
        ) : (
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Eye className="w-4 h-4" />
            View Details
          </button>
        )}
        <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Edit3 className="w-4 h-4" />
          Edit
        </button>
      </div>
    </div>
  );

  const handleApproveProvider = (providerId) => {
    setProviders(providers.map(p => 
      p.id === providerId ? { ...p, status: 'approved' } : p
    ));
  };

  const handleRejectProvider = (providerId) => {
    setProviders(providers.map(p => 
      p.id === providerId ? { ...p, status: 'rejected' } : p
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your platform's users, providers, and settings</p>
            </div>
            
            <div className="flex items-center gap-4">
              <select 
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="24h">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-8">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'providers', label: 'Providers', icon: UserCheck },
              { id: 'sessions', label: 'Sessions', icon: Calendar },
              { id: 'analytics', label: 'Analytics', icon: PieChart },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Overview</h2>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <StatCard
                    icon={Users}
                    title="Total Users"
                    value={stats.totalUsers.toLocaleString()}
                    change={12.5}
                    color="bg-blue-500"
                  />
                  <StatCard
                    icon={UserCheck}
                    title="Active Providers"
                    value={stats.totalProviders.toLocaleString()}
                    change={8.3}
                    color="bg-green-500"
                  />
                  <StatCard
                    icon={Calendar}
                    title="Total Sessions"
                    value={stats.totalSessions.toLocaleString()}
                    change={15.7}
                    color="bg-purple-500"
                  />
                  <StatCard
                    icon={DollarSign}
                    title="Revenue"
                    value={`${(stats.totalRevenue / 1000).toFixed(1)}K`}
                    change={22.1}
                    color="bg-orange-500"
                  />
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white rounded-lg border-2 border-yellow-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <AlertTriangle className="w-6 h-6 text-yellow-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Pending Approvals</h3>
                    </div>
                    <p className="text-3xl font-bold text-yellow-600 mb-2">{stats.pendingApprovals}</p>
                    <p className="text-gray-600 mb-4">Provider applications waiting for review</p>
                    <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors">
                      Review Now
                    </button>
                  </div>

                  <div className="bg-white rounded-lg border-2 border-green-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Activity className="w-6 h-6 text-green-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Active Users</h3>
                    </div>
                    <p className="text-3xl font-bold text-green-600 mb-2">{stats.activeUsers}</p>
                    <p className="text-gray-600 mb-4">Users active in the last 24 hours</p>
                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
                      View Details
                    </button>
                  </div>

                  <div className="bg-white rounded-lg border-2 border-blue-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Star className="w-6 h-6 text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Average Rating</h3>
                    </div>
                    <p className="text-3xl font-bold text-blue-600 mb-2">{stats.avgRating}</p>
                    <p className="text-gray-600 mb-4">Overall platform satisfaction</p>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                      View Reviews
                    </button>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700">New provider "Dr. Michael Chen" registered</span>
                      <span className="text-sm text-gray-500 ml-auto">2 hours ago</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">Session completed between John Smith and Dr. Sarah Johnson</span>
                      <span className="text-sm text-gray-500 ml-auto">4 hours ago</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-gray-700">Payment of $120 processed successfully</span>
                      <span className="text-sm text-gray-500 ml-auto">6 hours ago</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
                  <div className="flex gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Filter className="w-4 h-4" />
                      Filter
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                      <Plus className="w-4 h-4" />
                      Add User
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Sessions</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {users.filter(user => 
                        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        user.email.toLowerCase().includes(searchQuery.toLowerCase())
                      ).map(user => (
                        <UserRow key={user.id} user={user} />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Providers Tab */}
            {activeTab === 'providers' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Provider Management</h2>
                  <div className="flex gap-4">
                    <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500">
                      <option value="">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {providers.map(provider => (
                    <ProviderCard 
                      key={provider._id} 
                      provider={provider} 
                      onApprove={handleApproveProvider}
                      onReject={handleRejectProvider}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sessions Tab */}
            {activeTab === 'sessions' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Session Management</h2>
                  <div className="flex gap-4">
                    <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500">
                      <option value="">All Sessions</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {sessions.map(session => (
                        <tr key={session.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-gray-900">{session.customer}</td>
                          <td className="px-6 py-4 text-gray-900">{session.provider}</td>
                          <td className="px-6 py-4 text-gray-600">
                            {new Date(session.date).toLocaleDateString()} at {session.time}
                          </td>
                          <td className="px-6 py-4 text-gray-600">{session.duration} min</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(session.status)}`}>
                              {session.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-900">${session.amount}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button className="p-1 text-blue-600 hover:text-blue-800 transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-red-600 hover:text-red-800 transition-colors">
                                <XCircle className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics & Reports</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
                    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">Chart placeholder - Implement with Chart.js or similar</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
                    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">Chart placeholder - Implement with Chart.js or similar</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Top Providers</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Dr. Sarah Johnson</span>
                        <span className="font-semibold">$2,400</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Dr. Michael Chen</span>
                        <span className="font-semibold">$1,890</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Dr. Emily Rodriguez</span>
                        <span className="font-semibold">$1,650</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Popular Services</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Psychology</span>
                        <span className="font-semibold">45%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Life Coaching</span>
                        <span className="font-semibold">28%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Business</span>
                        <span className="font-semibold">18%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Session Types</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Video Call</span>
                        <span className="font-semibold">78%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Audio Call</span>
                        <span className="font-semibold">22%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Platform Settings</h2>
                
                <div className="space-y-8">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Platform Name</label>
                        <input
                          type="text"
                          defaultValue="ConsultHub"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
                        <input
                          type="email"
                          defaultValue="support@consulthub.com"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Commission Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Platform Commission (%)</label>
                        <input
                          type="number"
                          defaultValue="15"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Payment Processing Fee (%)</label>
                        <input
                          type="number"
                          defaultValue="2.9"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Feature Toggles</h3>
                    <div className="space-y-4">
                      <label className="flex items-center gap-3">
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600" defaultChecked />
                        <span className="text-gray-700">Allow video calls</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600" defaultChecked />
                        <span className="text-gray-700">Allow audio calls</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600" defaultChecked />
                        <span className="text-gray-700">Auto-approve new customers</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600" />
                        <span className="text-gray-700">Manual provider approval required</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                      Save Settings
                    </button>
                    <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors">
                      Reset to Default
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;