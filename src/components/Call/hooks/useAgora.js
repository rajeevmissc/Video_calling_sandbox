import { useState, useEffect, useRef, useCallback } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import AgoraRTM from 'agora-rtm-sdk';
import axios from 'axios';
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
  FaDesktop,
  FaPhoneSlash,
  FaComments,
  FaCircle,
  FaUsers,
  FaClock,
  FaWifi,
  FaUser,
  FaStop,
  FaPaperPlane,
  FaTimes,
  FaExclamationTriangle,
  FaSignal,
  FaUserTimes,
  FaCheckCircle
} from 'react-icons/fa';

// Create Agora client
const client = AgoraRTC.createClient({
  mode: 'rtc',
  codec: 'vp8'
});

AgoraRTC.setLogLevel(1);

export const useAgora = (channelName, callType, navigate, userRole) => {
  // State management
  const [remoteUsers, setRemoteUsers] = useState([]);
  const [localTracks, setLocalTracks] = useState([]);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(callType === 'audio' || callType === 'chat');
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [callDuration, setCallDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [networkQuality, setNetworkQuality] = useState({ uplink: 0, downlink: 0 });
  const [audioLevels, setAudioLevels] = useState({ local: 0, remote: {} });
  const [connectionState, setConnectionState] = useState('DISCONNECTED');
  const [remoteUserStates, setRemoteUserStates] = useState({});
  const [reconnecting, setReconnecting] = useState(false);
  const [localVideoReady, setLocalVideoReady] = useState(false);
  const [userLeftNotification, setUserLeftNotification] = useState(null);
  const [cameraStateNotification, setCameraStateNotification] = useState(null);
  const [tokenExpiryWarning, setTokenExpiryWarning] = useState(false);

  // Refs
  const localVideoRef = useRef(null);
  const localVideoMainRef = useRef(null);
  const chatMessagesRef = useRef([]);
  const callStartTimeRef = useRef(null);
  const connectionTimeRef = useRef(null); // Synced connection time
  const timerStartedRef = useRef(false);
  const chatEndRef = useRef(null);
  const isJoinedRef = useRef(false);
  const tokenExpiryTimerRef = useRef(null);
  const audioLevelIntervalRef = useRef(null);
  const localTracksRef = useRef([]);
  const retryCountRef = useRef(0);
  const screenTrackRef = useRef(null);
  const videoTrackRef = useRef(null);
  const notificationTimeoutRef = useRef(null);
  const rtmClientRef = useRef(null);
  const rtmChannelRef = useRef(null);

  // Icons for consistent usage
  const icons = {
    FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaDesktop,
    FaPhoneSlash, FaComments, FaCircle, FaUsers, FaClock, FaWifi, FaUser,
    FaStop, FaPaperPlane, FaTimes, FaExclamationTriangle, FaSignal,
    FaUserTimes, FaCheckCircle
  };

  // Auto-hide notifications
  useEffect(() => {
    if (userLeftNotification || cameraStateNotification || error) {
      const timer = setTimeout(() => {
        setUserLeftNotification(null);
        setCameraStateNotification(null);
        setError(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [userLeftNotification, cameraStateNotification, error]);

  // Network quality monitoring
  useEffect(() => {
    const handleNetworkQuality = (stats) => {
      setNetworkQuality({
        uplink: stats.uplinkNetworkQuality,
        downlink: stats.downlinkNetworkQuality
      });
    };

    client.on('network-quality', handleNetworkQuality);
    return () => client.off('network-quality', handleNetworkQuality);
  }, []);

  // Connection state monitoring
  useEffect(() => {
    const handleConnectionStateChange = (curState, prevState, reason) => {
      setConnectionState(curState);

      if (curState === 'RECONNECTING') {
        setReconnecting(true);
      } else if (curState === 'CONNECTED') {
        setReconnecting(false);
        retryCountRef.current = 0;
      } else if (curState === 'DISCONNECTED') {
        setReconnecting(false);
        if (reason !== 'LEAVE') {
          handleAbnormalDisconnection(reason);
        }
      }
    };

    client.on('connection-state-change', handleConnectionStateChange);
    return () => client.off('connection-state-change', handleConnectionStateChange);
  }, []);

  // Handle abnormal disconnection
  const handleAbnormalDisconnection = useCallback((reason) => {
    console.error('Abnormal disconnection:', reason);
    if (retryCountRef.current < 3) {
      retryCountRef.current++;
      setError(`Connection lost. Reconnecting... (Attempt ${retryCountRef.current}/3)`);
    } else {
      setError('Unable to reconnect. Please refresh the page.');
    }
  }, []);

  // Audio level monitoring
  useEffect(() => {
    if (localTracks[0]) {
      audioLevelIntervalRef.current = setInterval(() => {
        const level = localTracks[0].getVolumeLevel();
        setAudioLevels(prev => ({ ...prev, local: level }));
      }, 100);
    }

    return () => {
      if (audioLevelIntervalRef.current) {
        clearInterval(audioLevelIntervalRef.current);
      }
    };
  }, [localTracks]);

  // Token expiry warning
  const setupTokenExpiryWarning = useCallback((expiryTime) => {
    if (tokenExpiryTimerRef.current) {
      clearTimeout(tokenExpiryTimerRef.current);
    }

    const warningTime = expiryTime - 5 * 60 * 1000;
    const timeUntilWarning = warningTime - Date.now();

    if (timeUntilWarning > 0) {
      tokenExpiryTimerRef.current = setTimeout(() => {
        setTokenExpiryWarning(true);
        renewToken();
      }, timeUntilWarning);
    }
  }, []);

  // Token renewal
  const renewToken = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/agora/call-tokens`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { channel: channelName }
      });

      const { rtcToken } = response.data;
      await client.renewToken(rtcToken);
      setTokenExpiryWarning(false);
    } catch (error) {
      console.error('Failed to renew token:', error);
      setError('Session expiring soon. Please rejoin the call.');
    }
  };

  // Show notification helper
  const showNotification = useCallback((message, type = 'info', duration = 2000) => {
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }

    if (type === 'userLeft') {
      setUserLeftNotification(message);
      notificationTimeoutRef.current = setTimeout(() => {
        setUserLeftNotification(null);
      }, duration);
    } else if (type === 'cameraState') {
      setCameraStateNotification(message);
      notificationTimeoutRef.current = setTimeout(() => {
        setCameraStateNotification(null);
      }, duration);
    }
  }, []);

  // Synchronized timer that starts after 5 second delay
  const startSyncedTimer = useCallback(() => {
    if (timerStartedRef.current) return;

    timerStartedRef.current = true;
    const connectionTimestamp = Date.now();
    connectionTimeRef.current = connectionTimestamp;

    // Send connection time to other user
    if (rtmChannelRef.current) {
      try {
        rtmChannelRef.current.sendMessage({
          text: JSON.stringify({
            type: 'SYSTEM_CONNECTION_TIME',
            timestamp: connectionTimestamp
          })
        });
      } catch (err) {
        console.warn('Failed to send connection time:', err);
      }
    }

    console.log('🕐 Synced timer started at:', connectionTimestamp);
  }, []);

  // Call duration timer with 5 second delay after connection
  useEffect(() => {
    callStartTimeRef.current = Date.now();

    const timer = setInterval(() => {
      if (connectionTimeRef.current && timerStartedRef.current) {
        // Calculate time since connection, then subtract 5 seconds
        const elapsed = Math.floor((Date.now() - connectionTimeRef.current) / 1000);
        const adjustedDuration = Math.max(0, elapsed - 5); // Subtract 5 sec delay
        setCallDuration(adjustedDuration);
      } else {
        // Before connection, just track waiting time
        setCallDuration(0);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    chatMessagesRef.current = chatMessages;
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  // Send chat message
  const sendMessage = useCallback(async (messageTextOrEvent) => {
    // Handle if called from event handler (button click)
    let messageText = messageTextOrEvent;

    // If it's an event object, ignore it and use chatInput
    if (messageTextOrEvent && typeof messageTextOrEvent === 'object' && messageTextOrEvent.preventDefault) {
      messageText = chatInput.trim();
    } else if (typeof messageTextOrEvent === 'string') {
      messageText = messageTextOrEvent;
    } else {
      messageText = chatInput.trim();
    }

    // Allow sending system messages directly
    if (typeof messageText === 'string' && messageText.startsWith('SYSTEM:')) {
      if (rtmChannelRef.current) {
        try {
          await rtmChannelRef.current.sendMessage({
            text: JSON.stringify({ text: messageText })
          });
        } catch (err) {
          console.warn('[RTM] Failed to send system message', err);
        }
      }
      return;
    }

    // Regular user message
    if (messageText && rtmChannelRef.current) {
      const textToSend = messageText;
      setChatInput('');

      try {
        await rtmChannelRef.current.sendMessage({
          text: JSON.stringify({ text: textToSend })
        });
        const newMsg = {
          id: Date.now(),
          text: textToSend,
          timestamp: new Date().toLocaleTimeString(),
          sender: 'You',
          isLocal: true
        };
        setChatMessages(prev => [...prev, newMsg]);
      } catch (err) {
        console.warn('[RTM] Failed to send message', err);
        const newMsg = {
          id: Date.now(),
          text: textToSend,
          timestamp: new Date().toLocaleTimeString(),
          sender: 'You (not sent)',
          isLocal: true
        };
        setChatMessages(prev => [...prev, newMsg]);
      }
    }
  }, [chatInput]);

  // Main effect - Join channel
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login/user');
      return;
    }

    let tracksToCleanUp = [];

    const joinChannel = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setConnectionState('CONNECTING');

        // Setup event handlers
        setupEventHandlers();

        // Get tokens
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/agora/call-tokens`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { channel: channelName }
        });

        const { rtcToken, rtmToken, uid: serverUid, appId } = response.data;
        if (response.data.tokenExpiry) {
          setupTokenExpiryWarning(response.data.tokenExpiry);
        }

        // Join RTC
        await client.join(appId, channelName, rtcToken, serverUid);
        isJoinedRef.current = true;
        setConnectionState('CONNECTED');

        // Create and publish tracks based on callType
        const tracks = await createAndPublishTracks(serverUid, appId, rtmToken);
        tracksToCleanUp = tracks.filter(t => t !== null);
        localTracksRef.current = tracksToCleanUp;
        videoTrackRef.current = tracks[1];
        setLocalTracks(tracks);

        setIsLoading(false);

      } catch (error) {
        console.error('Failed to join channel', error);
        setError(`Failed to join call: ${error.message}`);
        setIsLoading(false);
        setConnectionState('DISCONNECTED');
      }
    };

    const setupEventHandlers = () => {
      client.on('user-published', handleUserPublished);
      client.on('user-unpublished', handleUserUnpublished);
      client.on('user-joined', handleUserJoined);
      client.on('user-left', handleUserLeft);
      client.enableAudioVolumeIndicator();
      client.on('volume-indicator', handleVolumeIndicator);
    };

    const handleUserPublished = async (user, mediaType) => {
      try {
        await client.subscribe(user, mediaType);

        if (mediaType === 'video') {
          setRemoteUsers(prev => {
            const userExists = prev.some(u => u.uid === user.uid);
            if (!userExists) return [...prev, user];
            return prev.map(u => u.uid === user.uid ? user : u);
          });

          setRemoteUserStates(prev => ({
            ...prev,
            [user.uid]: { ...prev[user.uid], hasVideo: true, hasAudio: prev[user.uid]?.hasAudio || false }
          }));

          showNotification({
            uid: user.uid,
            message: `User ${user.uid} turned on their camera`,
            type: 'cameraOn'
          }, 'cameraState', 2000);
        }

        if (mediaType === 'audio') {
          if (user.audioTrack) user.audioTrack.play();
          setRemoteUserStates(prev => ({
            ...prev,
            [user.uid]: { ...prev[user.uid], hasAudio: true, hasVideo: prev[user.uid]?.hasVideo || false }
          }));
        }
      } catch (err) {
        console.error('Subscribe error:', err);
        setError(`Failed to receive media from User ${user.uid}`);
      }
    };

    const handleUserUnpublished = (user, mediaType) => {
      if (mediaType === 'video') {
        setRemoteUsers(prev => prev.map(u => u.uid === user.uid ? { ...u, videoTrack: null } : u));
        setRemoteUserStates(prev => ({
          ...prev,
          [user.uid]: { ...prev[user.uid], hasVideo: false }
        }));

        showNotification({
          uid: user.uid,
          message: `User ${user.uid} turned off their camera`,
          type: 'cameraOff'
        }, 'cameraState', 2000);
      }

      if (mediaType === 'audio') {
        setRemoteUserStates(prev => ({
          ...prev,
          [user.uid]: { ...prev[user.uid], hasAudio: false }
        }));
      }
    };

    const handleUserJoined = (user) => {
      setRemoteUserStates(prev => ({
        ...prev,
        [user.uid]: { hasVideo: false, hasAudio: false, joined: true }
      }));

      setRemoteUsers(prev => {
        const userExists = prev.some(u => u.uid === user.uid);
        return userExists ? prev : [...prev, user];
      });

      showNotification({
        uid: user.uid,
        message: `User ${user.uid} joined the call`,
        type: 'joined'
      }, 'userLeft', 2000);
    };

    const handleUserLeft = (user, reason) => {
      setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
      setRemoteUserStates(prev => {
        const newState = { ...prev };
        delete newState[user.uid];
        return newState;
      });

      const reasonText = reason === 'Quit' ? 'left the call' : 'was disconnected';
      showNotification({
        uid: user.uid,
        message: `User ${user.uid} ${reasonText}`,
        type: 'left',
        reason: reason
      }, 'userLeft', 2000);
    };

    const handleVolumeIndicator = (volumes) => {
      volumes.forEach(volume => {
        if (volume.level > 0) {
          setAudioLevels(prev => ({
            ...prev,
            remote: { ...prev.remote, [volume.uid]: volume.level }
          }));
        }
      });
    };

    const createAndPublishTracks = async (serverUid, appId, rtmToken) => {
      let tracks = [null, null];

      try {
        // Skip media access for chat-only calls
        if (callType === 'chat') {
          console.log('Chat-only call: skipping media device access');
          setIsVideoOff(true);
          setIsAudioMuted(true);
        }
        // For audio calls, only request microphone
        else if (callType === 'audio') {
          console.log('Audio call: requesting microphone only');
          const audioTrack = await AgoraRTC.createMicrophoneAudioTrack({
            AEC: true, ANS: true, AGC: true
          });
          tracks[0] = audioTrack;
          setIsVideoOff(true);
          setIsAudioMuted(false);
        }
        // For video calls, request both microphone and camera
        else if (callType === 'video') {
          console.log('Video call: requesting microphone and camera');
          try {
            // Create both tracks
            const createdTracks = await AgoraRTC.createMicrophoneAndCameraTracks(
              { AEC: true, ANS: true, AGC: true },
              { encoderConfig: '720p_2', optimizationMode: 'detail' }
            );
            tracks = createdTracks;
            setIsVideoOff(false);
            setIsAudioMuted(false);
            // Ensure audio track is enabled
            if (tracks[0]) {
              await tracks[0].setEnabled(true);
              console.log('Audio track enabled for video call');
            }
          } catch (error) {
            console.error('Error in video track creation:', error);
            throw error;
          }
        }

      } catch (trackError) {
        console.error('Failed to create tracks:', trackError);

        // Handle specific error cases
        if (trackError.message.includes('NotFoundError') || trackError.message.includes('camera')) {
          if (callType === 'video') {
            setError('Camera not available. Continuing with audio only.');
            try {
              const audioTrack = await AgoraRTC.createMicrophoneAudioTrack({ AEC: true, ANS: true, AGC: true });
              tracks[0] = audioTrack;
              tracks[1] = null;
              setIsVideoOff(true);
            } catch (audioError) {
              throw new Error('Failed to access microphone');
            }
          }
        } else if (trackError.message.includes('NotAllowedError') || trackError.message.includes('Permission')) {
          setError('Microphone/camera permission denied. Please allow access to participate in the call.');
          // For chat calls, we can continue without media
          if (callType !== 'chat') {
            throw new Error('Media permission denied');
          }
        } else {
          throw trackError;
        }
      }

      // Apply role-based restrictions and publish tracks
      if (userRole === 'user') {
        // Users always have video disabled regardless of callType
        if (tracks[1]) {
          await tracks[1].setEnabled(false);
          setIsVideoOff(true);
          setIsAudioMuted(false);
        }
        // For users, publish only audio track (not video)
        if (tracks[0]) {
          console.log('Publishing audio only for user');
          await client.publish([tracks[0]]);
          setIsAudioMuted(false);
        }
      } else {
        // Provider logic
        if (callType === 'video' && tracks[1]) {
          // For provider video calls, publish both audio and video
          console.log('Publishing both audio and video for provider');
          await client.publish([tracks[0], tracks[1]]);
          setIsVideoOff(false);
          setIsAudioMuted(false);
        } else {
          // For provider audio/chat calls, publish only audio
          console.log('Publishing audio only for provider');
          if (tracks[0]) {
            await client.publish([tracks[0]]);
             setIsAudioMuted(false);
          }
          if (tracks[1]) {
            await tracks[1].setEnabled(false);
            setIsVideoOff(true);
            setIsAudioMuted(false);
          }
        }
      }

      // Setup RTM for chat functionality
      await setupRTM(serverUid, appId, rtmToken);

      return tracks;
    };

    const setupRTM = async (serverUid, appId, rtmToken) => {
      try {
        rtmClientRef.current = AgoraRTM.createInstance(appId);
        await rtmClientRef.current.login({
          uid: String(serverUid),
          token: rtmToken
        });

        rtmChannelRef.current = await rtmClientRef.current.createChannel(channelName);
        await rtmChannelRef.current.join();

        rtmChannelRef.current.on('ChannelMessage', (message, memberId) => {
          let parsed;
          try {
            parsed = JSON.parse(message.text);
          } catch {
            parsed = { text: message.text };
          }

          // Handle system connection time message
          if (parsed.type === 'SYSTEM_CONNECTION_TIME' && parsed.timestamp) {
            if (!connectionTimeRef.current || parsed.timestamp < connectionTimeRef.current) {
              connectionTimeRef.current = parsed.timestamp;
              timerStartedRef.current = true;
              console.log('🕐 Received synced connection time:', parsed.timestamp);
            }
            return; // Don't show this as a chat message
          }

          const newMsg = {
            id: Date.now() + Math.random(),
            text: parsed.text,
            timestamp: new Date().toLocaleTimeString(),
            sender: memberId === String(serverUid) ? 'You' : `User`,
            isLocal: memberId === String(serverUid)
          };
          chatMessagesRef.current = [...chatMessagesRef.current, newMsg];
          setChatMessages([...chatMessagesRef.current]);
        });
      } catch (rtmError) {
        console.warn('RTM setup failed, chat will not be available:', rtmError);
      }
    };

    joinChannel();

    return () => {
      cleanup(tracksToCleanUp);
    };
  }, [channelName, callType, navigate, setupTokenExpiryWarning, showNotification, userRole]);

  // Cleanup function
  const cleanup = (tracksToCleanUp = []) => {
    if (screenTrackRef.current) {
      try {
        screenTrackRef.current.stop();
        screenTrackRef.current.close();
      } catch (err) {
        console.error('Error stopping screen share:', err);
      }
    }

    for (const track of tracksToCleanUp) {
      try {
        track.stop();
        track.close();
      } catch (err) {
        console.error('Error closing track:', err);
      }
    }

    if (isJoinedRef.current) {
      client.removeAllListeners();
      client.leave().catch(err => console.error('Error leaving channel:', err));
      isJoinedRef.current = false;
    }

    if (rtmClientRef.current) {
      rtmClientRef.current.logout();
    }

    if (tokenExpiryTimerRef.current) clearTimeout(tokenExpiryTimerRef.current);
    if (audioLevelIntervalRef.current) clearInterval(audioLevelIntervalRef.current);
    if (notificationTimeoutRef.current) clearTimeout(notificationTimeoutRef.current);

    setRemoteUsers([]);
    timerStartedRef.current = false;
    connectionTimeRef.current = null;
  };

  return {
    // State
    remoteUsers,
    localTracks,
    isAudioMuted,
    setIsAudioMuted,
    isVideoOff,
    setIsVideoOff,
    chatMessages,
    chatInput,
    setChatInput,
    callDuration,
    isLoading,
    error,
    setError,
    userRole,
    networkQuality,
    audioLevels,
    connectionState,
    remoteUserStates,
    reconnecting,
    localVideoReady,
    setLocalVideoReady,
    userLeftNotification,
    cameraStateNotification,
    tokenExpiryWarning,
    localAudioTrack: localTracks[0],
    localVideoTrack: localTracks[1],

    // Refs
    localVideoRef,
    localVideoMainRef,
    screenTrackRef,
    videoTrackRef,

    // Functions
    sendMessage,
    cleanup,
    showNotification,
    startSyncedTimer,
    icons,
    client
  };
};








