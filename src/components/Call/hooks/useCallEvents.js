import { useEffect } from 'react';
import { CALL_STATUS, TIMING, SYSTEM_MESSAGES } from '../utils/constants';
import { 
  isSystemMessage, 
  extractSystemMessageData, 
  buildNewCallPath, 
  saveCallState 
} from '../utils/callHelpers';

/**
 * Custom hook to manage Socket.IO events and chat message handlers
 */
export const useCallEvents = ({
  socket,
  isConnected,
  channelName,
  callEnded,
  agora,
  controls,
  chatMessages,
  location,
  callData,
  // State setters
  setDeclineReason,
  setShowDeclinedPopup,
  setCallEnded,
  setCallStatus,
  setIsWaitingForProvider,
  setCallConnected,
  setShowEndCallPopup,
  setIsRemoteTyping,
  setIsSwitchingCallType,
  setSwitchingToType,
  ui
}) => {
  // Listen for call events via Socket.IO
  useEffect(() => {
    if (!socket || !isConnected || !channelName) return;

    console.log('🔌 Setting up Socket.IO listeners for channel:', channelName);

    const handleCallDeclined = (data) => {
      console.log('📞 Received call-declined event:', data);

      if (data.channelName === channelName || data.callId?.includes(channelName)) {
        console.log('✅ Decline is for our channel, showing popup');

        const reason = data.reason || 'Provider declined the call';
        setDeclineReason(reason);
        setShowDeclinedPopup(true);
        setCallEnded(true);
        setCallStatus(CALL_STATUS.DECLINED);
        setIsWaitingForProvider(false);

        setTimeout(() => {
          if (agora?.cleanup) {
            console.log('🧹 Cleaning up Agora after decline');
            agora.cleanup();
          }
        }, TIMING.POPUP_DELAY);
      }
    };

    const handleCallEnded = (data) => {
      console.log('📞 Received call-ended event:', data);

      if (data.channelName === channelName || data.callId?.includes(channelName)) {
        console.log('✅ End is for our channel');

        if (!callEnded) {
          controls.stopRecording?.();
          setCallConnected(false);
          setCallEnded(true);
          setCallStatus(CALL_STATUS.ENDED);

          setTimeout(() => {
            if (agora?.cleanup) {
              agora.cleanup();
            }
          }, TIMING.CLEANUP_DELAY);

          setTimeout(() => {
            setShowEndCallPopup(true);
          }, TIMING.END_POPUP_DELAY);
        }
      }
    };

    const handleCallExpired = (data) => {
      console.log('⏰ Received call-expired event:', data);

      if (data.channelName === channelName || data.callId?.includes(channelName)) {
        console.log('✅ Expiration is for our channel');

        const reason = 'Call request expired (no response from provider)';
        setDeclineReason(reason);
        setShowDeclinedPopup(true);
        setCallEnded(true);
        setCallStatus(CALL_STATUS.DECLINED);
        setIsWaitingForProvider(false);

        setTimeout(() => {
          if (agora?.cleanup) {
            agora.cleanup();
          }
        }, TIMING.POPUP_DELAY);
      }
    };

    const handleCallTypeSwitch = (data) => {
      console.log('🔄 Received call-type-switch event:', data);

      if (data.channelName === channelName || data.callId?.includes(channelName)) {
        console.log('✅ Call type switch is for our channel');

        const newCallType = data.newCallType;
        const newPath = buildNewCallPath(window.location.pathname, newCallType);

        setIsSwitchingCallType(true);
        setSwitchingToType(newCallType);

        setTimeout(() => {
          saveCallState(location.state, callData, {
            switchedFromChat: true,
            autoSwitched: true
          });

          window.location.href = newPath;
        }, TIMING.SWITCH_DELAY);
      }
    };

    socket.on('call-declined', handleCallDeclined);
    socket.on('call-ended', handleCallEnded);
    socket.on('call-expired', handleCallExpired);
    socket.on('call-type-switch', handleCallTypeSwitch);

    return () => {
      socket.off('call-declined', handleCallDeclined);
      socket.off('call-ended', handleCallEnded);
      socket.off('call-expired', handleCallExpired);
      socket.off('call-type-switch', handleCallTypeSwitch);
    };
  }, [
    socket, 
    isConnected, 
    channelName, 
    callEnded, 
    agora, 
    controls, 
    location.state, 
    callData,
    setDeclineReason,
    setShowDeclinedPopup,
    setCallEnded,
    setCallStatus,
    setIsWaitingForProvider,
    setCallConnected,
    setShowEndCallPopup,
    setIsSwitchingCallType,
    setSwitchingToType
  ]);

  // Listen for chat messages and system notifications
  useEffect(() => {
    if (!chatMessages || chatMessages.length === 0) return;

    const lastMessage = chatMessages[chatMessages.length - 1];

    // Handle typing notification
    if (isSystemMessage(lastMessage, SYSTEM_MESSAGES.TYPING)) {
      const isTyping = extractSystemMessageData(lastMessage, SYSTEM_MESSAGES.TYPING) === 'true';
      setIsRemoteTyping(isTyping);
      return;
    }

    // Handle call decline notification
    if (isSystemMessage(lastMessage, SYSTEM_MESSAGES.CALL_DECLINED)) {
      const reason = extractSystemMessageData(lastMessage, SYSTEM_MESSAGES.CALL_DECLINED) || 'No reason provided';
      setDeclineReason(reason);
      setShowDeclinedPopup(true);
      setCallEnded(true);
      setCallStatus(CALL_STATUS.DECLINED);

      setTimeout(() => {
        agora.cleanup();
      }, TIMING.POPUP_DELAY);
      return;
    }

    // Handle chat ended notification
    if (isSystemMessage(lastMessage, SYSTEM_MESSAGES.CHAT_ENDED)) {
      if (!callEnded) {
        console.log('📩 Received chat ended notification from other user');

        setCallConnected(false);
        setCallEnded(true);
        setCallStatus(CALL_STATUS.ENDED);

        if (ui.setShowChat) {
          ui.setShowChat(false);
        }

        setTimeout(() => {
          agora.cleanup();
        }, TIMING.CLEANUP_DELAY);

        setTimeout(() => {
          setShowEndCallPopup(true);
        }, TIMING.END_POPUP_DELAY);
      }
      return;
    }

    // Handle call ended notification
    if (isSystemMessage(lastMessage, SYSTEM_MESSAGES.CALL_ENDED)) {
      if (!callEnded) {
        console.log('📞 Received call ended notification from other user');

        controls.stopRecording?.();
        setCallConnected(false);
        setCallEnded(true);
        setCallStatus(CALL_STATUS.ENDED);

        setTimeout(() => {
          agora.cleanup();
        }, TIMING.CLEANUP_DELAY);

        setTimeout(() => {
          setShowEndCallPopup(true);
        }, TIMING.END_POPUP_DELAY);
      }
      return;
    }

    // Handle call type switch notification
    if (isSystemMessage(lastMessage, SYSTEM_MESSAGES.SWITCH_CALL_TYPE)) {
      const newCallType = extractSystemMessageData(lastMessage, SYSTEM_MESSAGES.SWITCH_CALL_TYPE);

      console.log(`🔄 Received call type switch notification via chat: ${newCallType}`);

      const newPath = buildNewCallPath(window.location.pathname, newCallType);

      setIsSwitchingCallType(true);
      setSwitchingToType(newCallType);

      setTimeout(() => {
        saveCallState(location.state, callData, {
          switchedFromChat: true,
          autoSwitched: true
        });

        window.location.href = newPath;
      }, TIMING.SWITCH_DELAY);
    }
  }, [
    chatMessages,
    agora,
    callEnded,
    ui,
    controls,
    location.state,
    callData,
    setIsRemoteTyping,
    setDeclineReason,
    setShowDeclinedPopup,
    setCallEnded,
    setCallStatus,
    setCallConnected,
    setShowEndCallPopup,
    setIsSwitchingCallType,
    setSwitchingToType
  ]);
};