import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { CALL_STATUS, CALL_TYPE } from '../utils/constants';
import { restoreCallState } from '../utils/callHelpers';

/**
 * Custom hook to manage all call state variables
 */
export const useCallState = (callType, userRole, remoteUsers, initialCallConnected) => {
  const location = useLocation();
  const callData = location.state?.callData || location.state || {};

  const [isWaitingForProvider, setIsWaitingForProvider] = useState(
    location.state?.isWaitingForProvider || false
  );
  const [callStatus, setCallStatus] = useState(
    isWaitingForProvider ? CALL_STATUS.WAITING : CALL_STATUS.CONNECTED
  );
  const [waitingTime, setWaitingTime] = useState(0);
  const [showEndCallPopup, setShowEndCallPopup] = useState(false);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [showReadyDelay, setShowReadyDelay] = useState(false);
  const [showDeclinedPopup, setShowDeclinedPopup] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [isRemoteTyping, setIsRemoteTyping] = useState(false);
  const [isSwitchingCallType, setIsSwitchingCallType] = useState(false);
  const [switchingToType, setSwitchingToType] = useState('');

  // Check if this is a chat mode call
  const isChatMode = callType === CALL_TYPE.CHAT;

  // Check if waiting for provider in chat mode
  // This will update based on remoteUsers and initialCallConnected
  const isWaitingForProviderInChat = 
    isChatMode && 
    userRole === 'user' && 
    remoteUsers.length === 0 && 
    !initialCallConnected;

  // Restore state from sessionStorage after reload
  useEffect(() => {
    const restoredState = restoreCallState();
    if (restoredState) {
      // Use restored state if needed
      console.log('State restored:', restoredState);
    }
  }, []);

  return {
    // State variables
    isWaitingForProvider,
    setIsWaitingForProvider,
    callStatus,
    setCallStatus,
    waitingTime,
    setWaitingTime,
    showEndCallPopup,
    setShowEndCallPopup,
    showExitConfirmation,
    setShowExitConfirmation,
    callEnded,
    setCallEnded,
    showReadyDelay,
    setShowReadyDelay,
    showDeclinedPopup,
    setShowDeclinedPopup,
    declineReason,
    setDeclineReason,
    isRemoteTyping,
    setIsRemoteTyping,
    isSwitchingCallType,
    setIsSwitchingCallType,
    switchingToType,
    setSwitchingToType,
    
    // Computed values
    isChatMode,
    isWaitingForProviderInChat,
    callData,
    userRole
  };
};