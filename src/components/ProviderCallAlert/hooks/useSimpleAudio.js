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




// import { useRef, useCallback, useEffect } from 'react';

// export const useSimpleAudio = () => {
//   const audioRef = useRef(null);
//   const isPlayingRef = useRef(false);
//   const isUnlockedRef = useRef(false);

//   useEffect(() => {
//     // ✅ CHANGE 1: Use CDN URL instead of local file
//     const audio = new Audio('https://commondatastorage.googleapis.com/codeskulptor-assets/Epoq-Lepidoptera.ogg');
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
//           window.audioUnlocked = true; // ✅ CHANGE 2: Set global flag
//           console.log('✅ Audio successfully unlocked!');
//         })
//         .catch((e) => {
//           console.log('Unlock failed', e);
//         });
//     };

//     // ✅ CHANGE 3: Add more unlock triggers
//     document.addEventListener('pointerdown', unlockAudio);
//     document.addEventListener('touchstart', unlockAudio, { passive: true });
//     document.addEventListener('click', unlockAudio);
//     document.addEventListener('keydown', unlockAudio);

//     return () => {
//       document.removeEventListener('pointerdown', unlockAudio);
//       document.removeEventListener('touchstart', unlockAudio);
//       document.removeEventListener('click', unlockAudio);
//       document.removeEventListener('keydown', unlockAudio);
//     };
//   }, []);

//   // Play ringtone
//   const play = useCallback(async () => {
//     if (!audioRef.current) return false;

//     // ✅ CHANGE 4: Check multiple unlock sources
//     const isUnlocked = isUnlockedRef.current || window.audioUnlocked || sessionStorage.getItem('callAlertsEnabled') === 'true';

//     if (!isUnlocked) {
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

//   // Stop ringtone - NO CHANGES
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

  useEffect(() => {
    const audio = new Audio('https://commondatastorage.googleapis.com/codeskulptor-assets/Epoq-Lepidoptera.ogg');
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 1.0;
    audioRef.current = audio;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // ✅ ADD THIS: Manual unlock function
  const unlock = useCallback(async () => {
    if (!audioRef.current) return false;

    try {
      audioRef.current.muted = true;
      await audioRef.current.play();
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.muted = false;
      
      sessionStorage.setItem('audioUnlocked', 'true');
      console.log('✅ Audio unlocked!');
      return true;
    } catch (e) {
      console.error('❌ Unlock failed:', e);
      return false;
    }
  }, []);

  const play = useCallback(async () => {
    if (!audioRef.current) return false;

    const isUnlocked = sessionStorage.getItem('audioUnlocked') === 'true';
    
    if (!isUnlocked) {
      console.warn('🔒 Audio blocked');
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

  const stop = useCallback(() => {
    if (!audioRef.current || !isPlayingRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    isPlayingRef.current = false;
    console.log('🔇 Ringtone stopped');
  }, []);

  return { play, stop, unlock }; // ✅ EXPORT unlock
};