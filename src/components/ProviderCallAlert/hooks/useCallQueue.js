import { useState, useCallback, useRef } from 'react';

/**
 * Custom hook to manage incoming call queue
 * Handles adding, removing calls and ensures only one call is processed at a time
 */
export const useCallQueue = () => {
  const [incomingCalls, setIncomingCalls] = useState([]);
  const callTimeoutsRef = useRef(new Map());
  const notificationRefs = useRef(new Map());

  // Validate call data
  const validateCallData = useCallback((callData) => {
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

  // Add call to queue with validation and deduplication
  const addCall = useCallback(
    (callData, onTimeout, playSound) => {
      if (!validateCallData(callData)) {
        return false;
      }

      let wasAdded = false;

      setIncomingCalls((prev) => {
        // Check for duplicate
        const exists = prev.some((call) => call.callId === callData.callId);
        if (exists) {
          console.warn('⚠️ Duplicate call ignored:', callData.callId);
          return prev;
        }

        // Normalize call data with default mode
        const normalizedCallData = {
          ...callData,
          mode: callData.mode || 'audio',
          timestamp: Date.now(),
        };

        // Only play sound if this is the first call
        if (prev.length === 0 && playSound) {
          playSound(normalizedCallData.mode);
        }

        wasAdded = true;
        return [...prev, normalizedCallData];
      });

      // Set auto-decline timeout (2 minutes)
      if (wasAdded && onTimeout) {
        const timeoutId = setTimeout(() => {
          console.log('⏰ Auto-declining call after timeout:', callData.callId);
          onTimeout(callData);
        }, 60000); // 2 minutes

        callTimeoutsRef.current.set(callData.callId, timeoutId);
      }

      // Show browser notification
      if (wasAdded && typeof Notification !== 'undefined' && Notification.permission === 'granted') {
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

      return wasAdded;
    },
    [validateCallData]
  );

  // Remove call from queue
  const removeCall = useCallback((callId, onComplete, playSound) => {
    if (!callId) {
      console.error('❌ Cannot remove call: callId is null or undefined');
      return;
    }

    setIncomingCalls((prev) => {
      const filtered = prev.filter((call) => call.callId !== callId);

      // If queue is now empty, trigger complete cleanup
      if (filtered.length === 0 && onComplete) {
        onComplete();
      } else if (filtered.length > 0 && playSound) {
        // Play sound for next call in queue
        const nextCall = filtered[0];
        if (nextCall) {
          playSound(nextCall.mode);
        }
      }

      return filtered;
    });

    // Clear timeout for this call
    const timeoutId = callTimeoutsRef.current.get(callId);
    if (timeoutId) {
      clearTimeout(timeoutId);
      callTimeoutsRef.current.delete(callId);
    }

    // Close browser notification
    const notification = notificationRefs.current.get(callId);
    if (notification) {
      try {
        notification.close();
      } catch (e) {
        // Silent fail
      }
      notificationRefs.current.delete(callId);
    }
  }, []);

  // Clear all calls and cleanup
  const clearAllCalls = useCallback(() => {
    setIncomingCalls([]);

    // Clear all timeouts
    callTimeoutsRef.current.forEach((timeoutId) => {
      clearTimeout(timeoutId);
    });
    callTimeoutsRef.current.clear();

    // Close all notifications
    notificationRefs.current.forEach((notification) => {
      try {
        notification.close();
      } catch (e) {
        // Silent fail
      }
    });
    notificationRefs.current.clear();
  }, []);

  // Get active call (first in queue)
  const activeCall = incomingCalls[0] || null;

  return {
    incomingCalls,
    activeCall,
    addCall,
    removeCall,
    clearAllCalls,
  };
};