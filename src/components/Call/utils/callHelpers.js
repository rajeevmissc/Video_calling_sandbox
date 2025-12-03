/**
 * Format seconds into MM:SS or HH:MM:SS format
 */
export const formatTimer = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Format waiting time as M:SS
 */
export const formatWaitingTime = (waitingTime) => {
  const m = Math.floor(waitingTime / 60);
  const s = waitingTime % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

/**
 * Get user display information based on role
 */
export const getUserDisplayInfo = (userRole, providerName) => {
  switch (userRole) {
    case 'provider':
      return { name: 'User', initial: 'U' };
    case 'user':
      return { name: providerName, initial: 'P' };
    default:
      return { name: 'User', initial: 'U' };
  }
};

/**
 * Check if a message is a system message
 */
export const isSystemMessage = (message, prefix) => {
  return message?.text && message.text.startsWith(prefix);
};

/**
 * Extract data from system message
 */
export const extractSystemMessageData = (message, prefix) => {
  if (!isSystemMessage(message, prefix)) return null;
  const parts = message.text.split(':');
  return parts.length > 2 ? parts.slice(2).join(':') : parts[2];
};

/**
 * Filter out typing messages from chat
 */
export const filterChatMessages = (messages) => {
  return messages.filter(msg => !msg.text?.startsWith('SYSTEM:TYPING:'));
};

/**
 * Build new call path with updated call type
 */
export const buildNewCallPath = (currentPath, newCallType) => {
  const pathParts = currentPath.split('/');
  pathParts[pathParts.length - 1] = newCallType;
  return pathParts.join('/');
};

/**
 * Save call state to session storage
 */
export const saveCallState = (locationState, callData, additionalData = {}) => {
  try {
    const stateToSave = {
      ...locationState,
      callData: callData,
      ...additionalData
    };
    sessionStorage.setItem('callSwitchState', JSON.stringify(stateToSave));
    console.log('💾 Saved call state to session storage');
  } catch (error) {
    console.error('Error saving call state:', error);
  }
};

/**
 * Restore call state from session storage
 */
export const restoreCallState = () => {
  try {
    const savedState = sessionStorage.getItem('callSwitchState');
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      console.log('🔄 Restored state after call type switch:', parsedState);
      sessionStorage.removeItem('callSwitchState');
      return parsedState;
    }
    return null;
  } catch (error) {
    console.error('Error restoring call state:', error);
    sessionStorage.removeItem('callSwitchState');
    return null;
  }
};

/**
 * Navigate to provider page for retry
 */
export const navigateToProviderRetry = (navigate, callData, callType) => {
  const providerId = callData?.providerId;

  if (!providerId) {
    console.error('Provider information not available');
    navigate("/services");
    return;
  }

  navigate(`/provider/${providerId}`, {
    state: {
      autoRetryCall: true,
      callType: callType,
      previousCallData: callData
    }
  });
};

/**
 * Get navigation path based on user role
 */
export const getNavigationPathByRole = (userRole) => {
  if (userRole === "provider" || userRole === "admin") {
    return "/";
  } else if (userRole === "user") {
    return "/services";
  }
  return "/";
};

/**
 * Send auto-decline notification to backend
 */
export const sendAutoDeclineNotification = async (channelName, callType, waitingTime) => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    await fetch(`${process.env.REACT_APP_API_URL}/notifications/auto-decline-call/${channelName}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reason: "Provider did not respond within 2 minutes",
        callType,
        waitingTime,
      }),
    });
    console.log("📡 Auto-decline sent to backend");
  } catch (error) {
    console.error("❌ Auto-decline error:", error);
  }
};

/**
 * Finalize billing for call
 */
export const finalizeCallBilling = async (channelName, callDuration, callType, totalCharged) => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/notifications/end-call/${channelName}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        callDuration,
        callType,
        totalCharged
      })
    });

    if (response.ok) {
      console.log('✅ Call billing finalized successfully');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error finalizing call billing:', error);
    return false;
  }
};

/**
 * Finalize billing for chat
 */
export const finalizeChatBilling = async (channelName, callDuration, callType, totalCharged) => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/notifications/end-chat/${channelName}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        callDuration,
        callType,
        totalCharged
      })
    });

    if (response.ok) {
      console.log('✅ Billing finalized successfully');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error finalizing billing:', error);
    return false;
  }
};