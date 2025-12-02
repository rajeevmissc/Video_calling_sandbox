// hooks/useSimpleAudio.js
import { useRef, useCallback, useEffect } from 'react';

/**
 * Custom hook to manage ringtone playback
 * Simple, reliable audio management without complex state
 */
export const useSimpleAudio = () => {
  const audioRef = useRef(null);
  const isPlayingRef = useRef(false);
  const isUnlockedRef = useRef(false);

  // Initialize audio once
  useEffect(() => {
    const audio = new Audio('/sounds/ringtone.mp3');
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 1.0;
    audioRef.current = audio;

    // Unlock audio on first user gesture (iOS/Chrome requirement)
    const unlockAudio = () => {
      if (isUnlockedRef.current) return;

      const tempAudio = new Audio();
      tempAudio.play().catch(() => {});
      isUnlockedRef.current = true;

      console.log('🔓 Audio unlocked by user gesture');

      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };

    window.addEventListener('click', unlockAudio);
    window.addEventListener('touchstart', unlockAudio);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };
  }, []);

  // Play ringtone
  const play = useCallback(async () => {
    if (!audioRef.current || isPlayingRef.current) {
      console.warn('⚠️ Audio not ready or already playing');
      return false;
    }

    if (!isUnlockedRef.current) {
      console.warn('🔒 Audio blocked - no user interaction yet');
      return false;
    }

    try {
      audioRef.current.currentTime = 0;
      await audioRef.current.play();
      isPlayingRef.current = true;
      console.log('🔊 Ringtone playing');
      return true;
    } catch (error) {
      console.error('❌ Audio play error:', error);
      return false;
    }
  }, []);

  // Stop ringtone
  const stop = useCallback(() => {
    if (!audioRef.current || !isPlayingRef.current) {
      return;
    }

    try {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      isPlayingRef.current = false;
      console.log('🔇 Ringtone stopped');
    } catch (error) {
      console.error('❌ Audio stop error:', error);
    }
  }, []);

  return { play, stop };
};