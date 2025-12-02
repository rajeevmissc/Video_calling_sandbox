// import { useEffect, useRef } from 'react';
// import { TIMING, CALL_STATUS } from '../utils/constants';
// import { sendAutoDeclineNotification } from '../utils/callHelpers';

// /**
//  * Custom hook to manage call timers (waiting time, auto-decline)
//  */
// export const useCallTimers = ({
//   isWaitingForProvider,
//   isWaitingForProviderInChat,
//   callConnected,
//   callEnded,
//   userRole,
//   channelName,
//   callType,
//   agora,
//   setWaitingTime,
//   setDeclineReason,
//   setShowDeclinedPopup,
//   setCallEnded,
//   setCallStatus
// }) => {

//   // Track waiting time
//   useEffect(() => {
//     let interval;
//     if ((isWaitingForProvider || isWaitingForProviderInChat) && !callEnded) {
//       interval = setInterval(() => setWaitingTime((t) => t + 1), 1000);
//     }
//     return () => clearInterval(interval);
//   }, [isWaitingForProvider, isWaitingForProviderInChat, callEnded, setWaitingTime]);

  
//   // ======================================================
//   //  AUTO DECLINE TIMER — RUNS EXACTLY ONCE (2 minutes)
//   // ======================================================
  
//   const autoDeclineStartedAt = useRef(null); // prevents re-starting
//   const autoDeclineTimerRef = useRef(null);

//   useEffect(() => {
//     const shouldStartTimer =
//       (isWaitingForProvider || isWaitingForProviderInChat) &&
//       !callConnected &&
//       !callEnded &&
//       userRole === "user";

//     if (!shouldStartTimer) return;

//     // 🔐 Start the timer only ONCE
//     if (!autoDeclineStartedAt.current) {
//       autoDeclineStartedAt.current = Date.now();
//       console.log("⏰ Auto-decline timer STARTED (2 minutes)");

//       autoDeclineTimerRef.current = setTimeout(() => {
//         console.log("⏳ Auto-decline TRIGGERED (2 minutes passed)");

//         const reason = "Provider did not respond within 2 minutes";
//         setDeclineReason(reason);
//         setShowDeclinedPopup(true);
//         setCallEnded(true);
//         setCallStatus(CALL_STATUS.DECLINED);

//         if (agora?.cleanup) {
//           agora.cleanup();
//         }

//         sendAutoDeclineNotification(channelName, callType, 120);

//       }, TIMING.AUTO_DECLINE_TIMEOUT);
//     }

//     return () => {
//       // DO NOT clear timeout unless call ends
//       if (callEnded) {
//         clearTimeout(autoDeclineTimerRef.current);
//       }
//     };

//   }, [
//     isWaitingForProvider,
//     isWaitingForProviderInChat,
//     callConnected,
//     callEnded,
//     userRole,
//     channelName,
//     callType,
//     agora,
//     setDeclineReason,
//     setShowDeclinedPopup,
//     setCallEnded,
//     setCallStatus
//   ]);

  
//   // Reset timer when call ends
//   useEffect(() => {
//     if (callEnded) {
//       console.log("🛑 Auto-decline timer RESET");
//       autoDeclineStartedAt.current = null;
//       clearTimeout(autoDeclineTimerRef.current);
//     }
//   }, [callEnded]);
// };





import { useEffect, useRef } from 'react';
import { TIMING, CALL_STATUS } from '../utils/constants';
import { sendAutoDeclineNotification } from '../utils/callHelpers';

/**
 * SAFELY HANDLES:
 *  - Waiting timer
 *  - Auto-decline (ONLY if provider NEVER joined)
 *  - Protects against Agora audio drop / remoteUsers unpublish
 */

export const useCallTimers = ({
  isWaitingForProvider,
  isWaitingForProviderInChat,
  callConnected,
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
}) => {

  // Track waiting time every second — ONLY if STILL waiting
  useEffect(() => {
    let interval;

    const isWaiting =
      !callConnected &&            // provider has not joined
      !callEnded &&                // call still alive
      (isWaitingForProvider || isWaitingForProviderInChat);

    if (isWaiting) {
      interval = setInterval(() => {
        setWaitingTime((t) => t + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [
    isWaitingForProvider,
    isWaitingForProviderInChat,
    callConnected,
    callEnded,
    setWaitingTime
  ]);

  // ---------------------------------------------------------
  //     AUTO DECLINE — FIX: RUN ONLY IF NEVER CONNECTED
  // ---------------------------------------------------------

  const autoDeclineStartedAt = useRef(null);
  const autoDeclineTimerRef = useRef(null);
  const callWasEverConnected = useRef(false);

  // Track if call EVER connected once
  useEffect(() => {
    if (callConnected && !callWasEverConnected.current) {
      callWasEverConnected.current = true;
      console.log("🔵 Call was successfully connected — auto-decline permanently disabled.");
    }
  }, [callConnected]);

  useEffect(() => {
    // 🚫 BLOCK auto-decline once provider has EVER joined
    if (callWasEverConnected.current) {
      return; // auto-decline permanently disabled
    }

    // Should we begin the WAIT countdown?
    const shouldStartTimer =
      !callConnected && // provider has not joined yet
      !callEnded &&
      userRole === "user" &&
      (isWaitingForProvider || isWaitingForProviderInChat);

    if (!shouldStartTimer) return;

    // Start the timer once
    if (!autoDeclineStartedAt.current) {
      autoDeclineStartedAt.current = Date.now();
      console.log("⏰ Auto-decline timer STARTED (2 minutes)");

      autoDeclineTimerRef.current = setTimeout(() => {
        // Check AGAIN before firing auto-decline — provider may join last moment
        if (callWasEverConnected.current || callConnected) {
          console.log("❌ Auto-decline IGNORE — Provider connected last moment.");
          return;
        }

        console.log("⏳ Auto-decline TRIGGERED (Provider never joined)");

        const reason = "Provider did not respond within 2 minutes";

        setDeclineReason(reason);
        setShowDeclinedPopup(true);
        setCallEnded(true);
        setCallStatus(CALL_STATUS.DECLINED);

        if (agora?.cleanup) agora.cleanup();

        sendAutoDeclineNotification(channelName, callType, 120);

      }, TIMING.AUTO_DECLINE_TIMEOUT);
    }

    // Only clear timer if call truly ends
    return () => {
      if (callEnded) {
        clearTimeout(autoDeclineTimerRef.current);
      }
    };

  }, [
    isWaitingForProvider,
    isWaitingForProviderInChat,
    callConnected,
    callEnded,
    userRole,
    channelName,
    callType,
    agora,
    setDeclineReason,
    setShowDeclinedPopup,
    setCallEnded,
    setCallStatus
  ]);

  // Reset timer when call ends
  useEffect(() => {
    if (callEnded) {
      console.log("🛑 Auto-decline timer RESET");
      autoDeclineStartedAt.current = null;
      clearTimeout(autoDeclineTimerRef.current);
    }
  }, [callEnded]);

};
