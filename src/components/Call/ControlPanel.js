import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
  FaDesktop,
  FaComments,
  FaPhoneSlash
} from 'react-icons/fa';

const ControlPanel = ({ controls, ui, callType, chatMessages, onEndCall, callData }) => {

  return (
    <div className="fixed bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-40 backdrop-blur-sm rounded-xl sm:rounded-2xl px-2 sm:px-4 py-2 sm:py-3 border border-gray-700 z-20 max-w-[95vw] sm:max-w-none">
      <div className="flex items-center justify-center space-x-1 sm:space-x-2">
        <ControlButton
          onClick={controls.toggleAudio}
          active={!controls.isAudioMuted}
          icon={controls.isAudioLoading ? (
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            controls.isAudioMuted ? <FaMicrophoneSlash /> : <FaMicrophone />
          )}
          label="Mic"
          className={`${controls.isAudioMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-500'} shadow-lg`}
          disabled={controls.isAudioLoading}
        />

        {callType === 'video' && callData?.userRole !== 'user' && (
          <ControlButton
            onClick={controls.toggleVideo}
            active={!controls.isVideoOff}
            icon={controls.isVideoLoading ? (
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              controls.isVideoOff ? <FaVideoSlash /> : <FaVideo />
            )}
            label="Cam"
            className={`${controls.isVideoOff ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-500'} shadow-lg`}
            disabled={controls.isVideoLoading || controls.videoToggleInProgress}
          />
        )}


        {callType === 'video' && (
          <ControlButton
            onClick={controls.startScreenShare}
            active={controls.isScreenSharing}
            icon={<FaDesktop />}
            label={controls.isScreenSharing ? "Stop" : "Share"}
            labelFull={controls.isScreenSharing ? "Stop Share" : "Share"}
            className={`${controls.isScreenSharing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-500'} shadow-lg`}
          />
        )}

        <ControlButton
          onClick={() => ui.setShowChat(!ui.showChat)}
          active={ui.showChat}
          icon={<FaComments />}
          label="Chat"
          className={`${ui.showChat ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-500'} shadow-lg`}
          badge={chatMessages.length > 0 ? chatMessages.length : null}
        />
        <ControlButton
          onClick={onEndCall}
          active={false}
          icon={<FaPhoneSlash />}
          label="End"
          className="bg-red-600 hover:bg-red-700 shadow-lg ring-1 ring-red-400"
        />
      </div>
    </div>
  );
};

// Responsive Control Button Component
const ControlButton = ({
  onClick,
  active,
  icon,
  label,
  labelFull,
  className,
  badge,
  disabled
}) => (
  <div className="relative">
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${className} border-none rounded-lg sm:rounded-xl px-2 py-1.5 sm:px-3 sm:py-2 text-white font-medium transition-all duration-200 transform hover:scale-105 sm:hover:scale-110 active:scale-95 flex flex-col items-center space-y-0.5 sm:space-y-1 min-w-12 sm:min-w-16 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-xs`}
    >
      {/* Icon - responsive sizing */}
      <span className="text-sm sm:text-base md:text-lg">{icon}</span>

      {/* Label - show short version on mobile, full on larger screens */}
      <span className="font-medium hidden sm:inline">
        {labelFull || label}
      </span>
      <span className="font-medium sm:hidden text-[10px]">
        {label}
      </span>
    </button>

    {/* Badge for notifications */}
    {badge && (
      <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-red-500 text-white text-[9px] sm:text-xs rounded-full w-3.5 h-3.5 sm:w-4 sm:h-4 flex items-center justify-center font-bold shadow-lg">
        {badge > 9 ? '9+' : badge}
      </div>
    )}
  </div>
);

export default ControlPanel;