// import { useState, useEffect, useRef, useCallback } from 'react';
// import AgoraRTC from 'agora-rtc-sdk-ng';
// import AgoraRTM from 'agora-rtm-sdk';
// import axios from 'axios';
// import {
//   FaMicrophone,
//   FaMicrophoneSlash,
//   FaVideo,
//   FaVideoSlash,
//   FaDesktop,
//   FaPhoneSlash,
//   FaComments,
//   FaCircle,
//   FaUsers,
//   FaClock,
//   FaWifi,
//   FaUser,
//   FaStop,
//   FaPaperPlane,
//   FaTimes,
//   FaExclamationTriangle,
//   FaSignal,
//   FaUserTimes,
//   FaCheckCircle
// } from 'react-icons/fa';

// // Create Agora client
// const client = AgoraRTC.createClient({
//   mode: 'rtc',
//   codec: 'vp8'
// });

// AgoraRTC.setLogLevel(1);

// export const useAgora = (channelName, callType, navigate, userRole) => {
//   // State management
//   const [remoteUsers, setRemoteUsers] = useState([]);
//   const [localTracks, setLocalTracks] = useState([]);
//   const [isAudioMuted, setIsAudioMuted] = useState(false);
//   const [isVideoOff, setIsVideoOff] = useState(callType === 'audio' || callType === 'chat');
//   const [chatMessages, setChatMessages] = useState([]);
//   const [chatInput, setChatInput] = useState('');
//   const [callDuration, setCallDuration] = useState(0);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [networkQuality, setNetworkQuality] = useState({ uplink: 0, downlink: 0 });
//   const [audioLevels, setAudioLevels] = useState({ local: 0, remote: {} });
//   const [connectionState, setConnectionState] = useState('DISCONNECTED');
//   const [remoteUserStates, setRemoteUserStates] = useState({});
//   const [reconnecting, setReconnecting] = useState(false);
//   const [localVideoReady, setLocalVideoReady] = useState(false);
//   const [userLeftNotification, setUserLeftNotification] = useState(null);
//   const [cameraStateNotification, setCameraStateNotification] = useState(null);
//   const [tokenExpiryWarning, setTokenExpiryWarning] = useState(false);

