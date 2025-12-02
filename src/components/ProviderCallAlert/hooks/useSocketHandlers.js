import { useCallback, useRef } from 'react';

/**
 * Custom hook to manage Socket.IO event handlers
 * Handles incoming calls, call ended, and call declined events
 */
export const useSocketHandlers = ({
  socket,
  providerId,
  addCall,
  removeCall,
  playSound,
  mountedRef,
}) => {
  const handlersRegisteredRef = useRef(false);

  // Handle incoming call event
  const handleIncomingCall = useCallback(
    (callData) => {
      if (!mountedRef.current) {
        console.warn('⚠️ Component unmounted, ignoring incoming call');
        return;
      }

      console.log('📞 Incoming request via Socket.IO:', callData);

      // Add call to queue (with validation inside addCall)
      const added = addCall(
        callData,
        (call) => {
          // Auto-decline callback
          if (mountedRef.current) {
            console.log('⏰ Auto-declining call:', call.callId);
            // Trigger decline via socket
            if (socket && socket.connected) {
              socket.emit('decline-call', { callId: call.callId });
            }
            removeCall(call.callId);
          }
        },
        playSound
      );

      if (added) {
        console.log('✅ Call added to queue:', callData.callId);
      }
    },
    [addCall, removeCall, playSound, mountedRef, socket]
  );

  // Handle call ended event
  const handleCallEnded = useCallback(
    ({ callId }) => {
      if (!mountedRef.current) {
        console.warn('⚠️ Component unmounted, ignoring call ended');
        return;
      }

      if (!callId) {
        console.error('❌ Received call-ended with invalid callId');
        return;
      }

      console.log('📞 Call ended via Socket.IO:', callId);
      removeCall(callId);
    },
    [removeCall, mountedRef]
  );

  // Handle call declined event
  const handleCallDeclined = useCallback(
    ({ callId }) => {
      if (!mountedRef.current) {
        console.warn('⚠️ Component unmounted, ignoring call declined');
        return;
      }

      if (!callId) {
        console.error('❌ Received call-declined with invalid callId');
        return;
      }

      console.log('📞 Call declined via Socket.IO:', callId);
      removeCall(callId);
    },
    [removeCall, mountedRef]
  );

  // Handle socket disconnection
  const handleDisconnect = useCallback(() => {
    console.warn('⚠️ Socket disconnected');
  }, []);

  // Handle socket reconnection
  const handleReconnect = useCallback(() => {
    if (!providerId || !socket) return;

    console.log('🔌 Socket reconnected, re-registering provider:', providerId);
    
    try {
      socket.emit('register-provider', providerId);
    } catch (error) {
      console.error('❌ Failed to re-register provider:', error);
    }
  }, [socket, providerId]);

  // Register all socket handlers
  const registerSocketHandlers = useCallback(() => {
    if (!socket || !providerId) {
      console.error('❌ Cannot register handlers: socket or providerId missing');
      return;
    }

    if (handlersRegisteredRef.current) {
      console.warn('⚠️ Socket handlers already registered');
      return;
    }

    try {
      console.log('🔌 Registering provider with Socket.IO:', providerId);
      
      // Register provider
      socket.emit('register-provider', providerId);

      // Register event listeners
      socket.on('incoming-call', handleIncomingCall);
      socket.on('call-ended', handleCallEnded);
      socket.on('call-declined', handleCallDeclined);
      socket.on('disconnect', handleDisconnect);
      socket.on('connect', handleReconnect);

      handlersRegisteredRef.current = true;
      console.log('✅ Socket handlers registered successfully');
    } catch (error) {
      console.error('❌ Error registering socket handlers:', error);
    }
  }, [
    socket,
    providerId,
    handleIncomingCall,
    handleCallEnded,
    handleCallDeclined,
    handleDisconnect,
    handleReconnect,
  ]);

  // Unregister all socket handlers
  const unregisterSocketHandlers = useCallback(() => {
    if (!socket) {
      console.warn('⚠️ Cannot unregister handlers: socket missing');
      return;
    }

    if (!handlersRegisteredRef.current) {
      console.warn('⚠️ Socket handlers not registered, nothing to unregister');
      return;
    }

    try {
      console.log('🔌 Unregistering socket handlers');

      socket.off('incoming-call', handleIncomingCall);
      socket.off('call-ended', handleCallEnded);
      socket.off('call-declined', handleCallDeclined);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect', handleReconnect);

      handlersRegisteredRef.current = false;
      console.log('✅ Socket handlers unregistered successfully');
    } catch (error) {
      console.error('❌ Error unregistering socket handlers:', error);
    }
  }, [
    socket,
    handleIncomingCall,
    handleCallEnded,
    handleCallDeclined,
    handleDisconnect,
    handleReconnect,
  ]);

  return {
    registerSocketHandlers,
    unregisterSocketHandlers,
  };
};