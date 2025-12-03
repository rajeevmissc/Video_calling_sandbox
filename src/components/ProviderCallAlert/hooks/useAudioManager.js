import { useRef, useCallback, useEffect, useMemo } from "react";

export const useAudioManager = () => {
  const audioRef = useRef(null);
  const isInitializedRef = useRef(false);
  const isUnlockedRef = useRef(false);
  const playbackAttemptsRef = useRef(new Map());

  // Stable audio paths
  const audioUrls = useMemo(
    () => ({
      ringtone: "/sounds/ringtone.mp3",
      chat: "/sounds/chat.mp3"
    }),
    []
  );

  // ---------------------------------------
  // 🔓 REAL AUDIO UNLOCK (Chrome/iOS fix)
  // ---------------------------------------
  useEffect(() => {
    const unlock = () => {
      if (!audioRef.current || isUnlockedRef.current) return;

      try {
        Object.values(audioRef.current).forEach((a) => {
          a.muted = true;

          a.play()
            .then(() => {
              a.pause();
              a.currentTime = 0;
              a.muted = false;
            })
            .catch(() => {});
        });

        isUnlockedRef.current = true;
        console.log("🔓 Audio fully unlocked");
      } catch (e) {
        console.log("Unlock failed:", e);
      }

      window.removeEventListener("click", unlock);
      window.removeEventListener("touchstart", unlock);
    };

    window.addEventListener("click", unlock);
    window.addEventListener("touchstart", unlock);

    return () => {
      window.removeEventListener("click", unlock);
      window.removeEventListener("touchstart", unlock);
    };
  }, []);

  // ---------------------------------------
  // 🎧 Initialize all audio elements
  // ---------------------------------------
  const initializeAudio = useCallback(() => {
    if (isInitializedRef.current) return;

    try {
      const callAudio = new Audio();
      callAudio.preload = "auto";
      callAudio.loop = true;
      callAudio.volume = 1;
      callAudio.src = audioUrls.ringtone;
      callAudio.load();

      const chatAudio = new Audio();
      chatAudio.preload = "auto";
      chatAudio.loop = false;
      chatAudio.volume = 1;
      chatAudio.src = audioUrls.chat;
      chatAudio.load();

      audioRef.current = { call: callAudio, chat: chatAudio };
      isInitializedRef.current = true;

      console.log("🎧 Audio initialized");
    } catch (err) {
      console.error("❌ Audio init failed:", err);
    }
  }, [audioUrls]);

  // Auto-initialize on mount
  useEffect(() => {
    initializeAudio();
  }, [initializeAudio]);

  // ---------------------------------------
  // 🎵 Load source with retry
  // ---------------------------------------
  const loadAudioSource = useCallback(
    async (audio, type) => {
      const maxRetries = 2;
      const attempts = playbackAttemptsRef.current.get(type) || 0;

      if (attempts >= maxRetries) {
        console.error(`❌ Max retries reached for ${type}`);
        return false;
      }

      try {
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(
            () => reject(new Error("Audio load timeout")),
            3000
          );

          audio.oncanplaythrough = () => {
            clearTimeout(timeout);
            resolve();
          };

          audio.onerror = () => {
            clearTimeout(timeout);
            reject(new Error("Audio load error"));
          };

          audio.load();
        });

        playbackAttemptsRef.current.set(type, 0);
        return true;
      } catch (e) {
        playbackAttemptsRef.current.set(type, attempts + 1);
        console.warn(`Retry loading ${type} (${attempts + 1})`);
        return false;
      }
    },
    []
  );

  // ---------------------------------------
  // ▶️ PLAY SOUND
  // ---------------------------------------
  const playSound = useCallback(
    async (mode) => {
      if (!audioRef.current || !isInitializedRef.current) {
        console.warn("⚠️ Audio not initialized");
        return false;
      }

      if (!isUnlockedRef.current) {
        console.warn("🔒 Audio blocked until user interacts");
        return false;
      }

      const type = mode === "chat" ? "chat" : "call";
      const audio = audioRef.current[type];

      // Pause all other audio tracks
      Object.values(audioRef.current).forEach((a) => {
        if (a !== audio) {
          a.pause();
          a.currentTime = 0;
        }
      });

      const loaded = await loadAudioSource(audio, type);
      if (!loaded) return false;

      try {
        audio.currentTime = 0;
        await audio.play();

        console.log(`🔊 Playing ${type}`);
        return true;
      } catch (e) {
        console.error(`❌ Playback error (${type})`, e);
        return false;
      }
    },
    [loadAudioSource]
  );

  // ---------------------------------------
  // ⏹ STOP SOUND
  // ---------------------------------------
  const stopSound = useCallback(() => {
    if (!audioRef.current) return;

    Object.values(audioRef.current).forEach((a) => {
      a.pause();
      a.currentTime = 0;
    });

    console.log("🔇 All audio stopped");
  }, []);

  // ---------------------------------------
  // ⏸ PAUSE SPECIFIC
  // ---------------------------------------
  const pauseSound = useCallback((mode) => {
    if (!audioRef.current) return;

    const type = mode === "chat" ? "chat" : "call";
    const audio = audioRef.current[type];

    try {
      audio.pause();
      console.log(`⏸ Paused ${type}`);
    } catch {}
  }, []);

  // ---------------------------------------
  // 🧹 CLEANUP
  // ---------------------------------------
  const cleanupAudio = useCallback(() => {
    if (!audioRef.current) return;

    Object.values(audioRef.current).forEach((audio) => {
      audio.pause();
      audio.src = "";
      audio.load();
    });

    audioRef.current = null;
    isInitializedRef.current = false;
    playbackAttemptsRef.current.clear();

    console.log("🧹 Audio cleaned");
  }, []);

  return {
    initializeAudio,
    playSound,
    stopSound,
    pauseSound,
    cleanupAudio
  };
};