//   // Refs
//   const localVideoRef = useRef(null);
//   const localVideoMainRef = useRef(null);
//   const chatMessagesRef = useRef([]);
//   const callStartTimeRef = useRef(null);
//   const connectionTimeRef = useRef(null); // Synced connection time
//   const timerStartedRef = useRef(false);
//   const chatEndRef = useRef(null);
//   const isJoinedRef = useRef(false);
//   const tokenExpiryTimerRef = useRef(null);
//   const audioLevelIntervalRef = useRef(null);
//   const localTracksRef = useRef([]);
//   const retryCountRef = useRef(0);
//   const screenTrackRef = useRef(null);
//   const videoTrackRef = useRef(null);
//   const notificationTimeoutRef = useRef(null);
//   const rtmClientRef = useRef(null);
//   const rtmChannelRef = useRef(null);

//   // Icons for consistent usage
//   const icons = {
//     FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaDesktop,
//     FaPhoneSlash, FaComments, FaCircle, FaUsers, FaClock, FaWifi, FaUser,
//     FaStop, FaPaperPlane, FaTimes, FaExclamationTriangle, FaSignal,
//     FaUserTimes, FaCheckCircle
//   };

//   // Auto-hide notifications
//   useEffect(() => {
//     if (userLeftNotification || cameraStateNotification || error) {
//       const timer = setTimeout(() => {
//         setUserLeftNotification(null);
//         setCameraStateNotification(null);
//         setError(null);
//       }, 2000);
//       return () => clearTimeout(timer);
//     }
//   }, [userLeftNotification, cameraStateNotification, error]);

