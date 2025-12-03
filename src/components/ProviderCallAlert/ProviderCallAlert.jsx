// // components/ProviderCallAlert/ProviderCallAlert.jsx
// import { useState, useEffect, useRef, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useSocket } from '../../context/Socketcontext';
// import axios from 'axios';
// import Loader from '../Loading';
// import CallNotificationUI from './CallNotificationUI';
// import { useCallNotification } from './hooks/useCallNotification';
// import { useSimpleAudio } from './hooks/useSimpleAudio';
// import { useProviderById } from "../../hooks/useProviderById";
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002/api';


// const ProviderCallAlert = ({ providerId }) => {
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [isAccepting, setIsAccepting] = useState(false);
//   const [dragState, setDragState] = useState({ y: 0, isDragging: false });
//  const { provider} = useProviderById(providerId);
//   const navigate = useNavigate();
//   const { socket } = useSocket();
  
//   const mountedRef = useRef(true);
//   const dragStartY = useRef(0);
//   const processingRef = useRef(false);
  
//   // Custom hooks
//   const { currentCall, showCall, hideCall } = useCallNotification();
//   const { play: playRingtone, stop: stopRingtone } = useSimpleAudio();
//   // Get auth token
//   const getAuthToken = useCallback(() => {
//     const token = localStorage.getItem('token');
//     if (!token) throw new Error('Authentication required. Please log in again.');
//     return token;
//   }, []);

//   // ✅ Handle Accept Call
//   const handleAcceptCall = useCallback(async () => {
//     if (!currentCall || processingRef.current) {
//       console.warn('⚠️ Cannot accept - no call or already processing');
//       return;
//     }

//     processingRef.current = true;
//     setIsProcessing(true);
//     setIsAccepting(true);
//     stopRingtone();

//     try {
//       console.log('✅ Accepting call:', currentCall.callId);

//       const token = getAuthToken();
//       const config = {
//         headers: { Authorization: `Bearer ${token}` },
//         timeout: 10000,
//       };

//       // Notify backend about acceptance
//       const response = await axios.post(
//         `${API_BASE_URL}/notifications/accept-call/${currentCall.callId}`,
//         {},
//         config
//       );

//       if (!response.data.success) {
//         throw new Error(response.data.error || 'Failed to accept call');
//       }

//       console.log('✅ Call accepted on backend:', currentCall.callId);
//       hideCall();

//       // Navigate based on call type
//       if (currentCall.mode === 'chat') {
//         // Chat mode - no Agora tokens needed
//         navigate(`/call/${currentCall.channelName}/${currentCall.mode}`, {
//           state: {
//             callData: {
//               channelName: currentCall.channelName,
//               participantName: currentCall.callerName,
//               userRole: 'provider',
//               callId: currentCall.callId,
//               providerData: provider?.personalInfo,
//             },
//           },
//           replace: true,
//         });
//       } else {
//         // Audio/Video calls - fetch Agora tokens
//         console.log('🎫 Fetching Agora tokens for:', currentCall.channelName);

//         const tokenResponse = await axios.get(
//           `${API_BASE_URL}/agora/call-tokens`,
//           {
//             ...config,
//             params: { channel: currentCall.channelName },
//           }
//         );

//         const { rtcToken, uid, appId } = tokenResponse.data;

//         if (!rtcToken || !uid || !appId) {
//           throw new Error('Invalid token data received from server');
//         }

//         console.log('✅ Agora tokens received successfully');

//         navigate(`/call/${currentCall.channelName}/${currentCall.mode}`, {
//           state: {
//             callData: {
//               channelName: currentCall.channelName,
//               token: rtcToken,
//               uid,
//               appId,
//               userRole: 'provider',
//               callId: currentCall.callId,
//             },
//             participantName: currentCall.callerName,
//           },
//           replace: true,
//         });
//       }
//     } catch (error) {
//       console.error('❌ Accept call error:', error);

//       // Reset states
//       hideCall();
//       setIsAccepting(false);
//       setIsProcessing(false);
//       processingRef.current = false;

//       // Show error to user
//       let errorMessage = 'An unexpected error occurred';

//       if (error.response) {
//         errorMessage = error.response.data?.message || 
//                       error.response.data?.error ||
//                       error.response.statusText || 
//                       'Server error occurred';
//       } else if (error.request) {
//         errorMessage = 'No response from server. Please check your connection.';
//       } else if (error.message) {
//         errorMessage = error.message;
//       }

