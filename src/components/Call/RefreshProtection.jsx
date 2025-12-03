import { useEffect, useCallback } from 'react';

/**
 * Minimal Refresh Protection Component
 * Just add this to your Call.jsx - no other changes needed
 * Prevents accidental page refresh/close during active calls
 */
const RefreshProtection = ({ isActive, channelName, callDuration }) => {
  
  // Save duration to sessionStorage (for restoration if refresh happens)
  useEffect(() => {
    if (isActive && callDuration > 0) {
      const state = {
        duration: callDuration,
        timestamp: Date.now(),
        channel: channelName
      };
      sessionStorage.setItem(`call_${channelName}`, JSON.stringify(state));
    }
  }, [isActive, callDuration, channelName]);

  // Show browser warning before refresh/close
  useEffect(() => {
    if (!isActive) return;

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = 'Your call is active. Are you sure you want to leave?';
      return 'Your call is active. Are you sure you want to leave?';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Clean up storage when component unmounts normally
      if (!isActive) {
        sessionStorage.removeItem(`call_${channelName}`);
      }
    };
  }, [isActive, channelName]);

  return null; // This component renders nothing
};

/**
 * Helper function to restore call duration after refresh
 * Call this in useAgora initialization
 */
export const getRestoredDuration = (channelName) => {
  try {
    const saved = sessionStorage.getItem(`call_${channelName}`);
    if (!saved) return 0;
    
    const { duration, timestamp } = JSON.parse(saved);
    const elapsed = Math.floor((Date.now() - timestamp) / 1000);
    
    // Only restore if refresh happened within 10 seconds
    if (elapsed < 10) {
      console.log(`🔄 Restored call duration: ${duration}s`);
      return duration;
    }
    
    // Clean up old data
    sessionStorage.removeItem(`call_${channelName}`);
    return 0;
  } catch (error) {
    console.error('Error restoring duration:', error);
    return 0;
  }
};

export default RefreshProtection;