//   // Network quality monitoring
//   useEffect(() => {
//     const handleNetworkQuality = (stats) => {
//       setNetworkQuality({
//         uplink: stats.uplinkNetworkQuality,
//         downlink: stats.downlinkNetworkQuality
//       });
//     };

//     client.on('network-quality', handleNetworkQuality);
//     return () => client.off('network-quality', handleNetworkQuality);
//   }, []);

//   // Connection state monitoring
//   useEffect(() => {
//     const handleConnectionStateChange = (curState, prevState, reason) => {
//       setConnectionState(curState);

//       if (curState === 'RECONNECTING') {
//         setReconnecting(true);
//       } else if (curState === 'CONNECTED') {
//         setReconnecting(false);
//         retryCountRef.current = 0;
//       } else if (curState === 'DISCONNECTED') {
//         setReconnecting(false);
//         if (reason !== 'LEAVE') {
//           handleAbnormalDisconnection(reason);
//         }
//       }
//     };

//     client.on('connection-state-change', handleConnectionStateChange);
//     return () => client.off('connection-state-change', handleConnectionStateChange);
//   }, []);

//   // Handle abnormal disconnection
//   const handleAbnormalDisconnection = useCallback((reason) => {
//     console.error('Abnormal disconnection:', reason);
//     if (retryCountRef.current < 3) {
//       retryCountRef.current++;
//       setError(`Connection lost. Reconnecting... (Attempt ${retryCountRef.current}/3)`);
//     } else {
//       setError('Unable to reconnect. Please refresh the page.');
//     }
//   }, []);

