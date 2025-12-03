// import { useRef, useCallback, useEffect } from 'react';

// export const useSimpleAudio = () => {
//   const audioRef = useRef(null);
//   const isPlayingRef = useRef(false);
//   const isUnlockedRef = useRef(false);

//   useEffect(() => {
//     const audio = new Audio('/sounds/ringtone.mp3');
//     audio.loop = true;
//     audio.preload = 'auto';
//     audio.volume = 1.0;

//     audioRef.current = audio;

//     // REAL audio unlock
//     const unlockAudio = () => {
//       if (!audioRef.current || isUnlockedRef.current) return;

//       console.log('🔓 User interaction → unlocking audio...');

//       audioRef.current.muted = true;

//       audioRef.current
//         .play()
//         .then(() => {
//           audioRef.current.pause();
//           audioRef.current.currentTime = 0;
//           audioRef.current.muted = false;

//           isUnlockedRef.current = true;
//           console.log('✅ Audio successfully unlocked!');
//         })
//         .catch((e) => {
//           console.log('Unlock failed', e);
//         });
//     };

//     // Must allow multiple touches until unlocked
//     document.addEventListener('pointerdown', unlockAudio);
//     document.addEventListener('touchstart', unlockAudio);

//     return () => {
//       document.removeEventListener('pointerdown', unlockAudio);
//       document.removeEventListener('touchstart', unlockAudio);
//     };
//   }, []);

//   // Play ringtone
//   const play = useCallback(async () => {
//     if (!audioRef.current) return false;

//     if (!isUnlockedRef.current) {
//       console.warn('🔒 Audio blocked: user has not interacted yet');
//       return false;
//     }

//     try {
//       audioRef.current.currentTime = 0;
//       await audioRef.current.play();
//       isPlayingRef.current = true;
//       console.log('🔊 Ringtone playing');
//       return true;
//     } catch (err) {
//       console.error('❌ Audio play error:', err);
//       return false;
//     }
//   }, []);

//   // Stop ringtone
//   const stop = useCallback(() => {
//     if (!audioRef.current || !isPlayingRef.current) return;

//     audioRef.current.pause();
//     audioRef.current.currentTime = 0;
//     isPlayingRef.current = false;

//     console.log('🔇 Ringtone stopped');
//   }, []);

//   return { play, stop };
// };





import { useRef, useCallback, useEffect } from 'react';

export const useSimpleAudio = () => {
  const audioRef = useRef(null);
  const isPlayingRef = useRef(false);
  const isUnlockedRef = useRef(false);

  useEffect(() => {
    // Use working CDN audio URL
    const audio = new Audio('https://commondatastorage.googleapis.com/codeskulptor-assets/Epoq-Lepidoptera.ogg');
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 1.0;
    
    // Add error handler
    audio.addEventListener('error', (e) => {
      console.error('❌ Audio loading failed:', e);
    });
    
    // Add loaded handler
    audio.addEventListener('canplaythrough', () => {
      console.log('✅ Audio loaded and ready');
    });

    audioRef.current = audio;
    
    // Force load
    audio.load();

    // REAL audio unlock with multiple triggers
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
          console.log('⚠️ Unlock failed', e);
        });
    };

    // Add multiple unlock triggers
    document.addEventListener('pointerdown', unlockAudio);
    document.addEventListener('touchstart', unlockAudio, { passive: true });
    document.addEventListener('click', unlockAudio);
    document.addEventListener('keydown', unlockAudio);

    return () => {
      document.removeEventListener('pointerdown', unlockAudio);
      document.removeEventListener('touchstart', unlockAudio);
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('keydown', unlockAudio);
      
      // Cleanup audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  // Play ringtone with retry logic
  const play = useCallback(async () => {
    if (!audioRef.current) {
      console.error('❌ Audio ref is null');
      return false;
    }

    if (!isUnlockedRef.current) {
      console.warn('🔒 Audio blocked: user has not interacted yet');
      // Try to unlock now
      try {
        await audioRef.current.play();
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        isUnlockedRef.current = true;
        console.log('✅ Audio unlocked on play attempt');
      } catch (e) {
        console.warn('⚠️ Still locked, waiting for user interaction');
        return false;
      }
    }

    try {
      // Ensure audio is ready
      if (audioRef.current.readyState < 2) {
        console.log('⏳ Waiting for audio to load...');
        await new Promise((resolve) => {
          audioRef.current.addEventListener('canplay', resolve, { once: true });
          audioRef.current.load();
        });
      }
      
      audioRef.current.currentTime = 0;
      await audioRef.current.play();
      isPlayingRef.current = true;
      console.log('🔊 Ringtone playing successfully');
      return true;
    } catch (err) {
      console.error('❌ Audio play error:', err.name, err.message);
      
      // Try one more time after a short delay
      try {
        await new Promise(resolve => setTimeout(resolve, 100));
        audioRef.current.currentTime = 0;
        await audioRef.current.play();
        isPlayingRef.current = true;
        console.log('🔊 Ringtone playing (retry successful)');
        return true;
      } catch (retryErr) {
        console.error('❌ Retry failed:', retryErr);
        return false;
      }
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