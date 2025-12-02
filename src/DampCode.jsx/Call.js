import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FiPhone, FiVideo } from "react-icons/fi"; 
import { useAgora } from "../hooks/useAgora";
import { useCallControls } from "../hooks/useCallControls";
import { useCallUI } from "../hooks/useCallUI";
import { useCallBilling } from "../hooks/useCallBilling";
import CallLayout from "./CallLayout";
import ControlPanel from "./ControlPanel";
import ChatPanel from "./ChatPanel";
import EndCallPopup from "./EndCallPopup";
import LowBalanceWarning from "./LowBalanceWarning";
import { useSocket } from '../context/Socketcontext';
import './Call.css';

function Call() {
  const { channelName, callType } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const callData = location.state?.callData || location.state || {};
  const userRole = callData?.userRole;
  const agora = useAgora(channelName, callType, navigate, userRole);
  const controls = useCallControls(agora);
  const ui = useCallUI();

  const [isWaitingForProvider, setIsWaitingForProvider] = useState(
    location.state?.isWaitingForProvider || false
  );
  const [callStatus, setCallStatus] = useState(
    isWaitingForProvider ? "waiting" : "connected"
  );
  const [waitingTime, setWaitingTime] = useState(0);
  const [showEndCallPopup, setShowEndCallPopup] = useState(false);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [callConnected, setCallConnected] = useState(false);
  const [showReadyDelay, setShowReadyDelay] = useState(false);
  const [showDeclinedPopup, setShowDeclinedPopup] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [isRemoteTyping, setIsRemoteTyping] = useState(false);
  const [isSwitchingCallType, setIsSwitchingCallType] = useState(false);
  const [switchingToType, setSwitchingToType] = useState('');
  const { socket, isConnected } = useSocket();

  // Check if this is a chat mode call
  const isChatMode = callType === 'chat';

  // Check if waiting for provider in chat mode
  const isWaitingForProviderInChat = isChatMode && userRole === 'user' && agora.remoteUsers.length === 0 && !callConnected;

  // Filter out typing messages from chat display
  const filteredChatMessages = useMemo(() => {
    return agora.chatMessages.filter(msg =>
      !msg.text?.startsWith('SYSTEM:TYPING:')
    );
  }, [agora.chatMessages]);

  // **NEW: Restore state from sessionStorage after reload**
  useEffect(() => {
    const savedState = sessionStorage.getItem('callSwitchState');

    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        console.log('🔄 Restored state after call type switch:', parsedState);

        // Clear the saved state
        sessionStorage.removeItem('callSwitchState');

        // You can use this state if needed
        // For example, you might want to update callData
      } catch (error) {
        console.error('Error restoring state:', error);
        sessionStorage.removeItem('callSwitchState');
      }
    }
  }, []);

  // Auto-open chat panel for chat mode and disable video/audio
  useEffect(() => {
    if (isChatMode) {
      // Disable video and audio for chat mode
      if (agora.localVideoTrack) {
        agora.localVideoTrack.setEnabled(false);
      }
      // if (agora.localAudioTrack) {
      //   agora.localAudioTrack.setEnabled(false);
      // }

      // Auto-open chat panel
      if (!ui.showChat && !callEnded) {
        ui.setShowChat(true);
      }
    }
  }, [isChatMode, ui.showChat, callEnded, ui, agora.localVideoTrack, agora.localAudioTrack]);

  const billing = useCallBilling(
    channelName,
    callType,
    agora.callDuration,
    callConnected && !callEnded && agora.connectionState === "CONNECTED" && !showReadyDelay,
    callData
  );


  // Full-screen mode (hide header/footer)
  useEffect(() => {
    document.body.classList.add("call-active");
    const header = document.querySelector("header");
    const footer = document.querySelector("footer");
    const nav = document.querySelector("nav");
    const orig = {
      header: header?.style.display,
      footer: footer?.style.display,
      nav: nav?.style.display,
    };
    if (header) header.style.display = "none";
    if (footer) footer.style.display = "none";
    if (nav) nav.style.display = "none";
    return () => {
      document.body.classList.remove("call-active");
      if (header) header.style.display = orig.header;
      if (footer) footer.style.display = orig.footer;
      if (nav) nav.style.display = orig.nav;
    };
  }, []);

  // Prevent browser back button during active call
  useEffect(() => {
    const isCallActive =
      !callEnded &&
      (callConnected ||
        isWaitingForProvider ||
        agora.remoteUsers.length > 0);


    const handlePopState = () => {
      if (isCallActive) {
        window.history.pushState(null, "", window.location.pathname);
        setShowExitConfirmation(true);
      }
    };

    window.history.pushState(null, "", window.location.pathname);
    // window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    return () => {
      // window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [callEnded, callConnected, isWaitingForProvider, agora.remoteUsers.length]);

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
        setCallStatus("declined");
        setIsWaitingForProvider(false);

        setTimeout(() => {
          if (agora?.cleanup) {
            console.log('🧹 Cleaning up Agora after decline');
            agora.cleanup();
          }
        }, 500);
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
          setCallStatus("ended");

          setTimeout(() => {
            if (agora?.cleanup) {
              agora.cleanup();
            }
          }, 300);

          setTimeout(() => {
            setShowEndCallPopup(true);
          }, 800);
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
        setCallStatus("declined");
        setIsWaitingForProvider(false);

        setTimeout(() => {
          if (agora?.cleanup) {
            agora.cleanup();
          }
        }, 500);
      }
    };

    // **UPDATED: Listen for call type switch notification with reload**
    const handleCallTypeSwitch = (data) => {
      console.log('🔄 Received call-type-switch event:', data);

      if (data.channelName === channelName || data.callId?.includes(channelName)) {
        console.log('✅ Call type switch is for our channel');

        const newCallType = data.newCallType;
        const currentPath = window.location.pathname;
        const pathParts = currentPath.split('/');

        // Update the callType in URL
        pathParts[pathParts.length - 1] = newCallType;
        const newPath = pathParts.join('/');

        // Show switching overlay
        setIsSwitchingCallType(true);
        setSwitchingToType(newCallType);

        // Navigate and reload after brief delay
        setTimeout(() => {
          // Store state in sessionStorage before reload
          sessionStorage.setItem('callSwitchState', JSON.stringify({
            ...location.state,
            callData: callData,
            switchedFromChat: true,
            autoSwitched: true
          }));

          // Navigate and force reload
          window.location.href = newPath;
        }, 1500);
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
  }, [socket, isConnected, channelName, callEnded, agora, controls, location.state, callData]);

  // Detect provider join
  useEffect(() => {
    if (agora.remoteUsers.length > 0 && !callConnected) {
      setCallConnected(true);
      setIsWaitingForProvider(false);
      setCallStatus("connected");

      if (agora.startSyncedTimer) {
        agora.startSyncedTimer();
      }
    }
  }, [agora.remoteUsers.length, callConnected, agora]);

  // Listen for chat messages and typing indicators
  useEffect(() => {
    if (!agora.chatMessages || agora.chatMessages.length === 0) return;

    const lastMessage = agora.chatMessages[agora.chatMessages.length - 1];

    // Check if message is a typing notification
    if (lastMessage.text && lastMessage.text.startsWith('SYSTEM:TYPING:')) {
      const isTyping = lastMessage.text.split(':')[2] === 'true';
      setIsRemoteTyping(isTyping);
      return;
    }

    // Check if message is a call decline notification
    if (lastMessage.text && lastMessage.text.startsWith('SYSTEM:CALL_DECLINED:')) {
      const reason = lastMessage.text.split(':')[2] || 'No reason provided';
      setDeclineReason(reason);
      setShowDeclinedPopup(true);
      setCallEnded(true);
      setCallStatus("declined");

      setTimeout(() => {
        agora.cleanup();
      }, 500);
    }

    // Check if message is a chat ended notification
    if (lastMessage.text && lastMessage.text.startsWith('SYSTEM:CHAT_ENDED:')) {
      if (!callEnded) {
        console.log('📩 Received chat ended notification from other user');

        setCallConnected(false);
        setCallEnded(true);
        setCallStatus("ended");

        if (ui.setShowChat) {
          ui.setShowChat(false);
        }

        setTimeout(() => {
          agora.cleanup();
        }, 300);

        setTimeout(() => {
          setShowEndCallPopup(true);
        }, 800);
      }
    }

    // Check if message is a call ended notification
    if (lastMessage.text && lastMessage.text.startsWith('SYSTEM:CALL_ENDED:')) {
      if (!callEnded) {
        console.log('📞 Received call ended notification from other user');

        controls.stopRecording?.();
        setCallConnected(false);
        setCallEnded(true);
        setCallStatus("ended");

        setTimeout(() => {
          agora.cleanup();
        }, 300);

        setTimeout(() => {
          setShowEndCallPopup(true);
        }, 800);
      }
    }

    // **UPDATED: Check if message is a call type switch notification with reload**
    if (lastMessage.text && lastMessage.text.startsWith('SYSTEM:SWITCH_CALL_TYPE:')) {
      const newCallType = lastMessage.text.split(':')[2];

      console.log(`🔄 Received call type switch notification via chat: ${newCallType}`);

      const currentPath = window.location.pathname;
      const pathParts = currentPath.split('/');

      pathParts[pathParts.length - 1] = newCallType;
      const newPath = pathParts.join('/');

      setIsSwitchingCallType(true);
      setSwitchingToType(newCallType);

      setTimeout(() => {
        // Store state in sessionStorage before reload
        sessionStorage.setItem('callSwitchState', JSON.stringify({
          ...location.state,
          callData: callData,
          switchedFromChat: true,
          autoSwitched: true
        }));

        // Navigate and force reload
        window.location.href = newPath;
      }, 1500);
    }
  }, [agora.chatMessages, agora, callEnded, ui, controls, location.state, callData]);

  // Track waiting time
  useEffect(() => {
    let interval;
    if ((isWaitingForProvider || isWaitingForProviderInChat) && !callEnded) {
      interval = setInterval(() => setWaitingTime((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isWaitingForProvider, isWaitingForProviderInChat, callEnded]);

  // Auto-decline if provider doesn't join within 2 minutes
  useEffect(() => {
    const shouldStartTimer =
      (isWaitingForProvider || isWaitingForProviderInChat) &&
      !callConnected &&
      !callEnded &&
      userRole === "user";

    if (!shouldStartTimer) return;

    console.log("⏰ Auto-decline timer STARTED (2 minutes)");

    const timer = setTimeout(() => {
      console.log("⏳ Auto-decline TRIGGERED (2 minutes passed)");

      const autoDeclineReason = "Provider did not respond within 2 minutes";
      setDeclineReason(autoDeclineReason);
      setShowDeclinedPopup(true);
      setCallEnded(true);
      setCallStatus("declined");

      if (agora?.cleanup) {
        agora.cleanup();
      }

      const token = localStorage.getItem("token");
      if (token) {
        fetch(`${process.env.REACT_APP_API_URL}/notifications/auto-decline-call/${channelName}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reason: autoDeclineReason,
            callType,
            waitingTime: 120,
          }),
        })
          .then(() => console.log("📡 Auto-decline sent to backend"))
          .catch((error) => console.error("❌ Auto-decline error:", error));
      }
    }, 120000);

    return () => {
      clearTimeout(timer);
      console.log("🛑 Auto-decline timer CLEARED");
    };
  }, [
    isWaitingForProvider,
    isWaitingForProviderInChat,
    callConnected,
    callEnded,
    userRole,
    channelName,
    callType,
    agora
  ]);

  // Format timer for display
  const formatTimer = useCallback((seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Handle typing notification
  const handleTypingChange = useCallback((isTyping) => {
    if (agora.sendMessage) {
      try {
        const typingMessage = `SYSTEM:TYPING:${isTyping}`;
        agora.sendMessage(typingMessage);
      } catch (error) {
        console.error('Error sending typing status:', error);
      }
    }
  }, [agora]);

  // **UPDATED: Function to switch from chat to audio call with reload**
  const handleAudioCallFromChat = useCallback(async () => {
    console.log('🎙️ Switching from chat to audio call');

    try {
      // Send notification via chat message
      if (agora.sendMessage) {
        await agora.sendMessage('SYSTEM:SWITCH_CALL_TYPE:audio');
      }

      // Also emit via Socket.IO for redundancy
      if (socket && isConnected) {
        socket.emit('switch-call-type', {
          channelName,
          newCallType: 'audio',
          userId: callData?.userId,
          providerId: callData?.providerId
        });
      }

      // Show switching overlay
      setIsSwitchingCallType(true);
      setSwitchingToType('audio');

      // Extract the base URL without the callType
      const currentPath = window.location.pathname;
      const pathParts = currentPath.split('/');

      // Remove the last part (current callType) and add 'audio'
      pathParts[pathParts.length - 1] = 'audio';
      const newPath = pathParts.join('/');

      // Navigate and reload after delay
      setTimeout(() => {
        // Store state in sessionStorage before reload
        sessionStorage.setItem('callSwitchState', JSON.stringify({
          ...location.state,
          callData: callData,
          switchedFromChat: true
        }));

        // Navigate and force reload
        window.location.href = newPath;
      }, 1500);

    } catch (error) {
      console.error('Error switching to audio call:', error);
      setIsSwitchingCallType(false);
    }
  }, [location.state, callData, agora, socket, isConnected, channelName]);

  // **UPDATED: Function to switch from chat to video call with reload**
  const handleVideoCallFromChat = useCallback(async () => {
    console.log('📹 Switching from chat to video call');

    try {
      // Send notification via chat message
      if (agora.sendMessage) {
        await agora.sendMessage('SYSTEM:SWITCH_CALL_TYPE:video');
      }

      // Also emit via Socket.IO for redundancy
      if (socket && isConnected) {
        socket.emit('switch-call-type', {
          channelName,
          newCallType: 'video',
          userId: callData?.userId,
          providerId: callData?.providerId
        });
      }

      // Show switching overlay
      setIsSwitchingCallType(true);
      setSwitchingToType('video');

      // Extract the base URL without the callType
      const currentPath = window.location.pathname;
      const pathParts = currentPath.split('/');

      // Remove the last part (current callType) and add 'video'
      pathParts[pathParts.length - 1] = 'video';
      const newPath = pathParts.join('/');

      // Navigate and reload after delay
      setTimeout(() => {
        // Store state in sessionStorage before reload
        sessionStorage.setItem('callSwitchState', JSON.stringify({
          ...location.state,
          callData: callData,
          switchedFromChat: true
        }));

        // Navigate and force reload
        window.location.href = newPath;
      }, 1500);

    } catch (error) {
      console.error('Error switching to video call:', error);
      setIsSwitchingCallType(false);
    }
  }, [location.state, callData, agora, socket, isConnected, channelName]);

  // End chat logic
  const endChat = useCallback(async () => {
    try {
      console.log('💬 Ending chat session');

      if (agora.sendMessage) {
        await agora.sendMessage('SYSTEM:CHAT_ENDED:Chat session has ended');
      }

      await new Promise(resolve => setTimeout(resolve, 300));

      setCallConnected(false);
      setCallEnded(true);
      setCallStatus("ended");

      if (ui.setShowChat) {
        ui.setShowChat(false);
      }

      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/notifications/end-chat/${channelName}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              callDuration: agora.callDuration,
              callType,
              totalCharged: billing.totalCharged
            })
          });

          if (response.ok) {
            console.log('✅ Billing finalized successfully');
          }
        } catch (error) {
          console.error('Error finalizing billing:', error);
        }
      }

      agora.cleanup();

      setTimeout(() => {
        setShowEndCallPopup(true);
      }, 500);

    } catch (error) {
      console.error('Error ending chat:', error);
      setShowEndCallPopup(true);
    }
  }, [agora, channelName, callType, billing.totalCharged, ui]);

  // End call logic
  const endCall = useCallback(async () => {
    try {
      console.log('📞 Ending call session');

      controls.stopRecording?.();

      if (agora.sendMessage) {
        await agora.sendMessage('SYSTEM:CALL_ENDED:Call session has ended');
      }

      await new Promise(resolve => setTimeout(resolve, 300));

      setCallConnected(false);
      setCallEnded(true);
      setCallStatus("ended");

      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/notifications/end-call/${channelName}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              callDuration: agora.callDuration,
              callType,
              totalCharged: billing.totalCharged
            })
          });

          if (response.ok) {
            console.log('✅ Call billing finalized successfully');
          }
        } catch (error) {
          console.error('Error finalizing call billing:', error);
        }
      }

      agora.cleanup();

      setTimeout(() => {
        setShowEndCallPopup(true);
      }, 500);

    } catch (error) {
      console.error('Error ending call:', error);
      setShowEndCallPopup(true);
    }
  }, [controls, agora, channelName, callType, billing.totalCharged]);

  const handleConfirmExit = useCallback(() => {
    setShowExitConfirmation(false);

    if (isChatMode) {
      endChat();
    } else {
      endCall();
    }

    setTimeout(() => {
      navigate("/services");
    }, 500);
  }, [isChatMode, endChat, endCall, navigate]);

  const handleCancelExit = useCallback(() => {
    setShowExitConfirmation(false);
    window.history.pushState(null, '', window.location.pathname);
  }, []);

  const handleShareExperience = useCallback(() => {
    setShowEndCallPopup(false);
    navigate("/feedback", {
      state: {
        callDuration: agora.callDuration,
        channelName,
        callType,
        callData,
        totalCharged: billing.totalCharged,
      },
    });
  }, [navigate, agora.callDuration, channelName, callType, callData, billing.totalCharged]);

  const handleClosePopup = useCallback(() => {
    setShowEndCallPopup(false);

    if (userRole === "provider" || userRole === "admin") {
      navigate("/");
    } else if (userRole === "user") {
      navigate("/services");
    } else {
      navigate("/");
    }
  }, [navigate, userRole]);

  const handleRecharge = useCallback(() => billing.navigateToWallet(), [billing]);

  const handleChatClose = useCallback(() => {
    if (!isChatMode) {
      ui.setShowChat(false);
    }
  }, [isChatMode, ui]);

  const formatWaitingTime = useCallback(() => {
    const m = Math.floor(waitingTime / 60);
    const s = waitingTime % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }, [waitingTime]);

  const handleCallSameProvider = useCallback(() => {
    setShowDeclinedPopup(false);

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
  }, [callData, callType, navigate]);

  const LoadingScreen = useMemo(() => {
    if (!agora.isLoading) return null;
    return (
      <div className="call-loading-screen">
        <div className="call-loading-content">
          <div className="call-spinner" />
          <p className="call-loading-title">Joining {isChatMode ? 'chat' : 'call'}...</p>
          <p className="call-loading-status">Status: {agora.connectionState}</p>
          <div className="call-status-badge">
            <div className="call-status-dot" />
            <span>Connecting...</span>
          </div>
        </div>
      </div>
    );
  }, [agora.isLoading, agora.connectionState, isChatMode]);

  const containerClass = isChatMode ? 'call-container call-mode-chat' : 'call-container';

  const getUserDisplayInfo = (userRole) => {
    switch (userRole) {
      case 'provider':
        return { name: 'Happiness Executive', initial: 'H' };
      case 'user':
        return { name: 'You', initial: 'Y' };
      default:
        return { name: 'User', initial: 'U' };
    }
  };

  const displayInfo = getUserDisplayInfo(callData?.userRole);

  return (
    <div className={containerClass}>
      {LoadingScreen}

      {/* Switching Call Type Overlay */}
      {isSwitchingCallType && (
        <div className="switching-overlay">
          <div className="switching-icon">
            {switchingToType === 'audio' ? '🎙️' : '📹'}
          </div>
          <h2 className="switching-title">
            Switching to {switchingToType === 'audio' ? 'Audio' : 'Video'} Call
          </h2>
          <p className="switching-message">
            Please wait while we prepare your {switchingToType} call...
          </p>
        </div>
      )}

      {/* Chat Mode Header */}
      {isChatMode && (
        <div className="chat-mode-header">
          <div className="chat-mode-header-content">
            <div className="chat-mode-avatar">
              {displayInfo.initial}
            </div>
            <div className="chat-mode-user-info">
              <h3>{displayInfo.name}</h3>
              <p>{callConnected ? 'Online' : 'Connecting...'}</p>
            </div>
          </div>

          <div className="chat-mode-actions">
            {/* Audio Call Button */}
            <button
              className="chat-mode-call-button audio"
              onClick={handleAudioCallFromChat}
              disabled={callEnded || !callConnected || isSwitchingCallType}
              title="Switch to Audio Call"
            >
              <FiPhone />
            </button>

            {/* Video Call Button */}
            <button
              className="chat-mode-call-button video"
              onClick={handleVideoCallFromChat}
              disabled={callEnded || !callConnected || isSwitchingCallType}
              title="Switch to Video Call"
            >
              <FiVideo />
            </button>

            <div className="chat-mode-timer">
              <span>⏱</span>
              <span>{formatTimer(agora.callDuration)}</span>
            </div>

            <button
              className="chat-mode-end-button"
              onClick={endChat}
              disabled={callEnded}
            >
              <span>✕</span>
              End Chat
            </button>
          </div>
        </div>
      )}

      {/* Ready Countdown Overlay */}
      {showReadyDelay && callConnected && (
        <div className="ready-countdown-overlay">
          <div className="ready-countdown-number">
            {Math.ceil((5000 - (Date.now() % 5000)) / 1000)}
          </div>
          <div className="ready-countdown-text">
            Get Ready! {isChatMode ? 'Chat' : 'Call'} starting soon...
          </div>
        </div>
      )}

      {/* Chat Mode Loading Overlay */}
      {isWaitingForProviderInChat && !callEnded && (
        <div className="chat-mode-loading-overlay">
          <div className="chat-loading-spinner"></div>
          <div className="chat-loading-content">
            <h2 className="chat-loading-title">Waiting for Happiness Executive</h2>
            <p className="chat-loading-message">
              Your chat request has been sent. A happiness executive will join shortly to assist you.
            </p>
            <div className="chat-loading-status">
              <div className="chat-loading-pulse-dot"></div>
              <span>Waiting... {formatWaitingTime()}</span>
            </div>
            {waitingTime > 60 && (
              <p className="chat-loading-timeout-warning">
                Auto-declining in {120 - waitingTime} seconds if no response...
              </p>
            )}
          </div>
        </div>
      )}

      {/* Chat Sidebar */}
      <div className={`call-chat-sidebar ${(ui.showChat && !callEnded) || isChatMode ? 'open' : ''}`}>
        <ChatPanel
          chatMessages={filteredChatMessages}
          chatInput={agora.chatInput}
          setChatInput={agora.setChatInput}
          sendMessage={agora.sendMessage}
          remoteUsers={agora.remoteUsers}
          onClose={handleChatClose}
          currentUserId={userRole === 'user' ? 'local' : 'remote'}
          isWaitingForProvider={isWaitingForProviderInChat}
          isRemoteTyping={isRemoteTyping}
          onTypingChange={handleTypingChange}
        />
      </div>

      {/* Main Content for non-chat modes */}
      {!isChatMode && (
        <div className={`call-main-content ${ui.showChat && !callEnded ? 'chat-open' : ''}`}>
          {!callEnded && (
            <div className="call-status-indicator">
              <div className={`call-status-badge-top ${callStatus}`}>
                <div className="call-status-dot-indicator" />
                <span>
                  {callStatus === "connected" && "Connected"}
                  {callStatus === "waiting" && `Waiting for provider... ${formatWaitingTime()}`}
                  {callStatus === "alone" && "No participants yet"}
                </span>
                {callStatus === "waiting" && waitingTime > 60 && (
                  <span className="waiting-timeout-warning">
                    {' '}(Auto-declining in {120 - waitingTime}s)
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="call-layout-wrapper">
            <CallLayout
              agora={agora}
              controls={controls}
              ui={ui}
              callType={callType}
              isWaitingForProvider={isWaitingForProvider}
              waitingTime={waitingTime}
              callStatus={callStatus}
              callEnded={callEnded}
              onEndCall={endCall}
              billing={billing}
            />
          </div>

          {!callEnded && (
            <div className="call-control-wrapper">
              <ControlPanel
                controls={controls}
                ui={ui}
                callType={callType}
                chatMessages={agora.chatMessages}
                callStatus={callStatus}
                onEndCall={endCall}
                callData={callData}
              />
            </div>
          )}
        </div>
      )}

      <LowBalanceWarning
        isOpen={billing.lowBalanceWarning && !callEnded}
        onRecharge={handleRecharge}
        onContinue={billing.continueCall}
        currentBalance={billing.currentBalance}
        requiredAmount={billing.requiredBuffer}
        callRate={billing.callRate}
      />

      {/* Exit Confirmation Popup */}
      {showExitConfirmation && (
        <div className="call-modal-overlay">
          <div className="exit-confirmation-popup">
            <div className="exit-popup-icon">⚠️</div>
            <h2 className="exit-popup-title">Leave Active {isChatMode ? 'Chat' : 'Call'}?</h2>
            <p className="exit-popup-message">
              You are currently {callConnected ? 'connected' : 'in an active session'}.
              {isChatMode ? ' If you leave now, the chat will be ended.' : ' If you leave now, the call will be disconnected.'}
            </p>
            <p className="exit-popup-warning">
              This action will end the {isChatMode ? 'chat' : 'call'} for both participants.
            </p>
            <div className="exit-popup-buttons">
              <button
                className="exit-popup-button exit-popup-button-cancel"
                onClick={handleCancelExit}
              >
                <span>←</span>
                Stay in {isChatMode ? 'Chat' : 'Call'}
              </button>
              <button
                className="exit-popup-button exit-popup-button-confirm"
                onClick={handleConfirmExit}
              >
                <span>✕</span>
                End & Leave
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Declined Call Popup */}
      {showDeclinedPopup && (
        <div className="call-modal-overlay">
          <div className="declined-popup">
            <div className="declined-popup-icon">⚠️</div>
            <h2 className="declined-popup-title">
              {isChatMode ? 'Chat' : 'Call'} Declined
            </h2>
            <p className="declined-popup-message">
              The happiness executive is currently unavailable to take your {isChatMode ? 'chat' : 'call'}.
            </p>
            {declineReason && (
              <div className="declined-popup-reason">
                Reason: {declineReason}
              </div>
            )}
            <div className="declined-popup-buttons">
              <button
                className="declined-popup-button declined-popup-button-secondary"
                onClick={handleCallSameProvider}
              >
                <span>🔄</span>
                Try Again
              </button>
              <button
                className="declined-popup-button declined-popup-button-primary"
                onClick={() => navigate("/services")}
              >
                Book Another {isChatMode ? 'Chat' : 'Call'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* End Call Popup */}
      {showEndCallPopup && (
        <div className="call-modal-overlay">
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