//       alert(`Failed to join ${currentCall.mode === 'chat' ? 'chat' : 'call'}: ${errorMessage}`);
//     }
//   }, [currentCall, hideCall, stopRingtone, navigate, getAuthToken]);

//   // ✅ Handle Decline Call
//   const handleDeclineCall = useCallback(async () => {
//     if (!currentCall || processingRef.current) {
//       console.warn('⚠️ Cannot decline - no call or already processing');
//       return;
//     }

//     processingRef.current = true;
//     setIsProcessing(true);
//     stopRingtone();

//     try {
//       console.log('❌ Declining call:', currentCall.callId);

//       const token = getAuthToken();

//       await axios.post(
//         `${API_BASE_URL}/notifications/decline-call/${currentCall.callId}`,
//         {},
//         {
//           headers: { Authorization: `Bearer ${token}` },
//           timeout: 10000,
//         }
//       );

//       console.log('✅ Call declined successfully:', currentCall.callId);
//     } catch (error) {
//       console.error('❌ Decline API error:', error);
//       // Don't block UI - declining should always work locally
//     } finally {
//       hideCall();
//       setIsProcessing(false);
//       processingRef.current = false;
//     }
//   }, [currentCall, hideCall, stopRingtone, getAuthToken]);

//   // ✅ Socket Event Handlers
//   useEffect(() => {
//     if (!socket || !providerId || !mountedRef.current) {
//       console.warn('⚠️ Socket or providerId not available');
//       return;
//     }

//     console.log('🔌 Registering provider:', providerId);
//     socket.emit('register-provider', providerId);

//     // Incoming call event
//     const handleIncomingCall = (callData) => {
//       if (!mountedRef.current) {
//         console.warn('⚠️ Component unmounted, ignoring incoming call');
//         return;
//       }

//       console.log('📞 Incoming call received:', callData);
      
//       const shown = showCall(callData);
//       if (shown) {
//         playRingtone();
//       } else {
//         console.warn('⚠️ Could not show call (provider may be busy)');
//       }
//     };

//     // Call expired (provider didn't answer in time)
//     const handleCallExpired = ({ callId }) => {
//       if (!mountedRef.current) return;

//       if (currentCall?.callId === callId) {
//         console.log('⏰ Call expired:', callId);
//         stopRingtone();
//         hideCall();
//       }
//     };

//     // Call cancelled (user hung up before answer)
//     const handleCallCancelled = ({ callId }) => {
//       if (!mountedRef.current) return;

//       if (currentCall?.callId === callId) {
//         console.log('📴 Call cancelled by user:', callId);
//         stopRingtone();
//         hideCall();
//       }
//     };

//     // Register listeners
//     socket.on('incoming-call', handleIncomingCall);
//     socket.on('call-expired', handleCallExpired);
//     socket.on('call-cancelled', handleCallCancelled);

//     console.log('✅ Socket event listeners registered');

//     // Cleanup
//     return () => {
//       console.log('🧹 Cleaning up socket listeners');
//       socket.off('incoming-call', handleIncomingCall);
//       socket.off('call-expired', handleCallExpired);
//       socket.off('call-cancelled', handleCallCancelled);
//     };
//   }, [socket, providerId, showCall, hideCall, playRingtone, stopRingtone, currentCall]);

//   // ✅ Component lifecycle
//   useEffect(() => {
//     mountedRef.current = true;

//     return () => {
//       console.log('❌ ProviderCallAlert unmounting - cleaning up');
//       mountedRef.current = false;
//       stopRingtone();
//       hideCall();
//     };
//   }, [stopRingtone, hideCall]);

//   // ✅ Request notification permission once
//   useEffect(() => {
//     if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
//       Notification.requestPermission().then((permission) => {
//         console.log('🔔 Notification permission:', permission);
//       });
//     }
//   }, []);

//   // 👉 Drag Handlers (swipe down to decline on mobile)
//   const handleDragStart = useCallback((e) => {
//     if (e.touches?.length > 0) {
//       dragStartY.current = e.touches[0].clientY;
//       setDragState({ y: 0, isDragging: true });
//     }
//   }, []);

//   const handleDragMove = useCallback((e) => {
//     if (!dragState.isDragging || !e.touches?.length) return;

