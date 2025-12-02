import { useState, useEffect, useCallback } from 'react';
import { fetchWithAuth, API_ENDPOINTS } from '../utils/api';

const TransactionsTab = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 200,
    type: '',
    status: '',
    category: '',
    serviceType: '',
    startDate: '',
    endDate: '',
    search: '',
    callMode: '',
    providerName: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 200,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [stats, setStats] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);
  const [selectedTransactions, setSelectedTransactions] = useState(new Set());
  const [uniqueProviders, setUniqueProviders] = useState([]);
  const [uniqueModes, setUniqueModes] = useState([]);

  // Parse transaction description to extract details
  const parseTransactionDescription = (description) => {
    const patterns = [
      {
        regex: /Prepaid for next minute (\w+) call with (.+?) - (\d+) min\(s\) @ ₹(\d+)\/min/,
        type: 'next_minute'
      },
      {
        regex: /Initial \(prepaid\) (\w+) call with (.+?) - (\d+) min\(s\) @ ₹(\d+)\/min/,
        type: 'initial'
      }
    ];

    for (const pattern of patterns) {
      const match = description.match(pattern.regex);
      if (match) {
        return {
          mode: match[1],
          providerName: match[2],
          minutes: parseInt(match[3]),
          ratePerMin: parseInt(match[4]),
          transactionType: pattern.type
        };
      }
    }

    return null;
  };

  // Extract call session ID from serviceId
  const extractCallSessionId = (serviceId) => {
    if (!serviceId) return null;
    const parts = serviceId.split('_');
    if (parts.length >= 4) {
      return parts.slice(0, 4).join('_');
    }
    return serviceId;
  };

  // Check if two timestamps are within 1 minute and 10 seconds of each other
  const isConsecutiveTransaction = (time1, time2) => {
    const date1 = new Date(time1);
    const date2 = new Date(time2);
    const diffMs = Math.abs(date2 - date1);
    const diffSeconds = diffMs / 1000;
    
    return diffSeconds <= 70;
  };

  // Check if two transactions can be grouped together
  const canGroupTransactions = (existingGroup, newTransaction, newParsed) => {
    if (newParsed.transactionType !== 'next_minute') {
      return false;
    }

    const lastTransaction = existingGroup.groupedTransactions[
      existingGroup.groupedTransactions.length - 1
    ];

    const isTimeConsecutive = isConsecutiveTransaction(
      lastTransaction.createdAt,
      newTransaction.createdAt
    );

    if (!isTimeConsecutive) {
      return false;
    }

    if (existingGroup.providerName !== newParsed.providerName) {
      return false;
    }

    if (existingGroup.callMode !== newParsed.mode) {
      return false;
    }

    if (existingGroup.ratePerMin !== newParsed.ratePerMin) {
      return false;
    }

    if (lastTransaction.amount !== newTransaction.amount) {
      return false;
    }

    return true;
  };

  // Group transactions by call session with time and property validation
  const groupTransactionsByCall = (transactions) => {
    const sortedTransactions = [...transactions].sort((a, b) => 
      new Date(a.createdAt) - new Date(b.createdAt)
    );

    const grouped = [];
    const sessionMap = new Map();

    sortedTransactions.forEach((transaction) => {
      const parsed = parseTransactionDescription(transaction.description);
      
      if (!parsed) {
        grouped.push({
          ...transaction,
          isGrouped: false,
          totalMinutes: 0,
        });
        return;
      }

      const sessionId = extractCallSessionId(transaction.serviceId);
      
      if (!sessionId) {
        grouped.push({
          ...transaction,
          isGrouped: false,
          totalMinutes: parsed.minutes,
        });
        return;
      }

      const groupKey = `${sessionId}_${parsed.providerName}_${parsed.mode}_${parsed.ratePerMin}`;

      if (sessionMap.has(groupKey)) {
        const groupIndex = sessionMap.get(groupKey);
        const existingGroup = grouped[groupIndex];
        
        if (canGroupTransactions(existingGroup, transaction, parsed)) {
          existingGroup.groupedTransactions.push(transaction);
          existingGroup.totalAmount += transaction.amount;
          existingGroup.totalMinutes += parsed.minutes;
          existingGroup.transactionCount += 1;
          existingGroup.endTime = transaction.createdAt;
          
          // Update description with total minutes
          existingGroup.description = `${parsed.mode.charAt(0).toUpperCase() + parsed.mode.slice(1)} call with ${parsed.providerName}`;
        } else {
          const newGroupedTransaction = {
            ...transaction,
            isGrouped: true,
            groupedTransactions: [transaction],
            totalAmount: transaction.amount,
            totalMinutes: parsed.minutes,
            transactionCount: 1,
            sessionId: groupKey + '_' + transaction.createdAt,
            callMode: parsed.mode,
            providerName: parsed.providerName,
            ratePerMin: parsed.ratePerMin,
            startTime: transaction.createdAt,
            endTime: transaction.createdAt,
          };
          
          grouped.push(newGroupedTransaction);
        }
      } else {
        const groupedTransaction = {
          ...transaction,
          isGrouped: true,
          groupedTransactions: [transaction],
          totalAmount: transaction.amount,
          totalMinutes: parsed.minutes,
          transactionCount: 1,
          sessionId: groupKey,
          callMode: parsed.mode,
          providerName: parsed.providerName,
          ratePerMin: parsed.ratePerMin,
          startTime: transaction.createdAt,
          endTime: transaction.createdAt,
        };
        
        sessionMap.set(groupKey, grouped.length);
        grouped.push(groupedTransaction);
      }
    });

    return grouped;
  };

  // Extract unique providers and modes from transactions
  const extractUniqueFilters = (transactions) => {
    const providers = new Set();
    const modes = new Set();

    transactions.forEach(transaction => {
      const parsed = parseTransactionDescription(transaction.description);
      if (parsed) {
        providers.add(parsed.providerName);
        modes.add(parsed.mode);
      }
    });

    setUniqueProviders(Array.from(providers).sort());
    setUniqueModes(Array.from(modes).sort());
  };

  // Filter transactions based on mode and provider
  const filterTransactionsByDescription = (transactions, callMode, providerName) => {
    if (!callMode && !providerName) {
      return transactions;
    }

    return transactions.filter(transaction => {
      if (transaction.isGrouped) {
        const modeMatch = !callMode || transaction.callMode === callMode;
        const providerMatch = !providerName || transaction.providerName === providerName;
        return modeMatch && providerMatch;
      }
      
      const parsed = parseTransactionDescription(transaction.description);
      
      if (!parsed) return true;
      
      const modeMatch = !callMode || parsed.mode === callMode;
      const providerMatch = !providerName || parsed.providerName === providerName;
      
      return modeMatch && providerMatch;
    });
  };

  // Calculate totals for displayed transactions
  const calculateTotals = (transactions) => {
    return transactions.reduce((acc, transaction) => {
      const amount = transaction.totalAmount || transaction.amount || 0;
      const minutes = transaction.totalMinutes || 0;
      
      if (transaction.type === 'credit') {
        acc.totalCredit += amount;
      } else {
        acc.totalDebit += amount;
      }
      acc.totalMinutes += minutes;
      
      return acc;
    }, { totalCredit: 0, totalDebit: 0, totalMinutes: 0 });
  };

  // Build query string from filters
  const buildQueryString = useCallback((filters) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (key !== 'callMode' && key !== 'providerName' && filters[key]) {
        params.append(key, filters[key]);
      }
    });
    return params.toString();
  }, []);

  // Fetch transactions
  const fetchTransactions = useCallback(async (filters) => {
    setLoading(true);
    try {
      const queryString = buildQueryString(filters);
      const data = await fetchWithAuth(`${API_ENDPOINTS.transactions.list}?${queryString}`);
      
      let allTransactions = data.data?.transactions || [];
      
      extractUniqueFilters(allTransactions);
      
      // Always group transactions
      allTransactions = groupTransactionsByCall(allTransactions);
      
      const filteredTransactions = filterTransactionsByDescription(
        allTransactions,
        filters.callMode,
        filters.providerName
      );
      
      setTransactions(filteredTransactions);
      
      const originalPagination = data.data?.pagination || {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      };
      
      setPagination({
        ...originalPagination,
        total: filteredTransactions.length,
        totalPages: Math.ceil(filteredTransactions.length / originalPagination.limit)
      });
      
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [buildQueryString]);

  // Fetch statistics
  const fetchStats = useCallback(async () => {
    try {
      const data = await fetchWithAuth(`${API_ENDPOINTS.transactions.stats}?period=30`);
      setStats(data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchTransactions(filters);
    fetchStats();
  }, []);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    const newFilters = {
      ...filters,
      [key]: value,
      page: 1,
    };
    setFilters(newFilters);
    fetchTransactions(newFilters);
  };

  // Handle search
  const handleSearch = (searchTerm) => {
    if (searchTerm.length >= 2 || searchTerm.length === 0) {
      handleFilterChange('search', searchTerm);
    }
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    const newFilters = { ...filters, page: newPage };
    setFilters(newFilters);
    fetchTransactions(newFilters);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Export transactions
  const handleExport = async (format = 'csv') => {
    setExportLoading(true);
    try {
      const queryString = buildQueryString({
        ...filters,
        page: undefined,
        limit: undefined,
        format,
      });

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_ENDPOINTS.transactions.export}?${queryString}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': format === 'csv' ? 'text/csv' : 'application/json',
        },
      });

      if (!response.ok) throw new Error('Export failed');

      if (format === 'csv') {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        const data = await response.json();
        console.log('JSON Export Data:', data);
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setExportLoading(false);
    }
  };

  // Toggle transaction selection
  const toggleTransactionSelection = (transactionId) => {
    const newSelected = new Set(selectedTransactions);
    if (newSelected.has(transactionId)) {
      newSelected.delete(transactionId);
    } else {
      newSelected.add(transactionId);
    }
    setSelectedTransactions(newSelected);
  };

  // Select all transactions on current page
  const toggleSelectAll = () => {
    if (selectedTransactions.size === transactions.length) {
      setSelectedTransactions(new Set());
    } else {
      setSelectedTransactions(new Set(transactions.map(t => t.id)));
    }
  };

  // Clear all filters
  const clearFilters = () => {
    const defaultFilters = {
      page: 1,
      limit: 20,
      type: '',
      status: '',
      category: '',
      serviceType: '',
      startDate: '',
      endDate: '',
      search: '',
      callMode: '',
      providerName: '',
    };
    setFilters(defaultFilters);
    fetchTransactions(defaultFilters);
  };

  // Format amount with proper styling
  const formatAmount = (transaction) => {
    const amount = transaction.totalAmount || transaction.amount || 0;
    const isCredit = transaction.type === 'credit';
    const symbol = isCredit ? '+' : '-';
    const colorClass = isCredit ? 'text-green-600' : 'text-red-600';
    
    return (
      <span className={`font-semibold ${colorClass}`}>
        {symbol}₹{amount.toLocaleString('en-IN')}
      </span>
    );
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { color: 'bg-green-100 text-green-700', label: 'Completed' },
      pending: { color: 'bg-yellow-100 text-yellow-700', label: 'Pending' },
      failed: { color: 'bg-red-100 text-red-700', label: 'Failed' },
      refunded: { color: 'bg-blue-100 text-blue-700', label: 'Refunded' },
      cancelled: { color: 'bg-gray-100 text-gray-700', label: 'Cancelled' },
    };
    
    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-700', label: status };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${config.color}`}>
        {config.label}
      </span>
    );
  };

  // Get type badge
  const getTypeBadge = (type) => {
    const isCredit = type === 'credit';
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs ${
          isCredit ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}
      >
        {type}
      </span>
    );
  };

  // Calculate totals for current view
  const totals = calculateTotals(transactions);

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="text-sm text-gray-600">Total Transactions</div>
            <div className="text-2xl font-bold text-gray-900">
              {stats.summary?.totalTransactions || 0}
            </div>
            <div className="text-xs text-gray-500 mt-1">Last 30 days</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="text-sm text-gray-600">Total Amount</div>
            <div className="text-2xl font-bold text-green-600">
              ₹{(stats.summary?.totalAmount || 0).toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-gray-500 mt-1">Across all transactions</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="text-sm text-gray-600">Credits</div>
            <div className="text-2xl font-bold text-green-600">
              ₹{(stats.summary?.creditAmount || 0).toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {stats.summary?.totalCredits || 0} transactions
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="text-sm text-gray-600">Debits</div>
            <div className="text-2xl font-bold text-red-600">
              ₹{(stats.summary?.debitAmount || 0).toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {stats.summary?.totalDebits || 0} transactions
            </div>
          </div>
        </div>
      )}

      {/* Current View Summary */}
      {transactions.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-sm text-gray-600 font-medium">Total Minutes</div>
              <div className="text-2xl font-bold text-blue-600">
                {totals.totalMinutes} min
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 font-medium">Total Credits</div>
              <div className="text-2xl font-bold text-green-600">
                +₹{totals.totalCredit.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 font-medium">Total Debits</div>
              <div className="text-2xl font-bold text-red-600">
                -₹{totals.totalDebit.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Controls */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by reference, description, amount..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          {/* Export Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => handleExport('csv')}
              disabled={exportLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              {exportLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Exporting...
                </>
              ) : (
                'Export CSV'
              )}
            </button>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Filter Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
          {/* Call Mode Filter */}
          <select
            value={filters.callMode}
            onChange={(e) => handleFilterChange('callMode', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Modes</option>
            {uniqueModes.map(mode => (
              <option key={mode} value={mode}>
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </option>
            ))}
          </select>

          {/* Provider Name Filter */}
          <select
            value={filters.providerName}
            onChange={(e) => handleFilterChange('providerName', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Providers</option>
            {uniqueProviders.map(provider => (
              <option key={provider} value={provider}>
                {provider}
              </option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
          </select>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Category Filter */}
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            <option value="wallet">Wallet</option>
            <option value="payment">Payment</option>
            <option value="refund">Refund</option>
            <option value="transfer">Transfer</option>
            <option value="service_payment">Service Payment</option>
          </select>

          {/* Date Range */}
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Start Date"
          />
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="End Date"
          />
        </div>

        {/* Active Filters */}
        {(filters.type ||
          filters.status ||
          filters.category ||
          filters.startDate ||
          filters.endDate ||
          filters.search ||
          filters.callMode ||
          filters.providerName) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {filters.callMode && (
              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs flex items-center gap-1">
                Mode: {filters.callMode}
                <button
                  onClick={() => handleFilterChange('callMode', '')}
                  className="hover:text-purple-900"
                >
                  ×
                </button>
              </span>
            )}
            {filters.providerName && (
              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs flex items-center gap-1">
                Provider: {filters.providerName}
                <button
                  onClick={() => handleFilterChange('providerName', '')}
                  className="hover:text-purple-900"
                >
                  ×
                </button>
              </span>
            )}
            {filters.type && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs flex items-center gap-1">
                Type: {filters.type}
                <button
                  onClick={() => handleFilterChange('type', '')}
                  className="hover:text-blue-900"
                >
                  ×
                </button>
              </span>
            )}
            {filters.status && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs flex items-center gap-1">
                Status: {filters.status}
                <button
                  onClick={() => handleFilterChange('status', '')}
                  className="hover:text-blue-900"
                >
                  ×
                </button>
              </span>
            )}
            {filters.category && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs flex items-center gap-1">
                Category: {filters.category}
                <button
                  onClick={() => handleFilterChange('category', '')}
                  className="hover:text-blue-900"
                >
                  ×
                </button>
              </span>
            )}
            {filters.search && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs flex items-center gap-1">
                Search: "{filters.search}"
                <button
                  onClick={() => handleFilterChange('search', '')}
                  className="hover:text-blue-900"
                >
                  ×
                </button>
              </span>
            )}
            {filters.startDate && filters.endDate && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs flex items-center gap-1">
                Date: {filters.startDate} to {filters.endDate}
                <button
                  onClick={() => {
                    handleFilterChange('startDate', '');
                    handleFilterChange('endDate', '');
                  }}
                  className="hover:text-blue-900"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-4">📊</div>
            <div className="text-lg">No transactions found</div>
            <div className="text-sm">Try adjusting your filters or search terms</div>
          </div>
        ) : (
          <>
            <table className="w-full min-w-[800px] text-sm">
              <thead className="bg-slate-50 text-xs uppercase">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold w-12">
                    <input
                      type="checkbox"
                      checked={
                        selectedTransactions.size === transactions.length &&
                        transactions.length > 0
                      }
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">Reference</th>
                  <th className="px-4 py-3 text-left font-semibold">Description</th>
                  <th className="px-4 py-3 text-left font-semibold">Minutes</th>
                  <th className="px-4 py-3 text-left font-semibold">Amount</th>
                  <th className="px-4 py-3 text-left font-semibold">Type</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                  <th className="px-4 py-3 text-left font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {transactions.map(transaction => {
                  const parsed = parseTransactionDescription(transaction.description);
                  
                  return (
                    <tr key={transaction.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedTransactions.has(transaction.id)}
                          onChange={() => toggleTransactionSelection(transaction.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-mono text-xs text-gray-600">
                          {transaction.reference}
                        </div>
                        {transaction.transactionCount > 1 && (
                          <div className="text-xs text-blue-600 font-semibold mt-1">
                            {transaction.transactionCount} grouped
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{transaction.description}</div>
                        {parsed && (
                          <div className="flex gap-2 mt-1 flex-wrap">
                            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">
                              {parsed.mode}
                            </span>
                            <span className="text-xs bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded">
                              {parsed.providerName}
                            </span>
                            {transaction.ratePerMin && (
                              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">
                                ₹{transaction.ratePerMin}/min
                              </span>
                            )}
                          </div>
                        )}
                        {transaction.serviceType && !parsed && (
                          <div className="text-xs text-gray-500 mt-1">
                            {transaction.serviceType}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {transaction.totalMinutes > 0 ? (
                          <div className="font-semibold text-blue-600">
                            {transaction.totalMinutes} min
                          </div>
                        ) : (
                          <div className="text-gray-400">-</div>
                        )}
                      </td>
                      <td className="px-4 py-3">{formatAmount(transaction)}</td>
                      <td className="px-4 py-3">{getTypeBadge(transaction.type)}</td>
                      <td className="px-4 py-3">{getStatusBadge(transaction.status)}</td>
                      <td className="px-4 py-3">
                        <div className="text-sm">
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(transaction.createdAt).toLocaleTimeString()}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              {/* Table Footer with Totals */}
              <tfoot className="bg-slate-100 font-semibold">
                <tr>
                  <td colSpan="3" className="px-4 py-3 text-right">
                    <span className="text-gray-700">Totals:</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-blue-600">{totals.totalMinutes} min</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      {totals.totalCredit > 0 && (
                        <span className="text-green-600">+₹{totals.totalCredit.toLocaleString('en-IN')}</span>
                      )}
                      {totals.totalDebit > 0 && (
                        <span className="text-red-600">-₹{totals.totalDebit.toLocaleString('en-IN')}</span>
                      )}
                    </div>
                  </td>
                  <td colSpan="3" className="px-4 py-3"></td>
                </tr>
              </tfoot>
            </table>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="px-4 py-3 border-t bg-slate-50 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                  {pagination.total} transactions
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={!pagination.hasPrev}
                    className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    Previous
                  </button>
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.page <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.page >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = pagination.page - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-1 text-sm border rounded transition-colors ${
                          pagination.page === pageNum
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!pagination.hasNext}
                    className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Selected Transactions Actions */}
      {selectedTransactions.size > 0 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          <div className="flex items-center gap-4">
            <span>{selectedTransactions.size} transactions selected</span>
            <button
              onClick={() => setSelectedTransactions(new Set())}
              className="px-3 py-1 bg-gray-600 rounded hover:bg-gray-700 text-sm transition-colors"
            >
              Clear
            </button>
            <button
              onClick={() =>
                console.log('Bulk action for:', Array.from(selectedTransactions))
              }
              className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700 text-sm transition-colors"
            >
              Export Selected
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsTab;