// hooks/useCallNotification.js
import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Custom hook to manage a SINGLE incoming call notification
 * No queue - works exactly like a real phone (one call at a time)
 */
export const useCallNotification = () => {
  const [currentCall, setCurrentCall] = useState(null);
  const callTimeoutRef = useRef(null);
  const notificationRef = useRef(null);

  // Validate call data
  const isValidCall = useCallback((callData) => {
    if (!callData) {
      console.error('❌ Call data is null or undefined');
      return false;
    }

    if (!callData.callId) {
      console.error('❌ Missing callId in call data:', callData);
      return false;
    }

    if (!callData.channelName) {
      console.error('❌ Missing channelName in call data:', callData);
      return false;
    }

    if (!callData.callerName) {
      console.error('❌ Missing callerName in call data:', callData);
      return false;
    }

    return true;
  }, []);

  // Show call notification
  const showCall = useCallback((callData) => {
    if (!isValidCall(callData)) {
      return false;
    }

    // ✅ FIX: Check using ref to get real-time state
    setCurrentCall((prevCall) => {
      // If already showing a call, ignore new ones (provider is busy)
      if (prevCall) {
        console.warn('⚠️ Provider already has an active call notification - ignoring new call');
        return prevCall; // Keep current call
      }

      console.log('📞 Showing call notification:', callData.callId);

      // Show browser notification
      if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        try {
          const isChat = callData.mode === 'chat';
          const isVideo = callData.mode === 'video';
          
          const notification = new Notification(
            isChat 
              ? 'Incoming Chat Request' 
              : `Incoming ${isVideo ? 'Video' : 'Audio'} Call`,
            {
              body: `${callData.callerName} is ${isChat ? 'requesting chat' : 'calling you'}`,
              icon: callData.callerAvatar || '/icon-192x192.png',
              badge: '/badge-72x72.png',
              tag: callData.callId,
              requireInteraction: true,
              vibrate: isChat ? [100, 100] : [200, 100, 200],
              silent: false,
            }
          );

          notification.onclick = () => {
            window.focus();
            notification.close();
          };

          notificationRef.current = notification;
        } catch (error) {
          console.error('❌ Notification error:', error);
        }
      }

      return callData; // Set new call
    });

    return true;
  }, [isValidCall]); // ✅ FIX: Removed currentCall from dependencies

  // Hide call notification
  const hideCall = useCallback(() => {
    // ✅ FIX: Use functional update to access real state
    setCurrentCall((prevCall) => {
      if (!prevCall) {
        console.warn('⚠️ No active call to hide');
        return null;
      }

      console.log('🔇 Hiding call notification:', prevCall.callId);
      
      // Clear timeout
      if (callTimeoutRef.current) {
        clearTimeout(callTimeoutRef.current);
        callTimeoutRef.current = null;
      }

      // Close browser notification
      if (notificationRef.current) {
        try {
          notificationRef.current.close();
        } catch (e) {
          // Silent fail
        }
        notificationRef.current = null;
      }

      return null; // Clear current call
    });
  }, []); // ✅ FIX: Removed currentCall from dependencies

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (callTimeoutRef.current) {
        clearTimeout(callTimeoutRef.current);
      }
      if (notificationRef.current) {
        try {
          notificationRef.current.close();
        } catch (e) {
          // Silent fail
        }
      }
    };
  }, []);

  return {
    currentCall,
    showCall,
    hideCall,
  };
};