//   // Audio level monitoring
//   useEffect(() => {
//     if (localTracks[0]) {
//       audioLevelIntervalRef.current = setInterval(() => {
//         const level = localTracks[0].getVolumeLevel();
//         setAudioLevels(prev => ({ ...prev, local: level }));
//       }, 100);
//     }

//     return () => {
//       if (audioLevelIntervalRef.current) {
//         clearInterval(audioLevelIntervalRef.current);
//       }
//     };
//   }, [localTracks]);

//   // Token expiry warning
//   const setupTokenExpiryWarning = useCallback((expiryTime) => {
//     if (tokenExpiryTimerRef.current) {
//       clearTimeout(tokenExpiryTimerRef.current);
//     }

//     const warningTime = expiryTime - 5 * 60 * 1000;
//     const timeUntilWarning = warningTime - Date.now();

//     if (timeUntilWarning > 0) {
//       tokenExpiryTimerRef.current = setTimeout(() => {
//         setTokenExpiryWarning(true);
//         renewToken();
//       }, timeUntilWarning);
//     }
//   }, []);

//   // Token renewal
//   const renewToken = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${process.env.REACT_APP_API_URL}/agora/call-tokens`, {
//         headers: { Authorization: `Bearer ${token}` },
//         params: { channel: channelName }
//       });

//       const { rtcToken } = response.data;
//       await client.renewToken(rtcToken);
//       setTokenExpiryWarning(false);
//     } catch (error) {
//       console.error('Failed to renew token:', error);
//       setError('Session expiring soon. Please rejoin the call.');
//     }
//   };

//   // Show notification helper
//   const showNotification = useCallback((message, type = 'info', duration = 2000) => {
//     if (notificationTimeoutRef.current) {
//       clearTimeout(notificationTimeoutRef.current);
//     }

