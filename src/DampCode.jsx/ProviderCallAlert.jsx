import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Phone, PhoneOff, User, MessageCircle } from 'lucide-react';
import axios from 'axios';
import { useSocket } from '../context/Socketcontext';
import Loader from '../components/Loading';
import { useProviderById } from "../hooks/useProviderById";
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002/api';

const ProviderCallAlert = ({ providerId }) => {
  const [incomingCalls, setIncomingCalls] = useState([]);
  const [dragState, setDragState] = useState({ y: 0, isDragging: false });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);

  const navigate = useNavigate();
  const { socket } = useSocket();

  const audioRef = useRef(null);
  const dragStartY = useRef(0);
  const notificationRefs = useRef(new Map());
  const mountedRef = useRef(true);
  const processingCallsRef = useRef(new Set());
  const callTimeoutsRef = useRef(new Map()); // Track auto-decline timeouts

  // Memoized audio URLs
  const audioUrls = useMemo(
    () => ({
      ringtone:
        'https://commondatastorage.googleapis.com/codeskulptor-assets/Epoq-Lepidoptera.ogg',
      chat: 'https://commondatastorage.googleapis.com/codeskulptor-assets/Epoq-Lepidoptera.ogg',
    }),
    []
  );


  const { provider, loading, error } = useProviderById(providerId);
  if (loading) return null; 
  if (error) return null;

  // Initialize audio ONCE
  useEffect(() => {
    const callAudio = new Audio();
    const chatAudio = new Audio();

    callAudio.preload = 'auto'; // Changed from 'none' to 'auto' for better reliability
    callAudio.loop = true;
    callAudio.volume = 0.8;

    chatAudio.preload = 'auto';
    chatAudio.loop = false;
    chatAudio.volume = 0.6;

    audioRef.current = { call: callAudio, chat: chatAudio };

    return () => {
      if (audioRef.current) {
        Object.values(audioRef.current).forEach((audio) => {
          audio.pause();
          audio.src = '';
          audio.load(); // Properly reset audio element
        });
        audioRef.current = null;
      }
    };
  }, []);

  // Request notification permission on mount
  useEffect(() => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      Notification.requestPermission().catch((error) => {
        console.warn('Notification permission denied:', error);
      });
    }
  }, []);

  // Sound playback with better error handling
  const playSound = useCallback(
    async (mode) => {
      if (!audioRef.current || !mountedRef.current) return;

      const audioType = mode === 'chat' ? 'chat' : 'call';
      const audio = audioRef.current[audioType];

      try {
        // Stop all other audio first
        Object.values(audioRef.current).forEach((a) => {
          if (a !== audio) {
            a.pause();
            a.currentTime = 0;
          }
        });

        if (!audio.src || audio.error) {
          audio.src = audioUrls[audioType === 'call' ? 'ringtone' : 'chat'];
          await new Promise((resolve, reject) => {
            audio.onloadeddata = resolve;
            audio.onerror = reject;
            audio.load();
          });
        }

        audio.currentTime = 0;
        await audio.play();
      } catch (error) {
        if (error.name !== 'NotAllowedError' && error.name !== 'AbortError') {
          console.error(`Sound playback error:`, error);
        }
      }
    },
    [audioUrls]
  );

  // Stop sound
  const stopSound = useCallback(() => {
    if (audioRef.current) {
      Object.values(audioRef.current).forEach((audio) => {
        audio.pause();
        audio.currentTime = 0;
      });
    }
  }, []);

  // Clear all notifications
  const clearAllNotifications = useCallback(() => {
    notificationRefs.current.forEach((notification) => {
      try {
        notification.close();
      } catch (e) {
        // Silent fail
      }
    });
    notificationRefs.current.clear();
  }, []);

  // Clear all call timeouts
  const clearAllTimeouts = useCallback(() => {
    callTimeoutsRef.current.forEach((timeoutId) => {
      clearTimeout(timeoutId);
    });
    callTimeoutsRef.current.clear();
  }, []);

  // Complete cleanup
  const performCompleteCleanup = useCallback(() => {
    stopSound();
    clearAllNotifications();
    clearAllTimeouts();
  }, [stopSound, clearAllNotifications, clearAllTimeouts]);

  // Helper: remove a call from list safely
  const removeCallFromList = useCallback(
    (callId) => {
      setIncomingCalls((prev) => {
        const filtered = prev.filter((call) => call.callId !== callId);
        if (filtered.length === 0) {
          performCompleteCleanup();
        } else {
          // Play sound for next call in queue
          const nextCall = filtered[0];
          if (nextCall) {
            playSound(nextCall.mode);
          }
        }
        return filtered;
      });

      const notification = notificationRefs.current.get(callId);
      if (notification) {
        try {
          notification.close();
        } catch (e) {
          // ignore
        }
        notificationRefs.current.delete(callId);
      }

      // Clear timeout for this call
      const timeoutId = callTimeoutsRef.current.get(callId);
      if (timeoutId) {
        clearTimeout(timeoutId);
        callTimeoutsRef.current.delete(callId);
      }

      processingCallsRef.current.delete(callId);
    },
    [performCompleteCleanup, playSound]
  );

  // Auto-decline call after timeout (60 seconds)
  const setAutoDeclineTimeout = useCallback(
    (call) => {
      const timeoutId = setTimeout(() => {
        console.log('⏰ Auto-declining call after timeout:', call.callId);
        handleDeclineCall(call);
      }, 120000); // 120 seconds

      callTimeoutsRef.current.set(call.callId, timeoutId);
    },
    [] // Will be defined below
  );

  // Handle incoming call
  const handleIncomingCall = useCallback(
    (callData) => {
      if (!mountedRef.current) return;

      // Validate required fields
      if (!callData.callId || !callData.channelName || !callData.callerName) {
        console.error('❌ Invalid call data received:', callData);
        return;
      }

      console.log('📞 Incoming request via Socket.IO:', callData);

      setIncomingCalls((prev) => {
        const exists = prev.some((call) => call.callId === callData.callId);
        if (exists) {
          console.log('⚠️ Duplicate call ignored:', callData.callId);
          return prev;
        }

        // Set default mode if not provided
        const normalizedCallData = {
          ...callData,
          mode: callData.mode || 'audio',
        };

        // Only play sound if this is the first call
        if (prev.length === 0) {
          playSound(normalizedCallData.mode);
        }

        return [...prev, normalizedCallData];
      });

      // Set auto-decline timeout
      setAutoDeclineTimeout(callData);

      // Show browser notification
      if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        try {
          const config =
            callData.mode === 'chat'
              ? {
                  title: 'Incoming Chat Request',
                  body: `${callData.callerName} wants to chat`,
                  vibrate: [100, 100],
                  silent: true,
                }
              : {
                  title: `Incoming ${callData.mode === 'video' ? 'Video' : 'Audio'} Call`,
                  body: `${callData.callerName} is calling`,
                  vibrate: [200, 100, 200],
                  silent: false,
                };

          const notification = new Notification(config.title, {
            body: config.body,
            icon: '/icon-192x192.png',
            badge: '/badge-72x72.png',
            tag: callData.callId,
            requireInteraction: true,
            vibrate: config.vibrate,
            silent: config.silent,
          });

          notificationRefs.current.set(callData.callId, notification);

          notification.onclick = () => {
            window.focus();
            notification.close();
            notificationRefs.current.delete(callData.callId);
          };

          notification.onclose = () => {
            notificationRefs.current.delete(callData.callId);
          };
        } catch (error) {
          console.error('Notification error:', error);
        }
      }
    },
    [playSound, setAutoDeclineTimeout]
  );

  // Handle call ended (via socket)
  const handleCallEnded = useCallback(
    ({ callId }) => {
      if (!mountedRef.current) return;

      console.log('📞 Call ended via Socket.IO:', callId);
      removeCallFromList(callId);
    },
    [removeCallFromList]
  );

  // Handle call declined (via socket)
  const handleCallDeclined = useCallback(
    ({ callId }) => {
      if (!mountedRef.current) return;

      console.log('📞 Call declined via Socket.IO:', callId);
      removeCallFromList(callId);
    },
    [removeCallFromList]
  );

  // Socket event listeners with reconnection handling
  useEffect(() => {
    if (!socket || !providerId) return;

    console.log('🔌 Registering provider with Socket.IO:', providerId);
    socket.emit('register-provider', providerId);

    socket.on('incoming-call', handleIncomingCall);
    socket.on('call-ended', handleCallEnded);
    socket.on('call-declined', handleCallDeclined);

    // Handle socket disconnection
    const handleDisconnect = () => {
      console.warn('⚠️ Socket disconnected');
    };

    const handleReconnect = () => {
      console.log('🔌 Socket reconnected, re-registering provider');
      socket.emit('register-provider', providerId);
    };

    socket.on('disconnect', handleDisconnect);
    socket.on('connect', handleReconnect);

    return () => {
      socket.off('incoming-call', handleIncomingCall);
      socket.off('call-ended', handleCallEnded);
      socket.off('call-declined', handleCallDeclined);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect', handleReconnect);
    };
  }, [socket, providerId, handleIncomingCall, handleCallEnded, handleCallDeclined]);

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      performCompleteCleanup();
    };
  }, [performCompleteCleanup]);

  // Accept call
  const handleAcceptCall = useCallback(
    async (call) => {
      if (!call || processingCallsRef.current.has(call.callId)) {
        console.log('⚠️ Call already being processed:', call?.callId);
        return;
      }

      processingCallsRef.current.add(call.callId);
      setIsProcessing(true);
      setIsAccepting(true);

      try {
        console.log('✅ Accepting request:', call.callId);

        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        // Notify backend
        await axios.post(
          `${API_BASE_URL}/notifications/accept-call/${call.callId}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 10000,
          }
        );

        // Remove this call from queue (and cleanup if last one)
        removeCallFromList(call.callId);

        if (call.mode === 'chat') {
          navigate(`/call/${call.channelName}/${call.mode}`, {
            state: {
              callData: {
                channelName: call.channelName,
                participantName: call.callerName,
                userRole: 'provider',
                callId: call.callId,
                providerData: provider?.personalInfo,
              },
            },
            replace: true,
          });
        } else {
          const tokenResponse = await axios.get(`${API_BASE_URL}/agora/call-tokens`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { channel: call.channelName },
            timeout: 10000,
          });

          const { rtcToken, uid, appId } = tokenResponse.data;

          if (!rtcToken || !uid || !appId) {
            throw new Error('Invalid token response from server');
          }

          navigate(`/call/${call.channelName}/${call.mode}`, {
            state: {
              callData: {
                channelName: call.channelName,
                token: rtcToken,
                uid: uid,
                appId: appId,
                userRole: 'provider',
                callId: call.callId,
              },
              participantName: call.callerName,
            },
            replace: true,
          });
        }
      } catch (error) {
        console.error('Accept error:', error);
        // On error, still remove this call locally
        removeCallFromList(call.callId);
        setIsAccepting(false);
        setIsProcessing(false);

        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          'Failed to join call';
        
        alert(`Failed to join ${call.mode === 'chat' ? 'chat' : 'call'}: ${errorMessage}`);
      }
    },
    [navigate, removeCallFromList]
  );

  // Decline call
  const handleDeclineCall = useCallback(
    async (call) => {
      if (!call || processingCallsRef.current.has(call.callId)) {
        console.log('⚠️ Call already being processed:', call?.callId);
        return;
      }

      processingCallsRef.current.add(call.callId);
      setIsProcessing(true);

      try {
        console.log('❌ Declining request:', call.callId);

        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        await axios.post(
          `${API_BASE_URL}/notifications/decline-call/${call.callId}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 10000,
          }
        );

        console.log('✅ Call declined successfully:', call.callId);
      } catch (error) {
        console.error('Decline API error:', error);
      } finally {
        // Always remove call locally, even if API failed
        removeCallFromList(call.callId);
        setIsProcessing(false);
      }
    },
    [removeCallFromList]
  );

  // Drag handlers (TOUCH ONLY)
  const handleDragStart = useCallback((e) => {
    if (e.touches && e.touches.length > 0) {
      const clientY = e.touches[0].clientY;
      dragStartY.current = clientY;
      setDragState((prev) => ({ ...prev, isDragging: true }));
    }
  }, []);

  const handleDragMove = useCallback(
    (e) => {
      if (!dragState.isDragging || !e.touches || e.touches.length === 0) return;

      const clientY = e.touches[0].clientY;
      const deltaY = clientY - dragStartY.current;

      if (deltaY > 0) {
        setDragState({ y: deltaY, isDragging: true });
      }
    },
    [dragState.isDragging]
  );

  const handleDragEnd = useCallback(() => {
    const activeCall = incomingCalls[0];
    if (dragState.y > 150 && activeCall && !isProcessing) {
      handleDeclineCall(activeCall);
    }
    setDragState({ y: 0, isDragging: false });
  }, [dragState.y, incomingCalls, handleDeclineCall, isProcessing]);

  const activeCall = incomingCalls[0] || null;

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

  if (isAccepting) {
    return <Loader />;
  }

  if (incomingCalls.length === 0) {
    return null;
  }

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
      {/* Top drag indicator */}
      <div className="w-full flex flex-col items-center pt-4">
        <div className="w-12 h-1 bg-white/30 rounded-full mb-8 animate-pulse" />

        <div
          className={`mb-6 px-4 py-2 ${modeStyles.badgeBg} backdrop-blur-sm rounded-full flex items-center gap-2`}
        >
          <ModeIcon className="w-4 h-4 text-white" />
          <span className="text-white text-sm font-medium">{modeStyles.title}</span>
        </div>
      </div>

      {/* Center content (drag area on touch) */}
      <div
        className="flex flex-col items-center flex-1 justify-center touch-none"
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        {/* Avatar */}
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
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
            ) : null}
            <User
              className="w-16 h-16 sm:w-20 sm:h-20 text-white"
              style={{ display: activeCall?.callerAvatar ? 'none' : 'block' }}
            />
          </div>
        </div>

        <h1 className="text-white text-3xl sm:text-4xl font-bold mb-2 text-center px-4">
          {activeCall?.callerName}
        </h1>

        <p className="text-white/80 text-lg mb-1">
          {activeCall?.mode === 'chat' ? 'Incoming chat request...' : 'Incoming call...'}
        </p>

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

        {incomingCalls.length > 1 && (
          <div className="text-white/70 text-sm mb-4">+{incomingCalls.length - 1} more waiting</div>
        )}
      </div>

      {/* Action buttons */}
      <div className="w-full max-w-md mb-8">
        <div className="flex items-center justify-center gap-8 sm:gap-16">
          <button
            onClick={() => handleDeclineCall(activeCall)}
            disabled={isProcessing}
            className="group flex flex-col items-center gap-3 touch-manipulation active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Decline call"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-500 hover:bg-red-600 active:bg-red-700 rounded-full flex items-center justify-center shadow-2xl group-active:scale-90 transition-all">
              <PhoneOff className="w-8 h-8 sm:w-10 sm:h-10 text-white -rotate-45" />
            </div>
            <span className="text-white text-sm font-medium">Decline</span>
          </button>

          <button
            onClick={() => handleAcceptCall(activeCall)}
            disabled={isProcessing}
            className="group flex flex-col items-center gap-3 touch-manipulation active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Accept call"
          >
            <div className="relative">
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
      </div>
    </div>
  );
};

export default ProviderCallAlert;