import { useRef, useCallback, useEffect } from 'react';

export const useSimpleAudio = () => {
  const audioRef = useRef(null);
  const isPlayingRef = useRef(false);
  const isUnlockedRef = useRef(false);

  useEffect(() => {
    const audio = new Audio('/sounds/ringtone.mp3');
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 1.0;

    audioRef.current = audio;

    // REAL audio unlock
    const unlockAudio = () => {
      if (!audioRef.current || isUnlockedRef.current) return;

      console.log('🔓 User interaction → unlocking audio...');

      audioRef.current.muted = true;

      audioRef.current
        .play()
        .then(() => {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          audioRef.current.muted = false;

          isUnlockedRef.current = true;
          console.log('✅ Audio successfully unlocked!');
        })
        .catch((e) => {
          console.log('Unlock failed', e);
        });
    };

    // Must allow multiple touches until unlocked
    document.addEventListener('pointerdown', unlockAudio);
    document.addEventListener('touchstart', unlockAudio);

    return () => {
      document.removeEventListener('pointerdown', unlockAudio);
      document.removeEventListener('touchstart', unlockAudio);
    };
  }, []);

  // Play ringtone
  const play = useCallback(async () => {
    if (!audioRef.current) return false;

    if (!isUnlockedRef.current) {
      console.warn('🔒 Audio blocked: user has not interacted yet');
      return false;
    }

    try {
      audioRef.current.currentTime = 0;
      await audioRef.current.play();
      isPlayingRef.current = true;
      console.log('🔊 Ringtone playing');
      return true;
    } catch (err) {
      console.error('❌ Audio play error:', err);
      return false;
    }
  }, []);

  // Stop ringtone
  const stop = useCallback(() => {
    if (!audioRef.current || !isPlayingRef.current) return;

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    isPlayingRef.current = false;

    console.log('🔇 Ringtone stopped');
  }, []);

  return { play, stop };
};