//     if (type === 'userLeft') {
//       setUserLeftNotification(message);
//       notificationTimeoutRef.current = setTimeout(() => {
//         setUserLeftNotification(null);
//       }, duration);
//     } else if (type === 'cameraState') {
//       setCameraStateNotification(message);
//       notificationTimeoutRef.current = setTimeout(() => {
//         setCameraStateNotification(null);
//       }, duration);
//     }
//   }, []);

//   // Synchronized timer that starts after 5 second delay
//   const startSyncedTimer = useCallback(() => {
//     if (timerStartedRef.current) return;

//     timerStartedRef.current = true;
//     const connectionTimestamp = Date.now();
//     connectionTimeRef.current = connectionTimestamp;

//     // Send connection time to other user
//     if (rtmChannelRef.current) {
//       try {
//         rtmChannelRef.current.sendMessage({
//           text: JSON.stringify({
//             type: 'SYSTEM_CONNECTION_TIME',
//             timestamp: connectionTimestamp
//           })
//         });
//       } catch (err) {
//         console.warn('Failed to send connection time:', err);
//       }
//     }

//     console.log('🕐 Synced timer started at:', connectionTimestamp);
//   }, []);

//   // Call duration timer with 5 second delay after connection
//   useEffect(() => {
//     callStartTimeRef.current = Date.now();

//     const timer = setInterval(() => {
//       if (connectionTimeRef.current && timerStartedRef.current) {
//         // Calculate time since connection, then subtract 5 seconds
//         const elapsed = Math.floor((Date.now() - connectionTimeRef.current) / 1000);
//         const adjustedDuration = Math.max(0, elapsed - 5); // Subtract 5 sec delay
//         setCallDuration(adjustedDuration);
//       } else {
//         // Before connection, just track waiting time
//         setCallDuration(0);
//       }
//     }, 1000);

//     return () => clearInterval(timer);
//   }, []);

//   // Auto-scroll chat
//   useEffect(() => {
//     chatMessagesRef.current = chatMessages;
//     if (chatEndRef.current) {
//       chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
//     }
//   }, [chatMessages]);

//   // Send chat message
//   const sendMessage = useCallback(async (messageTextOrEvent) => {
//     // Handle if called from event handler (button click)
//     let messageText = messageTextOrEvent;

//     // If it's an event object, ignore it and use chatInput
//     if (messageTextOrEvent && typeof messageTextOrEvent === 'object' && messageTextOrEvent.preventDefault) {
//       messageText = chatInput.trim();
//     } else if (typeof messageTextOrEvent === 'string') {
//       messageText = messageTextOrEvent;
//     } else {
//       messageText = chatInput.trim();
//     }

//     // Allow sending system messages directly
//     if (typeof messageText === 'string' && messageText.startsWith('SYSTEM:')) {
//       if (rtmChannelRef.current) {
//         try {
//           await rtmChannelRef.current.sendMessage({
//             text: JSON.stringify({ text: messageText })
//           });
//         } catch (err) {
//           console.warn('[RTM] Failed to send system message', err);
//         }
//       }
//       return;
//     }

//     // Regular user message
//     if (messageText && rtmChannelRef.current) {
//       const textToSend = messageText;
//       setChatInput('');

//       try {
//         await rtmChannelRef.current.sendMessage({
//           text: JSON.stringify({ text: textToSend })
//         });
//         const newMsg = {
//           id: Date.now(),
//           text: textToSend,
//           timestamp: new Date().toLocaleTimeString(),
//           sender: 'You',
//           isLocal: true
//         };
//         setChatMessages(prev => [...prev, newMsg]);
//       } catch (err) {
//         console.warn('[RTM] Failed to send message', err);
//         const newMsg = {
//           id: Date.now(),
//           text: textToSend,
//           timestamp: new Date().toLocaleTimeString(),
//           sender: 'You (not sent)',
//           isLocal: true
//         };
//         setChatMessages(prev => [...prev, newMsg]);
//       }
//     }
//   }, [chatInput]);

//   // Main effect - Join channel
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       navigate('/login/user');
//       return;
//     }

//     let tracksToCleanUp = [];

//     const joinChannel = async () => {
//       try {
//         setIsLoading(true);
//         setError(null);
//         setConnectionState('CONNECTING');

//         // Setup event handlers
//         setupEventHandlers();

//         // Get tokens
//         const response = await axios.get(`${process.env.REACT_APP_API_URL}/agora/call-tokens`, {
//           headers: { Authorization: `Bearer ${token}` },
//           params: { channel: channelName }
//         });

//         const { rtcToken, rtmToken, uid: serverUid, appId } = response.data;
//         if (response.data.tokenExpiry) {
//           setupTokenExpiryWarning(response.data.tokenExpiry);
//         }

//         // Join RTC
//         await client.join(appId, channelName, rtcToken, serverUid);
//         isJoinedRef.current = true;
//         setConnectionState('CONNECTED');

//         // Create and publish tracks based on callType
//         const tracks = await createAndPublishTracks(serverUid, appId, rtmToken);
//         tracksToCleanUp = tracks.filter(t => t !== null);
//         localTracksRef.current = tracksToCleanUp;
//         videoTrackRef.current = tracks[1];
//         setLocalTracks(tracks);

//         setIsLoading(false);

//       } catch (error) {
//         console.error('Failed to join channel', error);
//         setError(`Failed to join call: ${error.message}`);
//         setIsLoading(false);
//         setConnectionState('DISCONNECTED');
//       }
//     };

