// components/ProviderCallAlert/CallNotificationUI.jsx
import { useMemo } from 'react';
import { Video, Phone, PhoneOff, User, MessageCircle } from 'lucide-react';

/**
 * CallNotificationUI - Beautiful full-screen call notification
 * Works like WhatsApp/Truecaller - shows one call at a time
 */
const CallNotificationUI = ({
  activeCall,
  dragState,
  isProcessing,
  onAccept,
  onDecline,
  onDragStart,
  onDragMove,
  onDragEnd,
}) => {
  // Dynamic styling based on call type
  const modeStyles = useMemo(() => {
    const mode = activeCall?.mode;
    switch (mode) {
      case 'chat':
        return {
          gradient: 'from-green-900 via-green-800 to-green-900',
          badgeBg: 'bg-green-500/20',
          icon: MessageCircle,
          acceptButton: 'bg-green-500 hover:bg-green-600 active:bg-green-700',
          title: 'Chat Request',
          iconGradient: 'from-green-400 to-green-600',
        };
      case 'video':
        return {
          gradient: 'from-blue-900 via-blue-800 to-blue-900',
          badgeBg: 'bg-blue-500/20',
          icon: Video,
          acceptButton: 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700',
          title: 'Video Call',
          iconGradient: 'from-blue-400 to-blue-600',
        };
      default:
        return {
          gradient: 'from-purple-900 via-purple-800 to-purple-900',
          badgeBg: 'bg-purple-500/20',
          icon: Phone,
          acceptButton: 'bg-purple-500 hover:bg-purple-600 active:bg-purple-700',
          title: 'Audio Call',
          iconGradient: 'from-purple-400 to-purple-600',
        };
    }
  }, [activeCall?.mode]);

  const ModeIcon = modeStyles.icon;

  if (!activeCall) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-gradient-to-b ${modeStyles.gradient} flex flex-col items-center justify-between p-6`}
      style={{
        transform: `translateY(${dragState.y}px)`,
        opacity: dragState.y > 0 ? Math.max(0, 1 - dragState.y / 300) : 1,
        transition: dragState.isDragging ? 'none' : 'all 0.3s ease-out',
        willChange: 'transform, opacity',
      }}
    >
      {/* Top section - Drag indicator */}
      <div className="w-full flex flex-col items-center pt-4">
        <div className="w-12 h-1 bg-white/30 rounded-full mb-8 animate-pulse" />

        <div
          className={`mb-6 px-4 py-2 ${modeStyles.badgeBg} backdrop-blur-sm rounded-full flex items-center gap-2`}
        >
          <ModeIcon className="w-4 h-4 text-white" />
          <span className="text-white text-sm font-medium">{modeStyles.title}</span>
        </div>
      </div>

      {/* Center section - Caller info (drag area on touch devices) */}
      <div
        className="flex flex-col items-center flex-1 justify-center touch-none"
        onTouchStart={onDragStart}
        onTouchMove={onDragMove}
        onTouchEnd={onDragEnd}
      >
        {/* Avatar with pulsing ring */}
        <div className="relative mb-8">
          <div
            className="absolute inset-0 bg-white rounded-full opacity-20 animate-ping"
            style={{ animationDuration: '2s' }}
          />
          <div
            className={`relative w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br ${modeStyles.iconGradient} rounded-full flex items-center justify-center border-4 border-white/30 shadow-2xl`}
          >
            {activeCall?.callerAvatar ? (
              <img
                src={activeCall.callerAvatar}
                alt={activeCall.callerName}
                className="w-full h-full rounded-full object-cover"
                loading="eager"
                onError={(e) => {
                  // Hide image on error, show fallback icon
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <User className="w-16 h-16 sm:w-20 sm:h-20 text-white" />
            )}
          </div>
        </div>

        {/* Caller name */}
        <h1 className="text-white text-3xl sm:text-4xl font-bold mb-2 text-center px-4">
          {activeCall?.callerName}
        </h1>

        {/* Status text */}
        <p className="text-white/80 text-lg mb-1">
          {activeCall?.mode === 'chat' ? 'Incoming chat request...' : 'Incoming call...'}
        </p>

        {/* Animated dots */}
        <div className="flex gap-1 mb-4">
          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" />
          <div
            className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
            style={{ animationDelay: '0.1s' }}
          />
          <div
            className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
            style={{ animationDelay: '0.2s' }}
          />
        </div>
      </div>

      {/* Bottom section - Action buttons */}
      <div className="w-full max-w-md mb-8">
        <div className="flex items-center justify-center gap-8 sm:gap-16">
          {/* Decline button */}
          <button
            onClick={onDecline}
            disabled={isProcessing}
            className="group flex flex-col items-center gap-3 touch-manipulation active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Decline call"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-500 hover:bg-red-600 active:bg-red-700 rounded-full flex items-center justify-center shadow-2xl group-active:scale-90 transition-all">
              <PhoneOff className="w-8 h-8 sm:w-10 sm:h-10 text-white -rotate-45" />
            </div>
            <span className="text-white text-sm font-medium">Decline</span>
          </button>

          {/* Accept button */}
          <button
            onClick={onAccept}
            disabled={isProcessing}
            className="group flex flex-col items-center gap-3 touch-manipulation active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Accept call"
          >
            <div className="relative">
              {/* Pulsing ring effect */}
              <div
                className={`absolute inset-0 ${
                  activeCall?.mode === 'chat'
                    ? 'bg-green-400'
                    : activeCall?.mode === 'video'
                    ? 'bg-blue-400'
                    : 'bg-purple-400'
                } rounded-full animate-ping opacity-30`}
                style={{ animationDuration: '1.5s' }}
              />
              <div
                className={`relative w-16 h-16 sm:w-20 sm:h-20 ${modeStyles.acceptButton} rounded-full flex items-center justify-center shadow-2xl group-active:scale-90 transition-all`}
              >
                <ModeIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
            </div>
            <span className="text-white text-sm font-medium">Accept</span>
          </button>
        </div>

        {/* Hint text */}
        <p className="text-white/50 text-xs text-center mt-6">
          Swipe down to decline
        </p>
      </div>
    </div>
  );
};

export default CallNotificationUI;