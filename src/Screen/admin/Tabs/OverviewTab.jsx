import { useState, useEffect } from "react";
import {
  Calendar,
  Users,
  MessageSquare,
  ShieldCheck,
  UserCog,
} from "lucide-react";
import StatsCard from "../Components/StatsCard";
import { fetchWithAuth, API_ENDPOINTS } from "../utils/api";

/* ===========================================================
   MAIN OVERVIEW TAB
=========================================================== */
const OverviewTab = () => {
  const [stats, setStats] = useState(null);
  const [lists, setLists] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchAllDashboardData = async () => {
    try {
      const results = await Promise.allSettled([
        fetchWithAuth(API_ENDPOINTS.users.list("user")),
        fetchWithAuth(API_ENDPOINTS.providers.list),  // 🔥 NEW API
        fetchWithAuth(API_ENDPOINTS.users.list("admin")),
        fetchWithAuth(API_ENDPOINTS.bookings.all),
        fetchWithAuth(API_ENDPOINTS.transactions.stats),
        fetchWithAuth(API_ENDPOINTS.transactions.list),
        fetchWithAuth(API_ENDPOINTS.testimonials.all),
      ]);

      const safeUsers = (res) => res?.value?.data?.users || [];

      const userList = safeUsers(results[0]);
      const providerList = results[1]?.value?.data || [];
      const adminList = safeUsers(results[2]);

      const bookings = results[3]?.value?.data || [];
      const txnStats = results[4]?.value?.data || { totalRevenue: 0 };
      const transactions = results[5]?.value?.data || [];
      const testimonials = results[6]?.value?.data || [];

      /* ------------------------------------------------------
         CLEAN USERS TABLE
      ------------------------------------------------------ */
      const formattedUsers = userList.map((u) => ({
        phone: u.phoneNumber,
        role: u.role,
        verified: u.isVerified ? "Yes" : "No",
        status: u.status,
        fullName: u.profile?.fullName || "N/A",
        totalLogins: u.stats?.totalLogins ?? 0,
        lastLogin: u.stats?.lastLogin || "N/A",
        lastLoginIP: u.stats?.lastLoginIP || "N/A",
      }));

      /* ------------------------------------------------------
         CLEAN PROVIDERS TABLE (ONLY personalInfo)
      ------------------------------------------------------ */
      const formattedProviders = providerList.map((p) => ({
        profileImage: p.personalInfo.profileImage,
        fullName: p.personalInfo.fullName,
        email: p.personalInfo.email,
        phone: p.personalInfo.phone,
        dateOfBirth: p.personalInfo.dateOfBirth
          ? p.personalInfo.dateOfBirth.split("T")[0]
          : "N/A",
      }));

      /* ------------------------------------------------------
         CLEAN BOOKINGS TABLE
      ------------------------------------------------------ */
      const formattedBookings = bookings.map((b) => ({
        bookingId: b.bookingId,
        userName: b.userName || b.userId?.profile?.fullName || "Unknown User",
        providerName: b.providerName || "Unknown Provider",
        date: b.date,
        timeSlot: b.timeSlot,
        mode: b.mode,
        duration: b.duration,
        price: b.price,
        status: b.status,
      }));

      setStats({
        totalUsers: userList.length,
        totalProviders: providerList.length,
        totalAdmins: adminList.length,
        totalBookings: bookings.length,
        totalRevenue: txnStats.totalRevenue || 0,
        totalTransactions: transactions.length,
        pendingReviews: testimonials.filter((t) => t.status === "pending").length,
      });

      setLists({
        users: formattedUsers,
        providers: formattedProviders,
        admins: adminList,
        bookings: formattedBookings,
        transactions,
        testimonials,
      });
    } catch (err) {
      console.error("Dashboard API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllDashboardData();
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10 p-4">
      {/* ================= Stats Section ================= */}
      <div className="grid grid-cols-5 gap-4">
        <StatsCard title="Total Users" value={stats.totalUsers} icon={Users} color="blue" />
        <StatsCard title="Total Providers" value={stats.totalProviders} icon={ShieldCheck} color="purple" />
        <StatsCard title="Total Admins" value={stats.totalAdmins} icon={UserCog} color="green" />
        <StatsCard title="Total Bookings" value={stats.totalBookings} icon={Calendar} color="indigo" />
        <StatsCard title="Pending Reviews" value={stats.pendingReviews} icon={MessageSquare} color="orange" />
      </div>

      {/* ================= Tables ================= */}
      <UsersTable data={lists.users} />
      <ProvidersTable data={lists.providers} />
      <BookingsTable data={lists.bookings} />

      <FlattenTable title="All Admins" data={lists.admins} />
    </div>
  );
};

export default OverviewTab;

/* ===========================================================
   USERS TABLE
=========================================================== */
const UsersTable = ({ data }) => <CleanTable title="All Users" data={data} />;

/* ===========================================================
   PROVIDERS TABLE WITH AVATAR
=========================================================== */
const ProvidersTable = ({ data }) => <ProvidersCleanTable title="All Providers" data={data} />;

/* ===========================================================
   BOOKINGS TABLE
=========================================================== */
const BookingsTable = ({ data }) => <CleanTable title="All Bookings" data={data} />;

/* ===========================================================
   PROVIDERS TABLE (with image avatar)
=========================================================== */
const ProvidersCleanTable = ({ title, data }) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  const pageSize = 10;
  const columns = ["profileImage", "fullName", "email", "phone", "dateOfBirth"];

  const filtered = data.filter((u) =>
    JSON.stringify(u).toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    if (!sortField) return 0;
    const valA = a[sortField] ?? "";
    const valB = b[sortField] ?? "";
    if (valA < valB) return sortDirection === "asc" ? -1 : 1;
    if (valA > valB) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sorted.length / pageSize);
  const rows = sorted.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (col) => {
    if (sortField === col) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(col);
      setSortDirection("asc");
    }
  };

  return (
    <div className="bg-white shadow rounded p-4 mt-10">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">{title}</h2>

        <input
          type="text"
          placeholder="Search..."
          className="border px-3 py-1 rounded w-48"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
      </div>

      <table className="min-w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            {columns.map((col) => (
              <th
                key={col}
                onClick={() => handleSort(col)}
                className="border px-3 py-2 cursor-pointer capitalize hover:bg-gray-200"
              >
                {col}
                {sortField === col ? (sortDirection === "asc" ? " ▲" : " ▼") : ""}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border hover:bg-gray-50">

              {/* Profile Image Avatar */}
              <td className="border px-3 py-2">
                <img
                  src={row.profileImage || "/default-avatar.png"}
                  alt="avatar"
                  className="w-10 h-10 rounded-full object-cover border"
                />
              </td>

              <td className="border px-3 py-2">{row.fullName}</td>
              <td className="border px-3 py-2">{row.email}</td>
              <td className="border px-3 py-2">{row.phone}</td>
              <td className="border px-3 py-2">{row.dateOfBirth}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <span>Page {page} of {totalPages}</span>
        <div className="flex gap-2">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="px-3 py-1 border rounded">
            Prev
          </button>
          <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="px-3 py-1 border rounded">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

/* ===========================================================
   GENERIC CLEAN TABLE (USED FOR USERS + BOOKINGS)
=========================================================== */
const CleanTable = ({ title, data }) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  const pageSize = 10;
  const columns = Object.keys(data[0] || {});

  const filtered = data.filter((u) =>
    JSON.stringify(u).toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    if (!sortField) return 0;
    const valA = a[sortField] ?? "";
    const valB = b[sortField] ?? "";
    if (valA < valB) return sortDirection === "asc" ? -1 : 1;
    if (valA > valB) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sorted.length / pageSize);
  const rows = sorted.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (col) => {
    if (sortField === col) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(col);
      setSortDirection("asc");
    }
  };

  return (
    <div className="bg-white shadow rounded p-4 mt-10">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">{title}</h2>

        <input
          type="text"
          placeholder="Search..."
          className="border px-3 py-1 rounded w-48"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
      </div>

      <table className="min-w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            {columns.map((col) => (
              <th
                key={col}
                onClick={() => handleSort(col)}
                className="border px-3 py-2 cursor-pointer capitalize hover:bg-gray-200"
              >
                {col}
                {sortField === col ? (sortDirection === "asc" ? " ▲" : " ▼") : ""}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border hover:bg-gray-50">
              {columns.map((col) => (
                <td key={col} className="border px-3 py-2">
                  {row[col]?.toString()}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <span>Page {page} of {totalPages}</span>
        <div className="flex gap-2">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="px-3 py-1 border rounded">
            Prev
          </button>
          <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="px-3 py-1 border rounded">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

/* ===========================================================
   FLATTEN TABLE (Admin)
=========================================================== */
const FlattenTable = ({ title, data }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="bg-white shadow rounded p-4 mt-10">
        <h2 className="text-lg font-semibold mb-3">{title}</h2>
        <p>No records found.</p>
      </div>
    );
  }

  const rows = data.map((item) => {
    const result = {};
    const flatten = (obj, parent = "") => {
      Object.keys(obj || {}).forEach((key) => {
        const value = obj[key];
        const newKey = parent ? `${parent}.${key}` : key;

        if (value && typeof value === "object" && !Array.isArray(value)) {
          flatten(value, newKey);
        } else {
          result[newKey] = value;
        }
      });
    };
    flatten(item);
    return result;
  });

  const keys = Object.keys(rows[0]);

  return (
    <div className="bg-white shadow rounded p-4 overflow-x-auto mt-10">
      <h2 className="text-lg font-semibold mb-3">{title}</h2>

      <table className="min-w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            {keys.map((key) => (
              <th key={key} className="border px-3 py-2">{key}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx} className="border hover:bg-gray-50">
              {keys.map((key) => (
                <td
                  key={key}
                  className="border px-3 py-2 max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap"
                >
                  {row[key]?.toString()}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