//     const deltaY = e.touches[0].clientY - dragStartY.current;
//     if (deltaY > 0) {
//       setDragState({ y: deltaY, isDragging: true });
//     }
//   }, [dragState.isDragging]);

//   const handleDragEnd = useCallback(() => {
//     if (dragState.y > 150 && !isProcessing) {
//       // User swiped down far enough - decline call
//       handleDeclineCall();
//     }
//     setDragState({ y: 0, isDragging: false });
//   }, [dragState.y, isProcessing, handleDeclineCall]);

//   // Show loader when accepting (transitioning to call screen)
//   if (isAccepting) {
//     return <Loader />;
//   }

//   // No call - hide UI completely
//   if (!currentCall) {
//     return null;
//   }

//   // Show call notification UI
//   return (
//     <CallNotificationUI
//       activeCall={currentCall}
//       dragState={dragState}
//       isProcessing={isProcessing}
//       onAccept={handleAcceptCall}
//       onDecline={handleDeclineCall}
//       onDragStart={handleDragStart}
//       onDragMove={handleDragMove}
//       onDragEnd={handleDragEnd}
//     />
//   );
// };

// export default ProviderCallAlert;





// components/ProviderCallAlert/ProviderCallAlert.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../../context/Socketcontext';
import axios from 'axios';
import Loader from '../Loading';
import CallNotificationUI from './CallNotificationUI';
import { useCallNotification } from './hooks/useCallNotification';
import { useSimpleAudio } from './hooks/useSimpleAudio';
import { useProviderById } from "../../hooks/useProviderById";

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002/api';

