import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from 'axios'; // ✅ NEW: Import axios
import { useAgora } from "./hooks/useAgora";
import { useCallControls } from "./hooks/useCallControls";
import { useCallUI } from "./hooks/useCallUI";
import { useCallBilling } from "./hooks/useCallBilling";
import { useSocket } from '../../context/Socketcontext';

// Custom hooks
import { useCallState } from './hooks/useCallState';
import { useCallEvents } from './hooks/useCallEvents';
import { useCallNavigation } from './hooks/useCallNavigation';
import { useCallTimers } from './hooks/useCallTimers';

// Components
import ChatPanel from "./ChatPanel";
import EndCallPopup from "./EndCallPopup";
import LowBalanceWarning from "./LowBalanceWarning";
import LoadingScreen from './features/Overlays/LoadingScreen';
import SwitchingOverlay from './features/Overlays/SwitchingOverlay';
import ReadyCountdown from './features/Overlays/ReadyCountdown';
import ExitConfirmation from './features/Overlays/ExitConfirmation';
import DeclinedPopup from './features/Popups/DeclinedPopup';
import ChatModeHeader from './features/ChatMode/ChatModeHeader';
import ChatModeOverlay from './features/ChatMode/ChatModeOverlay';
import CallModeLayout from './features/CallMode/CallModeLayout';

// Utilities
import { CALL_STATUS, CALL_TYPE, TIMING, SYSTEM_MESSAGES } from './utils/constants';
import {
  formatTimer,
  getUserDisplayInfo,
  filterChatMessages,
  buildNewCallPath,
  saveCallState,
  navigateToProviderRetry,
  getNavigationPathByRole,
  finalizeCallBilling,
  finalizeChatBilling
} from './utils/callHelpers';

import './Call.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002/api';