//     const setupEventHandlers = () => {
//       client.on('user-published', handleUserPublished);
//       client.on('user-unpublished', handleUserUnpublished);
//       client.on('user-joined', handleUserJoined);
//       client.on('user-left', handleUserLeft);
//       client.enableAudioVolumeIndicator();
//       client.on('volume-indicator', handleVolumeIndicator);
//     };

//     const handleUserPublished = async (user, mediaType) => {
//       try {
//         await client.subscribe(user, mediaType);

//         if (mediaType === 'video') {
//           setRemoteUsers(prev => {
//             const userExists = prev.some(u => u.uid === user.uid);
//             if (!userExists) return [...prev, user];
//             return prev.map(u => u.uid === user.uid ? user : u);
//           });

//           setRemoteUserStates(prev => ({
//             ...prev,
//             [user.uid]: { ...prev[user.uid], hasVideo: true, hasAudio: prev[user.uid]?.hasAudio || false }
//           }));

//           showNotification({
//             uid: user.uid,
//             message: `User ${user.uid} turned on their camera`,
//             type: 'cameraOn'
//           }, 'cameraState', 2000);
//         }

//         if (mediaType === 'audio') {
//           if (user.audioTrack) user.audioTrack.play();
//           setRemoteUserStates(prev => ({
//             ...prev,
//             [user.uid]: { ...prev[user.uid], hasAudio: true, hasVideo: prev[user.uid]?.hasVideo || false }
//           }));
//         }
//       } catch (err) {
//         console.error('Subscribe error:', err);
//         setError(`Failed to receive media from User ${user.uid}`);
//       }
//     };

//     const handleUserUnpublished = (user, mediaType) => {
//       if (mediaType === 'video') {
//         setRemoteUsers(prev => prev.map(u => u.uid === user.uid ? { ...u, videoTrack: null } : u));
//         setRemoteUserStates(prev => ({
//           ...prev,
//           [user.uid]: { ...prev[user.uid], hasVideo: false }
//         }));

//         showNotification({
//           uid: user.uid,
//           message: `User ${user.uid} turned off their camera`,
//           type: 'cameraOff'
//         }, 'cameraState', 2000);
//       }

//       if (mediaType === 'audio') {
//         setRemoteUserStates(prev => ({
//           ...prev,
//           [user.uid]: { ...prev[user.uid], hasAudio: false }
//         }));
//       }
//     };

//     const handleUserJoined = (user) => {
//       setRemoteUserStates(prev => ({
//         ...prev,
//         [user.uid]: { hasVideo: false, hasAudio: false, joined: true }
//       }));

//       setRemoteUsers(prev => {
//         const userExists = prev.some(u => u.uid === user.uid);
//         return userExists ? prev : [...prev, user];
//       });

//       showNotification({
//         uid: user.uid,
//         message: `User ${user.uid} joined the call`,
//         type: 'joined'
//       }, 'userLeft', 2000);
//     };

//     const handleUserLeft = (user, reason) => {
//       setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
//       setRemoteUserStates(prev => {
//         const newState = { ...prev };
//         delete newState[user.uid];
//         return newState;
//       });

//       const reasonText = reason === 'Quit' ? 'left the call' : 'was disconnected';
//       showNotification({
//         uid: user.uid,
//         message: `User ${user.uid} ${reasonText}`,
//         type: 'left',
//         reason: reason
//       }, 'userLeft', 2000);
//     };

//     const handleVolumeIndicator = (volumes) => {
//       volumes.forEach(volume => {
//         if (volume.level > 0) {
//           setAudioLevels(prev => ({
//             ...prev,
//             remote: { ...prev.remote, [volume.uid]: volume.level }
//           }));
//         }
//       });
//     };

//     const createAndPublishTracks = async (serverUid, appId, rtmToken) => {
//       let tracks = [null, null];

//       try {
//         // Skip media access for chat-only calls
//         if (callType === 'chat') {
//           console.log('Chat-only call: skipping media device access');
//           setIsVideoOff(true);
//           setIsAudioMuted(true);
//         }
//         // For audio calls, only request microphone
//         else if (callType === 'audio') {
//           console.log('Audio call: requesting microphone only');
//           const audioTrack = await AgoraRTC.createMicrophoneAudioTrack({
//             AEC: true, ANS: true, AGC: true
//           });
//           tracks[0] = audioTrack;
//           setIsVideoOff(true);
//           setIsAudioMuted(false);
//         }
//         // For video calls, request both microphone and camera
//         else if (callType === 'video') {
//           console.log('Video call: requesting microphone and camera');
//           try {
//             // Create both tracks
//             const createdTracks = await AgoraRTC.createMicrophoneAndCameraTracks(
//               { AEC: true, ANS: true, AGC: true },
//               { encoderConfig: '720p_2', optimizationMode: 'detail' }
//             );
//             tracks = createdTracks;
//             setIsVideoOff(false);
//             setIsAudioMuted(false);
//             // Ensure audio track is enabled
//             if (tracks[0]) {
//               await tracks[0].setEnabled(true);
//               console.log('Audio track enabled for video call');
//             }
//           } catch (error) {
//             console.error('Error in video track creation:', error);
//             throw error;
//           }
//         }

//       } catch (trackError) {
//         console.error('Failed to create tracks:', trackError);

//         // Handle specific error cases
//         if (trackError.message.includes('NotFoundError') || trackError.message.includes('camera')) {
//           if (callType === 'video') {
//             setError('Camera not available. Continuing with audio only.');
//             try {
//               const audioTrack = await AgoraRTC.createMicrophoneAudioTrack({ AEC: true, ANS: true, AGC: true });
//               tracks[0] = audioTrack;
//               tracks[1] = null;
//               setIsVideoOff(true);
//             } catch (audioError) {
//               throw new Error('Failed to access microphone');
//             }
//           }
//         } else if (trackError.message.includes('NotAllowedError') || trackError.message.includes('Permission')) {
//           setError('Microphone/camera permission denied. Please allow access to participate in the call.');
//           // For chat calls, we can continue without media
//           if (callType !== 'chat') {
//             throw new Error('Media permission denied');
//           }
//         } else {
//           throw trackError;
//         }
//       }

