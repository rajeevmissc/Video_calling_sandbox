import { ChevronDown, User, Wallet, CalendarCheck, LogOut } from 'lucide-react';

const ProfileDropdown = ({
  isOpen,
  setIsOpen,
  userName,
  user,
  balance,
  loading,
  status,
  loadingStatus,
  updateStatus,
  providerId,
  profileRef,
  navigate,
  handleLogout
}) => {
  return (
    <div className="relative" ref={profileRef}>
      {/* TOP BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-[#F5F5F5] border border-[#E5E5E5] hover:bg-[#EDEDED] transition-colors"
        type="button"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-full flex items-center justify-center text-white font-semibold text-sm">
          {userName.charAt(0).toUpperCase()}
        </div>

        <span className="text-sm font-medium text-gray-900 max-w-32 truncate hidden xl:block">
          {userName}
        </span>

        <ChevronDown size={16} className="text-gray-600" />
      </button>

      {/* DROPDOWN PANEL */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-[#E5E5E5] py-1">
          
          {/* Header */}
          <div className="px-4 py-3 border-b border-[#EDEDED]">
            <p className="text-sm font-semibold text-gray-900">{userName}</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {user?.phoneNumber || ""}
            </p>
          </div>

          {/* My Profile */}
          <button
            onClick={() => {
              if (user.role === 'provider') navigate('/service-provider-profile');
              else if (user.role === 'user') navigate('/dashboard');
              else if (user.role === 'admin') navigate('/admin');
              setIsOpen(false);
            }}
            className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm 
                       bg-[#F5F5F5] border-b border-[#EDEDED]
                       text-gray-700 hover:bg-[#EDEDED] transition-colors"
            type="button"
          >
            <User size={16} />
            <span>My Profile</span>
          </button>

          {/* Wallet */}
          <button
            onClick={() => {
              navigate('/wallet');
              setIsOpen(false);
            }}
            className="w-full flex items-center justify-between px-4 py-2.5 text-sm 
                       bg-[#F5F5F5] border-b border-[#EDEDED]
                       text-gray-700 hover:bg-[#EDEDED] transition-colors"
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
              setIsOpen(false);
            }}
            className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm 
                       bg-[#F5F5F5] border-b border-[#EDEDED]
                       text-gray-700 hover:bg-[#EDEDED] transition-colors"
            type="button"
          >
            <CalendarCheck size={16} />
            <span>Your Booking</span>
          </button>

          {/* Provider Availability */}
          {user?.role === 'provider' && providerId && (
            <>
              <div className="border-t border-[#EDEDED] my-1"></div>

              <div className="px-4 py-2.5 bg-[#F5F5F5] rounded-xl">
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
                        status === "online"
                          ? "bg-green-500"
                          : "bg-gray-400"
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

          <div className="border-t border-[#EDEDED] my-1"></div>

          {/* Logout */}
          <button
            onClick={() => {
              handleLogout();
              setIsOpen(false);
            }}
            className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm 
                       bg-[#F5F5F5] text-red-600 rounded-b-xl 
                       hover:bg-red-50 transition-colors"
            type="button"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
