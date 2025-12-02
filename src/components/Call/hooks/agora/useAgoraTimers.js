// src/hooks/agora/useAgoraTimers.js
import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Manages call duration + synced timer (5s delay after both connected)
 *
 * @param {Object} params
 * @param {React.MutableRefObject<number|null>} params.connectionTimeRef
 * @param {React.MutableRefObject<boolean>} params.timerStartedRef
 * @param {Function} params.sendConnectionTimeMessage
 */
export const useAgoraTimers = ({
  connectionTimeRef,
  timerStartedRef,
  sendConnectionTimeMessage,
}) => {
  const [callDuration, setCallDuration] = useState(0);
  const timerIdRef = useRef(null);

  const startSyncedTimer = useCallback(() => {
    if (timerStartedRef.current) return;

    timerStartedRef.current = true;
    const connectionTimestamp = Date.now();
    connectionTimeRef.current = connectionTimestamp;

    if (typeof sendConnectionTimeMessage === "function") {
      sendConnectionTimeMessage(connectionTimestamp);
    }

    console.log("🕐 Synced timer started at:", connectionTimestamp);
  }, [connectionTimeRef, timerStartedRef, sendConnectionTimeMessage]);

  useEffect(() => {
    timerIdRef.current = setInterval(() => {
      if (connectionTimeRef.current && timerStartedRef.current) {
        const elapsed = Math.floor(
          (Date.now() - connectionTimeRef.current) / 1000
        );
        const adjustedDuration = Math.max(0, elapsed - 5);
        setCallDuration(adjustedDuration);
      } else {
        setCallDuration(0);
      }
    }, 1000);

    return () => {
      if (timerIdRef.current) clearInterval(timerIdRef.current);
    };
  }, [connectionTimeRef, timerStartedRef]);

  return {
    callDuration,
    startSyncedTimer,
  };
};
