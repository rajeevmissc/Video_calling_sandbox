import { useRef, useCallback, useEffect, useMemo } from "react";

export const useAudioManager = () => {
  const audioRef = useRef(null);
  const isInitializedRef = useRef(false);
  const playbackAttemptsRef = useRef(new Map());
  const isUnlockedRef = useRef(false);

  // Stable audio URLs
  const audioUrls = useMemo(
    () => ({
      ringtone: "/sounds/ringtone.mp3", // ⚡ use local stable sound
      chat: "/sounds/ringtone.mp3",
    }),
    []
  );

  // 🔓 Unlock audio on first user gesture (Chrome/Safari autoplay fix)
  useEffect(() => {
    const unlock = () => {
      if (isUnlockedRef.current) return;

      const temp = new Audio();
      temp.play().catch(() => {});
      isUnlockedRef.current = true;

      console.log("🔓 Audio unlocked by user gesture");

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

  // Initialize audio
  const initializeAudio = useCallback(() => {
    if (isInitializedRef.current) {
      console.warn("⚠️ Audio already initialized");
      return;
    }

    try {
      const callAudio = new Audio();
      callAudio.preload = "auto";
      callAudio.loop = true;
      callAudio.volume = 1.0;

      const chatAudio = new Audio();
      chatAudio.preload = "auto";
      chatAudio.loop = false;
      chatAudio.volume = 1.0;

      audioRef.current = { call: callAudio, chat: chatAudio };
      isInitializedRef.current = true;

      console.log("🎧 Audio initialized");

      // ⚡ pre-decode trick (buffers the audio silently)
      Object.values(audioRef.current).forEach(async (audio) => {
        try {
          audio.src = audioUrls.ringtone;
          await audio.play();
          audio.pause();
          audio.currentTime = 0;
        } catch {}
      });
    } catch (error) {
      console.error("❌ Failed to initialize audio:", error);
    }
  }, [audioUrls]);

  // Cleanup audio
  const cleanupAudio = useCallback(() => {
    if (!audioRef.current) return;

    try {
      Object.values(audioRef.current).forEach((audio) => {
        if (audio) {
          audio.pause();
          audio.src = "";
          audio.load();
        }
      });

      audioRef.current = null;
      isInitializedRef.current = false;
      playbackAttemptsRef.current.clear();

      console.log("🧹 Audio fully cleaned");
    } catch (e) {
      console.error("❌ Cleanup error:", e);
    }
  }, []);

  // Load source with retry
  const loadAudioSource = useCallback(
    async (audio, audioType) => {
      const maxRetries = 2;
      const attempts = playbackAttemptsRef.current.get(audioType) || 0;

      if (attempts >= maxRetries) {
        console.error(`❌ Max retry attempts for ${audioType}`);
        return false;
      }

      try {
        if (!audio.src || audio.error) {
          audio.src =
            audioUrls[audioType === "call" ? "ringtone" : "chat"];

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
              reject(new Error("Audio load failed"));
            };

            audio.load();
          });
        }

        playbackAttemptsRef.current.set(audioType, 0);
        return true;
      } catch (e) {
        playbackAttemptsRef.current.set(audioType, attempts + 1);
        console.warn(`Retry loading audio (${attempts + 1})`);
        return false;
      }
    },
    [audioUrls]
  );

  // Play sound
  const playSound = useCallback(
    async (mode) => {
      if (!audioRef.current || !isInitializedRef.current) {
        console.warn("⚠️ Audio not initialized");
        return false;
      }

      if (!isUnlockedRef.current) {
        console.warn("🔒 Audio blocked (no user interaction)");
        return false;
      }

      const type = mode === "chat" ? "chat" : "call";
      const audio = audioRef.current[type];

      try {
        Object.values(audioRef.current).forEach((a) => {
          if (a !== audio) {
            a.pause();
            a.currentTime = 0;
          }
        });

        const loaded = await loadAudioSource(audio, type);
        if (!loaded) return false;

        audio.currentTime = 0;
        await audio.play();

        console.log(`🔊 Playing ${type}`);
        return true;
      } catch (e) {
        console.error(`❌ Playback error:`, e);
        return false;
      }
    },
    [loadAudioSource]
  );

  const stopSound = useCallback(() => {
    if (!audioRef.current) return;

    Object.values(audioRef.current).forEach((a) => {
      if (a) {
        a.pause();
        a.currentTime = 0;
      }
    });

    console.log("🔇 All audio stopped");
  }, []);

  const pauseSound = useCallback((mode) => {
    if (!audioRef.current) return;

    const type = mode === "chat" ? "chat" : "call";
    const audio = audioRef.current[type];

    try {
      audio.pause();
      console.log(`⏸ Paused ${type}`);
    } catch {}
  }, []);

  return {
    initializeAudio,
    cleanupAudio,
    playSound,
    stopSound,
    pauseSound,
  };
};
