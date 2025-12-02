import { FaCheckCircle, FaComments, FaTimes } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";

const EndCallPopup = ({
  onShareExperience,
  onClose,
  callDuration,
  totalCharged,
  callType,
  userRole
}) => {

  const navigate = useNavigate();
 console.log("EndCallPopup rendered with:", {
    callDuration,
    totalCharged,
    callType,
    userRole
  });
  // Format duration from seconds to MM:SS
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getCallTypeDisplay = (type) => {
    switch (type) {
      case 'chat': return 'Chat';
      case 'video': return 'Video Call';
      case 'audio': return 'Audio Call';
      default: return 'Call';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl sm:rounded-2xl border border-slate-700 p-4 sm:p-6 md:p-8 max-w-md w-full shadow-2xl animate-slideDown relative">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-white transition-colors p-1 hover:bg-slate-700 rounded-lg"
          aria-label="Close"
        >
          <FaTimes className="text-base sm:text-lg" />
        </button>

        {/* Content */}
        <div className="text-center mb-4 sm:mb-6">

          {/* Success Icon */}
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <FaCheckCircle className="text-white text-xl sm:text-2xl" />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
            {getCallTypeDisplay(callType)} Ended
          </h2>

          {callDuration && (
            <p className="text-gray-300 text-sm sm:text-base font-medium mb-3">
              {getCallTypeDisplay(callType)} Duration: {formatDuration(callDuration)}
            </p>
          )}

          {totalCharged > 0 && (
            <div className="mb-3 p-3 bg-blue-900 bg-opacity-20 border border-blue-700 border-opacity-30 rounded-lg">
              <span className="text-blue-300 text-sm sm:text-base font-semibold">
                Total Charges: ₹{totalCharged}
              </span>
              <p className="text-gray-400 text-xs mt-1">
                Amount deducted from your wallet
              </p>
            </div>
          )}

          <p className="text-gray-400 text-xs sm:text-sm px-2">
            Thank you for using our service. We hope you had a great experience!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 sm:space-y-4">

          {/* IF USER → Show "Share Your Experience" */}
          {userRole === "user" && (
            <button
              onClick={onShareExperience}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg sm:rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2 text-sm sm:text-base"
            >
              <FaComments className="text-xs sm:text-sm" />
              <span>Share Your Experience</span>
            </button>
          )}

          {/* IF PROVIDER → Show "Back to Home" */}
          {userRole === "provider" && userRole === "provider" && (
            <button
              onClick={() => {
                navigate("/");     // Navigate first
                window.location.reload();  // Force full refresh
              }}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg sm:rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 text-sm sm:text-base"
            >
              Back to Home
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EndCallPopup;