const ProviderCallAlert = ({ providerId }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [dragState, setDragState] = useState({ y: 0, isDragging: false });
  const { provider } = useProviderById(providerId);
  const navigate = useNavigate();
  const { socket } = useSocket();
  
  const mountedRef = useRef(true);
  const dragStartY = useRef(0);
  const processingRef = useRef(false);

  // Custom hooks
  const { currentCall, showCall, hideCall } = useCallNotification();
  const { play: playRingtone, stop: stopRingtone } = useSimpleAudio();

  // Get auth token
  const getAuthToken = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication required. Please log in again.');
    return token;
  }, []);

  // ✅ UTILITY: Stop all call alerts (ringtone, vibration, notification)
  const stopAllAlerts = useCallback(() => {
    console.log('🛑 Stopping all alerts (ringtone, vibration, notification)');
    
    // Stop ringtone
    stopRingtone();
    
    // Stop vibration
    if (window.callVibrateInterval) {
      clearInterval(window.callVibrateInterval);
      window.callVibrateInterval = null;
    }
    if ('vibrate' in navigator) {
      navigator.vibrate(0);
    }
    
    // Close notification
    if (window.callNotification) {
      window.callNotification.close();
      window.callNotification = null;
    }
  }, [stopRingtone]);

  // ✅ Handle Accept Call
  const handleAcceptCall = useCallback(async () => {
    if (!currentCall || processingRef.current) {
      console.warn('⚠️ Cannot accept - no call or already processing');
      return;
    }

    // ✅ STOP EVERYTHING IMMEDIATELY
    console.log('🛑 Call accepted - stopping all alerts');
    stopAllAlerts();

    processingRef.current = true;
    setIsProcessing(true);
    setIsAccepting(true);

    try {
      console.log('✅ Accepting call:', currentCall.callId);

      const token = getAuthToken();
      const config = {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000,
      };

      // Notify backend about acceptance
      const response = await axios.post(
        `${API_BASE_URL}/notifications/accept-call/${currentCall.callId}`,
        {},
        config
      );

      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to accept call');
      }

      console.log('✅ Call accepted on backend:', currentCall.callId);
      hideCall();

      // Navigate based on call type
      if (currentCall.mode === 'chat') {
        // Chat mode - no Agora tokens needed
        navigate(`/call/${currentCall.channelName}/${currentCall.mode}`, {
          state: {
            callData: {
              channelName: currentCall.channelName,
              participantName: currentCall.callerName,
              userRole: 'provider',
              callId: currentCall.callId,
              providerData: provider?.personalInfo,
            },
          },
          replace: true,
        });
      } else {
        // Audio/Video calls - fetch Agora tokens
        console.log('🎫 Fetching Agora tokens for:', currentCall.channelName);

        const tokenResponse = await axios.get(
          `${API_BASE_URL}/agora/call-tokens`,
          {
            ...config,
            params: { channel: currentCall.channelName },
          }
        );

        const { rtcToken, uid, appId } = tokenResponse.data;

        if (!rtcToken || !uid || !appId) {
          throw new Error('Invalid token data received from server');
        }

        console.log('✅ Agora tokens received successfully');

        navigate(`/call/${currentCall.channelName}/${currentCall.mode}`, {
          state: {
            callData: {
              channelName: currentCall.channelName,
              token: rtcToken,
              uid,
              appId,
              userRole: 'provider',
              callId: currentCall.callId,
            },
            participantName: currentCall.callerName,
          },
          replace: true,
        });
      }
    } catch (error) {
      console.error('❌ Accept call error:', error);

      // Reset states
      hideCall();
      setIsAccepting(false);
      setIsProcessing(false);
      processingRef.current = false;

      // Show error to user
      let errorMessage = 'An unexpected error occurred';

      if (error.response) {
        errorMessage = error.response.data?.message || 
                      error.response.data?.error ||
                      error.response.statusText || 
                      'Server error occurred';
      } else if (error.request) {
        errorMessage = 'No response from server. Please check your connection.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert(`Failed to join ${currentCall.mode === 'chat' ? 'chat' : 'call'}: ${errorMessage}`);
    }
  }, [currentCall, hideCall, stopAllAlerts, navigate, getAuthToken, provider]);

  // ✅ Handle Decline Call
  const handleDeclineCall = useCallback(async () => {
    if (!currentCall || processingRef.current) {
      console.warn('⚠️ Cannot decline - no call or already processing');
      return;
    }

    // ✅ STOP EVERYTHING IMMEDIATELY
    console.log('🛑 Call declined - stopping all alerts');
    stopAllAlerts();

    processingRef.current = true;
    setIsProcessing(true);

    try {
      console.log('❌ Declining call:', currentCall.callId);

      const token = getAuthToken();

      await axios.post(
        `${API_BASE_URL}/notifications/decline-call/${currentCall.callId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000,
        }
      );

      console.log('✅ Call declined successfully:', currentCall.callId);
    } catch (error) {
      console.error('❌ Decline API error:', error);
      // Don't block UI - declining should always work locally
    } finally {
      hideCall();
      setIsProcessing(false);
      processingRef.current = false;
    }
  }, [currentCall, hideCall, stopAllAlerts, getAuthToken]);

  // ✅ Socket Event Handlers
  useEffect(() => {
    if (!socket || !providerId || !mountedRef.current) {
      console.warn('⚠️ Socket or providerId not available');
      return;
    }

    console.log('🔌 Registering provider:', providerId);
    socket.emit('register-provider', providerId);

    // Incoming call event
    const handleIncomingCall = (callData) => {
      if (!mountedRef.current) {
        console.warn('⚠️ Component unmounted, ignoring incoming call');
        return;
      }

      console.log('📞 Incoming call received:', callData);
      
      const shown = showCall(callData);
      if (shown) {
        // Try to play ringtone
        const played = playRingtone();
        console.log('🔊 Ringtone play result:', played);
        
        // Vibration with device detection
        if ('vibrate' in navigator) {
          const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
          let vibratePattern;
          
          if (isIOS) {
            console.log('📱 iOS detected - using simple vibration');
            vibratePattern = 400; // iOS: single duration
          } else {
            console.log('📳 Android/Other - using pattern vibration');
            vibratePattern = [500, 300, 500, 300, 500]; // Android: pattern
          }
          
          // Start vibration
          try {
            const vibrateResult = navigator.vibrate(vibratePattern);
            console.log('📳 Vibration started:', vibrateResult);
            
            // Repeat vibration (adjusted for device)
            window.callVibrateInterval = setInterval(() => {
              if ('vibrate' in navigator) {
                navigator.vibrate(vibratePattern);
              }
            }, isIOS ? 2000 : 1500); // iOS: slower repeat
            
          } catch (vibrateError) {
            console.error('❌ Vibration error:', vibrateError);
          }
        } else {
          console.warn('⚠️ Vibration API not supported');
        }
        
        // Browser notification
        if (Notification.permission === 'granted') {
          try {
            window.callNotification = new Notification('Incoming Call 📞', {
              body: `${callData.callerName} is calling (${callData.mode})...`,
              icon: '/logo192.png',
              tag: 'incoming-call',
              requireInteraction: true,
              vibrate: [500, 300, 500, 300, 500],
              silent: false
            });
            
            window.callNotification.onclick = () => {
              window.callNotification.close();
            };
          } catch (err) {
            console.error('❌ Notification error:', err);
          }
        }
      } else {
        console.warn('⚠️ Could not show call (provider may be busy)');
      }
    };

    // Call expired (provider didn't answer in time)
    const handleCallExpired = ({ callId }) => {
      if (!mountedRef.current) return;

      if (currentCall?.callId === callId) {
        console.log('⏰ Call expired:', callId);
        stopAllAlerts();
        hideCall();
      }
    };

    // Call cancelled (user hung up before answer)
    const handleCallCancelled = ({ callId }) => {
      if (!mountedRef.current) return;

      if (currentCall?.callId === callId) {
        console.log('📴 Call cancelled by user:', callId);
        stopAllAlerts();
        hideCall();
      }
    };

    // Register listeners
    socket.on('incoming-call', handleIncomingCall);
    socket.on('call-expired', handleCallExpired);
    socket.on('call-cancelled', handleCallCancelled);

    console.log('✅ Socket event listeners registered');

    // Cleanup
    return () => {
      console.log('🧹 Cleaning up socket listeners');
      socket.off('incoming-call', handleIncomingCall);
      socket.off('call-expired', handleCallExpired);
      socket.off('call-cancelled', handleCallCancelled);
    };
  }, [socket, providerId, showCall, hideCall, playRingtone, stopAllAlerts, currentCall]);

  // ✅ Component lifecycle
  useEffect(() => {
    mountedRef.current = true;

    return () => {
      console.log('❌ ProviderCallAlert unmounting - cleaning up');
      mountedRef.current = false;
      stopAllAlerts();
      hideCall();
    };
  }, [stopAllAlerts, hideCall]);

  // ✅ Request notification permission once
  useEffect(() => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      Notification.requestPermission().then((permission) => {
        console.log('🔔 Notification permission:', permission);
      });
    }
  }, []);

  // ✅ Test vibration on mount
  useEffect(() => {
    const testVibration = () => {
      if ('vibrate' in navigator) {
        console.log('🧪 Testing vibration...');
        navigator.vibrate(200); // Quick test buzz
        setTimeout(() => {
          console.log('✅ Vibration test complete');
        }, 300);
      } else {
        console.warn('⚠️ Vibration not supported on this device');
      }
    };

    // Listen for first user interaction to test
    const handleFirstInteraction = () => {
      testVibration();
    };

    document.addEventListener('touchstart', handleFirstInteraction, { once: true, passive: true });
    document.addEventListener('click', handleFirstInteraction, { once: true });

    return () => {
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('click', handleFirstInteraction);
    };
  }, []);

  // 👉 Drag Handlers (swipe down to decline on mobile)
  const handleDragStart = useCallback((e) => {
    if (e.touches?.length > 0) {
      dragStartY.current = e.touches[0].clientY;
      setDragState({ y: 0, isDragging: true });
    }
  }, []);

  const handleDragMove = useCallback((e) => {
    if (!dragState.isDragging || !e.touches?.length) return;

    const deltaY = e.touches[0].clientY - dragStartY.current;
    if (deltaY > 0) {
      setDragState({ y: deltaY, isDragging: true });
    }
  }, [dragState.isDragging]);

  const handleDragEnd = useCallback(() => {
    if (dragState.y > 150 && !isProcessing) {
      // User swiped down far enough - decline call
      handleDeclineCall();
    }
    setDragState({ y: 0, isDragging: false });
  }, [dragState.y, isProcessing, handleDeclineCall]);

  // Show loader when accepting (transitioning to call screen)
  if (isAccepting) {
    return <Loader />;
  }

  // No call - hide UI completely
  if (!currentCall) {
    return null;
  }

  // Show call notification UI
  return (
    <CallNotificationUI
      activeCall={currentCall}
      dragState={dragState}
      isProcessing={isProcessing}
      onAccept={handleAcceptCall}
      onDecline={handleDeclineCall}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
    />
  );
};

export default ProviderCallAlert;