function Call() {
  const { channelName, callType } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { socket, isConnected } = useSocket();

  // IMPORTANT: To prevent false auto-decline
  const callWasEverConnected = useRef(false);

  // Agora init
  const agora = useAgora(
    channelName,
    callType,
    navigate,
    location.state?.callData?.userRole || location.state?.userRole
  );

  const callStateData = useCallState(
    callType,
    location.state?.callData?.userRole || location.state?.userRole,
    agora.remoteUsers,
    agora.remoteUsers.length > 0
  );

  const controls = useCallControls(agora);
  const ui = useCallUI();

  const {
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
    isChatMode,
    isWaitingForProviderInChat,
    callData,
    userRole
  } = callStateData;

  const [callConnected, setCallConnected] = useState(agora.remoteUsers.length > 0);

  // ⚡ Prevent WRONG waiting state after provider already joined once
  const currentIsWaitingForProviderInChat = useMemo(() => {
    if (callWasEverConnected.current) return false;

    const isWaiting =
      isChatMode &&
      userRole === 'user' &&
      agora.remoteUsers.length === 0 &&
      !callConnected &&
      !callEnded;

    return isWaiting;
  }, [
    isChatMode,
    userRole,
    agora.remoteUsers.length,
    callConnected,
    callEnded
  ]);

  // When provider joins → mark stable connection (VERY IMPORTANT)
 useEffect(() => {
  if (agora.remoteUsers.length > 0 && !callConnected) {
    console.log("🟢 Provider joined — call officially connected");

    // ⬇️ NEW: Mark provider busy
    if (socket && isConnected && callData?.providerId) {
      socket.emit("provider-busy", {
        providerId: callData.providerId
      });
    }

    callWasEverConnected.current = true;
    setCallConnected(true);
    setIsWaitingForProvider(false);
    setCallStatus(CALL_STATUS.CONNECTED);

    if (agora.startSyncedTimer) {
      agora.startSyncedTimer();
    }
  }
}, [agora.remoteUsers.length]);


  // Auto disable video for chat mode
  useEffect(() => {
    if (isChatMode && agora.localVideoTrack) {
      agora.localVideoTrack.setEnabled(false);
      if (!ui.showChat && !callEnded) ui.setShowChat(true);
    }
  }, [isChatMode, agora.localVideoTrack, ui.showChat, callEnded]);

  // Billing logic
  const billing = useCallBilling(
    channelName,
    callType,
    agora.callDuration,
    callConnected && !callEnded && agora.connectionState === "CONNECTED" && !showReadyDelay,
    callData,
    handleInsufficientBalance
  );

  // Navigation protections
  useCallNavigation({
    callEnded,
    callConnected,
    isWaitingForProvider,
    remoteUsersLength: agora.remoteUsers.length,
    setShowExitConfirmation
  });

  // Socket & Agora events
  useCallEvents({
    socket,
    isConnected,
    channelName,
    callEnded,
    agora,
    controls,
    chatMessages: agora.chatMessages,
    location,
    callData,
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
  });

  // Timers (with corrected logic)
  useCallTimers({
    isWaitingForProvider,
    isWaitingForProviderInChat: currentIsWaitingForProviderInChat,
    callConnected: callWasEverConnected.current ? true : callConnected,
    callEnded,
    userRole,
    channelName,
    callType,
    agora,
    setWaitingTime,
    setDeclineReason,
    setShowDeclinedPopup,
    setCallEnded,
    setCallStatus
  });

  // ✅ NEW: Notify backend when call/chat ends
 const notifyBackendCallEnded = useCallback(async () => {
  if (!callData?.providerId) return;

  try {
    const token = localStorage.getItem('token');

    // Notify backend API
    await axios.post(
      `${API_BASE_URL}/notifications/end-call/${callData?.callId || channelName}`,
      { providerId: callData?.providerId },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log("Backend notified. Now marking provider available...");

    // ⬇️ NEW: Real-time provider AVAILABLE
    if (socket && isConnected && callData?.providerId) {
      socket.emit("provider-available", {
        providerId: callData.providerId
      });
    }

  } catch (error) {
    console.error("Failed to notify backend:", error);
  }
}, [callData, channelName, socket, isConnected]);


  // Handle typing indicator
  const handleTypingChange = useCallback(
    (isTyping) => {
      try {
        agora.sendMessage?.(`${SYSTEM_MESSAGES.TYPING}${isTyping}`);
      } catch {}
    },
    [agora]
  );

  // Convert chat → audio call
  const handleAudioCallFromChat = useCallback(async () => {
    setIsSwitchingCallType(true);
    setSwitchingToType("audio");

    if (agora.sendMessage) await agora.sendMessage(`${SYSTEM_MESSAGES.SWITCH_CALL_TYPE}audio`);

    if (socket && isConnected) {
      socket.emit("switch-call-type", {
        channelName,
        newCallType: "audio",
        userId: callData?.userId,
        providerId: callData?.providerId
      });
    }

    setTimeout(() => {
      saveCallState(location.state, callData, { switchedFromChat: true });
      window.location.href = buildNewCallPath(window.location.pathname, "audio");
    }, TIMING.SWITCH_DELAY);
  }, [agora, socket, isConnected, channelName, callData, location.state]);

  // Convert chat → video call
  const handleVideoCallFromChat = useCallback(async () => {
    setIsSwitchingCallType(true);
    setSwitchingToType("video");

    if (agora.sendMessage) await agora.sendMessage(`${SYSTEM_MESSAGES.SWITCH_CALL_TYPE}video`);

    if (socket && isConnected) {
      socket.emit("switch-call-type", {
        channelName,
        newCallType: "video",
        userId: callData?.userId,
        providerId: callData?.providerId
      });
    }

    setTimeout(() => {
      saveCallState(location.state, callData, { switchedFromChat: true });
      window.location.href = buildNewCallPath(window.location.pathname, "video");
    }, TIMING.SWITCH_DELAY);
  }, [agora, socket, isConnected, channelName, callData, location.state]);


useEffect(() => {
  return () => {
    if (socket && isConnected && callData?.providerId) {
      console.log("⚠️ Component unmounted → marking provider available");

      socket.emit("provider-available", {
        providerId: callData.providerId,
      });
    }
  };
}, []);


  // End chat
  const endChat = useCallback(async () => {
    try {
      // Send message to other participant
      await agora.sendMessage?.(`${SYSTEM_MESSAGES.CHAT_ENDED}Chat session has ended`);
      
      // ✅ NEW: Notify backend that chat ended (clear busy state)
      await notifyBackendCallEnded();
      
      await new Promise((res) => setTimeout(res, TIMING.CLEANUP_DELAY));

      setCallConnected(false);
      setCallEnded(true);
      setCallStatus(CALL_STATUS.ENDED);

      ui.setShowChat(false);

      await finalizeChatBilling(channelName, agora.callDuration, callType, billing.totalCharged);
      agora.cleanup();

      setTimeout(() => setShowEndCallPopup(true), TIMING.POPUP_DELAY);
    } catch (error) {
      console.error('❌ Error ending chat:', error);
      setShowEndCallPopup(true);
    }
  }, [agora, notifyBackendCallEnded, channelName, callType, billing.totalCharged, ui]);

  // End call (audio/video)
  const endCall = useCallback(async () => {
    try {
      // Stop recording if active
      controls.stopRecording?.();
      
      // Send message to other participant
      await agora.sendMessage?.(`${SYSTEM_MESSAGES.CALL_ENDED}Call session has ended`);

      // ✅ NEW: Notify backend that call ended (clear busy state)
      await notifyBackendCallEnded();

      await new Promise((res) => setTimeout(res, TIMING.CLEANUP_DELAY));

      setCallConnected(false);
      setCallEnded(true);
      setCallStatus(CALL_STATUS.ENDED);

      await finalizeCallBilling(channelName, agora.callDuration, callType, billing.totalCharged);
      agora.cleanup();

      setTimeout(() => setShowEndCallPopup(true), TIMING.POPUP_DELAY);
    } catch (error) {
      console.error('❌ Error ending call:', error);
      setShowEndCallPopup(true);
    }
  }, [controls, agora, notifyBackendCallEnded, channelName, callType, billing.totalCharged]);

  // Exit confirmation accepted
  const handleConfirmExit = useCallback(() => {
    setShowExitConfirmation(false);

    if (isChatMode) endChat();
    else endCall();

    setTimeout(() => navigate("/services"), TIMING.POPUP_DELAY);
  }, [isChatMode, endChat, endCall, navigate]);

  const handleCancelExit = useCallback(() => {
    setShowExitConfirmation(false);
    window.history.pushState(null, "", window.location.pathname);
  }, []);

  const handleShareExperience = useCallback(() => {
    setShowEndCallPopup(false);
    navigate("/feedback", {
      state: {
        callDuration: agora.callDuration,
        channelName,
        callType,
        callData,
        totalCharged: billing.totalCharged
      }
    });
  }, [navigate, agora.callDuration, channelName, callType, callData, billing.totalCharged]);

  const handleClosePopup = useCallback(() => {
    setShowEndCallPopup(false);
    navigate(getNavigationPathByRole(userRole));
  }, [navigate, userRole]);

  const handleCallSameProvider = useCallback(() => {
    setShowDeclinedPopup(false);
    navigateToProviderRetry(navigate, callData, callType);
  }, [navigate, callData, callType]);

  const handleBookAnother = useCallback(() => {
    navigate("/services");
  }, [navigate]);

    const handleInsufficientBalance = useCallback(({ reason, currentBalance, requiredAmount, totalCharged }) => {
  console.log('💰 Call ending due to insufficient balance:', {
    reason,
    currentBalance,
    requiredAmount,
    totalCharged
  });

  // Show alert to user
  alert(`Call ended: Insufficient balance\n\nYou need ₹${requiredAmount} for the next minute.\nCurrent balance: ₹${currentBalance}\nTotal charged: ₹${totalCharged}\n\nPlease recharge your wallet to continue.`);

  // End the call
  if (isChatMode) {
    endChat();
  } else {
    endCall();
  }
}, [isChatMode, endChat, endCall]);


  const containerClass = isChatMode ? "call-container call-mode-chat" : "call-container";
  const displayInfo = getUserDisplayInfo(callData?.userRole, callData.providerName);
  return (
    <div className={containerClass}>
      <LoadingScreen
        isLoading={agora.isLoading}
        connectionState={agora.connectionState}
        isChatMode={isChatMode}
      />

      <SwitchingOverlay
        isSwitching={isSwitchingCallType}
        switchingToType={switchingToType}
      />

      {isChatMode && (
        <ChatModeHeader
          displayInfo={displayInfo}
          callConnected={callConnected}
          callDuration={agora.callDuration}
          onAudioCall={handleAudioCallFromChat}
          onVideoCall={handleVideoCallFromChat}
          onEndChat={endChat}
          callEnded={callEnded}
          isSwitching={isSwitchingCallType}
        />
      )}

      <ReadyCountdown
        show={showReadyDelay}
        callConnected={callConnected}
        isChatMode={isChatMode}
      />

      {/* Chat */}
      <div
        className={`call-chat-sidebar ${
          (ui.showChat && !callEnded) || isChatMode ? "open" : ""
        }`}
        style={{ zIndex: isChatMode ? 10 : 50 }}
      >

      <ChatModeOverlay
        isWaiting={currentIsWaitingForProviderInChat}
        callEnded={callEnded}
        waitingTime={waitingTime}
      />  


        <ChatPanel
          chatMessages={filterChatMessages(agora.chatMessages)}
          chatInput={agora.chatInput}
          setChatInput={agora.setChatInput}
          sendMessage={agora.sendMessage}
          remoteUsers={agora.remoteUsers}
          onClose={() => !isChatMode && ui.setShowChat(false)}
          currentUserId={userRole === "user" ? "local" : "remote"}
          isWaitingForProvider={currentIsWaitingForProviderInChat}
          isRemoteTyping={isRemoteTyping}
          onTypingChange={handleTypingChange}
          onEndChat={endChat}
          providerName={callData.providerName}
          callType={callType}
        />
      </div>

      {!isChatMode && (
        <CallModeLayout
          callEnded={callEnded}
          callStatus={callStatus}
          waitingTime={waitingTime}
          agora={agora}
          controls={controls}
          ui={ui}
          callType={callType}
          isWaitingForProvider={isWaitingForProvider}
          billing={billing}
          onEndCall={endCall}
          chatMessages={agora.chatMessages}
          callData={callData}
        />
      )}

      <LowBalanceWarning
        isOpen={billing.lowBalanceWarning && !callEnded}
        onRecharge={billing.navigateToWallet}
        onContinue={billing.continueCall}
        currentBalance={billing.currentBalance}
        requiredAmount={billing.requiredBuffer}
        callRate={billing.callRate}
      />

      <ExitConfirmation
        show={showExitConfirmation}
        isChatMode={isChatMode}
        callConnected={callConnected}
        onConfirm={handleConfirmExit}
        onCancel={handleCancelExit}
      />

      <DeclinedPopup
        show={showDeclinedPopup}
        isChatMode={isChatMode}
        declineReason={declineReason}
        onTryAgain={handleCallSameProvider}
        onBookAnother={handleBookAnother}
      />

      {showEndCallPopup && (
        <div className="call-modal-overlay" style={{ zIndex: 9999, position: 'fixed' }}>
          <EndCallPopup
            callDuration={agora.callDuration}
            callStatus={callStatus}
            onShareExperience={handleShareExperience}
            onClose={handleClosePopup}
            totalCharged={billing.totalCharged}
            callType={callType}
            userRole={userRole}
          />
        </div>
      )}
    </div>
  );
}

export default React.memo(Call);