//       // Apply role-based restrictions and publish tracks
//       if (userRole === 'user') {
//         // Users always have video disabled regardless of callType
//         if (tracks[1]) {
//           await tracks[1].setEnabled(false);
//           setIsVideoOff(true);
//           setIsAudioMuted(false);
//         }
//         // For users, publish only audio track (not video)
//         if (tracks[0]) {
//           console.log('Publishing audio only for user');
//           await client.publish([tracks[0]]);
//           setIsAudioMuted(false);
//         }
//       } else {
//         // Provider logic
//         if (callType === 'video' && tracks[1]) {
//           // For provider video calls, publish both audio and video
//           console.log('Publishing both audio and video for provider');
//           await client.publish([tracks[0], tracks[1]]);
//           setIsVideoOff(false);
//           setIsAudioMuted(false);
//         } else {
//           // For provider audio/chat calls, publish only audio
//           console.log('Publishing audio only for provider');
//           if (tracks[0]) {
//             await client.publish([tracks[0]]);
//              setIsAudioMuted(false);
//           }
//           if (tracks[1]) {
//             await tracks[1].setEnabled(false);
//             setIsVideoOff(true);
//             setIsAudioMuted(false);
//           }
//         }
//       }

//       // Setup RTM for chat functionality
//       await setupRTM(serverUid, appId, rtmToken);

//       return tracks;
//     };

//     const setupRTM = async (serverUid, appId, rtmToken) => {
//       try {
//         rtmClientRef.current = AgoraRTM.createInstance(appId);
//         await rtmClientRef.current.login({
//           uid: String(serverUid),
//           token: rtmToken
//         });

//         rtmChannelRef.current = await rtmClientRef.current.createChannel(channelName);
//         await rtmChannelRef.current.join();

//         rtmChannelRef.current.on('ChannelMessage', (message, memberId) => {
//           let parsed;
//           try {
//             parsed = JSON.parse(message.text);
//           } catch {
//             parsed = { text: message.text };
//           }

//           // Handle system connection time message
//           if (parsed.type === 'SYSTEM_CONNECTION_TIME' && parsed.timestamp) {
//             if (!connectionTimeRef.current || parsed.timestamp < connectionTimeRef.current) {
//               connectionTimeRef.current = parsed.timestamp;
//               timerStartedRef.current = true;
//               console.log('🕐 Received synced connection time:', parsed.timestamp);
//             }
//             return; // Don't show this as a chat message
//           }

//           const newMsg = {
//             id: Date.now() + Math.random(),
//             text: parsed.text,
//             timestamp: new Date().toLocaleTimeString(),
//             sender: memberId === String(serverUid) ? 'You' : `User`,
//             isLocal: memberId === String(serverUid)
//           };
//           chatMessagesRef.current = [...chatMessagesRef.current, newMsg];
//           setChatMessages([...chatMessagesRef.current]);
//         });
//       } catch (rtmError) {
//         console.warn('RTM setup failed, chat will not be available:', rtmError);
//       }
//     };

//     joinChannel();

//     return () => {
//       cleanup(tracksToCleanUp);
//     };
//   }, [channelName, callType, navigate, setupTokenExpiryWarning, showNotification, userRole]);

//   // Cleanup function
//   const cleanup = (tracksToCleanUp = []) => {
//     if (screenTrackRef.current) {
//       try {
//         screenTrackRef.current.stop();
//         screenTrackRef.current.close();
//       } catch (err) {
//         console.error('Error stopping screen share:', err);
//       }
//     }

//     for (const track of tracksToCleanUp) {
//       try {
//         track.stop();
//         track.close();
//       } catch (err) {
//         console.error('Error closing track:', err);
//       }
//     }

//     if (isJoinedRef.current) {
//       client.removeAllListeners();
//       client.leave().catch(err => console.error('Error leaving channel:', err));
//       isJoinedRef.current = false;
//     }

//     if (rtmClientRef.current) {
//       rtmClientRef.current.logout();
//     }

//     if (tokenExpiryTimerRef.current) clearTimeout(tokenExpiryTimerRef.current);
//     if (audioLevelIntervalRef.current) clearInterval(audioLevelIntervalRef.current);
//     if (notificationTimeoutRef.current) clearTimeout(notificationTimeoutRef.current);

//     setRemoteUsers([]);
//     timerStartedRef.current = false;
//     connectionTimeRef.current = null;
//   };

//   return {
//     // State
//     remoteUsers,
//     localTracks,
//     isAudioMuted,
//     setIsAudioMuted,
//     isVideoOff,
//     setIsVideoOff,
//     chatMessages,
//     chatInput,
//     setChatInput,
//     callDuration,
//     isLoading,
//     error,
//     setError,
//     userRole,
//     networkQuality,
//     audioLevels,
//     connectionState,
//     remoteUserStates,
//     reconnecting,
//     localVideoReady,
//     setLocalVideoReady,
//     userLeftNotification,
//     cameraStateNotification,
//     tokenExpiryWarning,
//     localAudioTrack: localTracks[0],
//     localVideoTrack: localTracks[1],

//     // Refs
//     localVideoRef,
//     localVideoMainRef,
//     screenTrackRef,
//     videoTrackRef,

//     // Functions
//     sendMessage,
//     cleanup,
//     showNotification,
//     startSyncedTimer,
//     icons,
//     client
//   };
// };


