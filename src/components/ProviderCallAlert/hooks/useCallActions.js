import { useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002/api';

/**
 * Custom hook to handle call actions (accept/decline)
 * Manages API calls, navigation, and error handling
 */
export const useCallActions = ({
  navigate,
  removeCall,
  setIsProcessing,
  setIsAccepting,
  processingCallsRef,
  stopSound,
}) => {
  // Get authentication token
  const getAuthToken = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required. Please log in again.');
    }
    return token;
  }, []);

  // Create axios config with timeout and auth
  const createAxiosConfig = useCallback(
    (token) => ({
      headers: { Authorization: `Bearer ${token}` },
      timeout: 10000,
    }),
    []
  );

  // Handle accept call
  const handleAcceptCall = useCallback(
    async (call) => {
      // Validation
      if (!call) {
        console.error('❌ Cannot accept: call is null or undefined');
        return;
      }

      if (processingCallsRef.current.has(call.callId)) {
        console.warn('⚠️ Call already being processed:', call.callId);
        return;
      }

      // Mark as processing
      processingCallsRef.current.add(call.callId);
      setIsProcessing(true);
      setIsAccepting(true);

      try {
        console.log('✅ Accepting request:', call.callId);

        const token = getAuthToken();
        const config = createAxiosConfig(token);

        // Notify backend about acceptance
        const acceptResponse = await axios.post(
          `${API_BASE_URL}/notifications/accept-call/${call.callId}`,
          {},
          config
        );

        if (!acceptResponse.data) {
          throw new Error('Invalid response from accept endpoint');
        }

        console.log('✅ Call accepted on backend:', call.callId);

        // Stop sound and remove from queue
        stopSound();
        removeCall(call.callId);

        // Handle chat mode differently (no Agora tokens needed)
        if (call.mode === 'chat') {
          navigate(`/call/${call.channelName}/${call.mode}`, {
            state: {
              callData: {
                channelName: call.channelName,
                participantName: call.callerName,
                userRole: 'provider',
                callId: call.callId,
              },
            },
            replace: true,
          });
          return;
        }

        // For audio/video calls, fetch Agora tokens
        console.log('🎫 Fetching Agora tokens for:', call.channelName);

        const tokenResponse = await axios.get(
          `${API_BASE_URL}/agora/call-tokens`,
          {
            ...config,
            params: { channel: call.channelName },
          }
        );

        const { rtcToken, uid, appId } = tokenResponse.data;

        // Validate token response
        if (!rtcToken || !uid || !appId) {
          throw new Error('Invalid or incomplete token data received from server');
        }

        console.log('✅ Agora tokens received successfully');

        // Navigate to call screen
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
      } catch (error) {
        console.error('❌ Accept call error:', error);

        // Remove call from queue even on error
        removeCall(call.callId);
        stopSound();

        // Reset processing states
        setIsAccepting(false);
        setIsProcessing(false);
        processingCallsRef.current.delete(call.callId);

        // Determine error message
        let errorMessage = 'An unexpected error occurred';

        if (error.response) {
          // Server responded with error
          errorMessage = error.response.data?.message || 
                        error.response.statusText || 
                        'Server error occurred';
        } else if (error.request) {
          // Request made but no response
          errorMessage = 'No response from server. Please check your connection.';
        } else if (error.message) {
          // Error in request setup
          errorMessage = error.message;
        }

        alert(`Failed to join ${call.mode === 'chat' ? 'chat' : 'call'}: ${errorMessage}`);
      }
    },
    [
      navigate,
      removeCall,
      setIsProcessing,
      setIsAccepting,
      processingCallsRef,
      stopSound,
      getAuthToken,
      createAxiosConfig,
    ]
  );

  // Handle decline call
  const handleDeclineCall = useCallback(
    async (call) => {
      // Validation
      if (!call) {
        console.error('❌ Cannot decline: call is null or undefined');
        return;
      }

      if (processingCallsRef.current.has(call.callId)) {
        console.warn('⚠️ Call already being processed:', call.callId);
        return;
      }

      // Mark as processing
      processingCallsRef.current.add(call.callId);
      setIsProcessing(true);

      try {
        console.log('❌ Declining request:', call.callId);

        const token = getAuthToken();
        const config = createAxiosConfig(token);

        // Notify backend about decline
        const response = await axios.post(
          `${API_BASE_URL}/notifications/decline-call/${call.callId}`,
          {},
          config
        );

        if (response.data) {
          console.log('✅ Call declined successfully:', call.callId);
        }
      } catch (error) {
        console.error('❌ Decline API error:', error);

        // Log but don't block UI - declining should always work locally
        if (error.response) {
          console.error('Server error:', error.response.status, error.response.data);
        } else if (error.request) {
          console.error('No response from server');
        } else {
          console.error('Request setup error:', error.message);
        }
      } finally {
        // Always remove call locally, even if API failed
        removeCall(call.callId);
        stopSound();
        setIsProcessing(false);
        processingCallsRef.current.delete(call.callId);
      }
    },
    [
      removeCall,
      setIsProcessing,
      processingCallsRef,
      stopSound,
      getAuthToken,
      createAxiosConfig,
    ]
  );

  return {
    handleAcceptCall,
    handleDeclineCall,
  };
};