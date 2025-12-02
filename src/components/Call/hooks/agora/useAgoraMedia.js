// // src/hooks/agora/useAgoraMedia.js

// import { useState, useRef, useCallback } from "react";
// import AgoraRTC from "agora-rtc-sdk-ng";
// import { AIDenoiserExtension } from "agora-extension-ai-denoiser";

// /* ------------------------------------------------------
//    GLOBAL SINGLETON FOR AI NOISE SUPPRESSION EXTENSION
// -------------------------------------------------------- */
// let denoiserInstance = null;

// function getDenoiser() {
//   if (!denoiserInstance) {
//     denoiserInstance = new AIDenoiserExtension({
//       // IMPORTANT: Your WASM files must be here:
//       // public/agora-ai-denoiser/*.wasm
//       assetsPath: "/agora-ai-denoiser",
//     });

//     AgoraRTC.registerExtensions([denoiserInstance]);

//     // If browser cannot load WASM files, log it
//     denoiserInstance.onloaderror = (err) => {
//       console.error("❌ AI Noise Suppression WASM load failed:", err);
//     };

//     // Safari warning
//     if (/Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)) {
//       console.warn("⚠️ Safari AI Noise Suppression is not recommended.");
//     }
//   }

//   return denoiserInstance;
// }

// /* ------------------------------------------------------
//    MAIN MEDIA HOOK
// -------------------------------------------------------- */
// export const useAgoraMedia = ({
//   client,
//   callType,
//   userRole,
//   setError,
//   showNotification,
// }) => {
//   const [localTracks, setLocalTracks] = useState([null, null]); // [audio, video]
//   const [isAudioMuted, setIsAudioMuted] = useState(false);
//   const [isVideoOff, setIsVideoOff] = useState(
//     callType === "audio" || callType === "chat"
//   );
//   const [localVideoReady, setLocalVideoReady] = useState(false);

//   const aiProcessorRef = useRef(null);
//   const screenTrackRef = useRef(null);
//   const videoTrackRef = useRef(null);

//   /* ------------------------------------------------------
//      CREATE & PUBLISH AUDIO/VIDEO TRACKS
//      Including AI Noise Suppression
//   -------------------------------------------------------- */
//   const createAndPublishTracks = useCallback(async () => {
//     let tracks = [null, null]; // [audio, video]

//     try {
//       const denoiser = getDenoiser();

//       /* ------------------------------
//          CHAT MODE (no audio/video)
//       ------------------------------ */
//       if (callType === "chat") {
//         setIsAudioMuted(true);
//         setIsVideoOff(true);
//       }

//       /* ------------------------------
//          AUDIO CALL ONLY
//       ------------------------------ */
//       else if (callType === "audio") {
//         const micTrack = await AgoraRTC.createMicrophoneAudioTrack({
//           AEC: true,
//           ANS: false, // disable browser noise suppression (AI handles it)
//           AGC: true,
//         });

//         // Create AI processor
//         const processor = denoiser.createProcessor();
//         aiProcessorRef.current = processor;

//         // Inject into audio pipeline
//         await micTrack.pipe(processor).pipe(micTrack.processorDestination);

//         await processor.enable();
//         await processor.setMode("NSNG"); // AI noise suppression
//         await processor.setLevel("SOFT"); // Best quality
        
//         // Handle CPU overload
//         processor.onoverload = async (elapsed) => {
//           console.warn("⚠️ AI Denoiser overload!", elapsed);
//           await processor.setMode("STATIONARY_NS");
//           await processor.disable(); // fallback
//         };

//         tracks[0] = micTrack;
//         setIsAudioMuted(false);
//         setIsVideoOff(true);

//         console.log("🎧 AI Noise Suppression ENABLED (audio)");
//       }

//       /* ------------------------------
//          VIDEO CALL
//       ------------------------------ */
//       else if (callType === "video") {
//         const [micTrack, camTrack] =
//           await AgoraRTC.createMicrophoneAndCameraTracks(
//             {
//               AEC: true,
//               ANS: false,
//               AGC: true,
//               encoderConfig: "music_standard",
//             },
//             {
//               encoderConfig: "720p_2",
//               optimizationMode: "detail",
//             }
//           );

//         // Create AI processor
//         const processor = denoiser.createProcessor();
//         aiProcessorRef.current = processor;

//         await micTrack.pipe(processor).pipe(micTrack.processorDestination);

//         await processor.enable();
//         await processor.setMode("NSNG");
//         await processor.setLevel("SOFT");

//         processor.onoverload = async () => {
//           console.warn("⚠️ AI Denoiser overload!");
//           await processor.setMode("STATIONARY_NS");
//           await processor.disable();
//         };

//         tracks[0] = micTrack;
//         tracks[1] = camTrack;

//         setIsAudioMuted(false);
//         setIsVideoOff(false);

//         console.log("🎧 AI Noise Suppression ENABLED (video)");
//       }
//     } catch (err) {
//       console.error("[Media] Track creation error:", err);
//       setError("Failed to initialize audio/video devices.");
//     }

//     /* ------------------------------------------------------
//        ROLE-BASED PUBLISHING
//     -------------------------------------------------------- */
//     try {
//       if (userRole === "user") {
//         if (tracks[1]) {
//           await tracks[1].setEnabled(false);
//           setIsVideoOff(true);
//         }
//         if (tracks[0]) await client.publish([tracks[0]]);
//       } else {
//         if (callType === "video" && tracks[1]) {
//           await client.publish([tracks[0], tracks[1]]);
//         } else if (tracks[0]) {
//           await client.publish([tracks[0]]);
//         }
//       }

//       videoTrackRef.current = tracks[1] || null;
//       setLocalTracks(tracks);
//     } catch (err) {
//       console.error("[Media] Publish error:", err);
//       setError("Failed to publish audio/video streams.");
//     }

//     return tracks;
//   }, [callType, userRole, client, setError]);

//   /* ------------------------------------------------------
//      TOGGLE AUDIO (Mute / Unmute)
//   -------------------------------------------------------- */
//   const toggleAudio = useCallback(async () => {
//     const [micTrack] = localTracks;
//     if (!micTrack) return;

//     const nextState = !isAudioMuted;
//     await micTrack.setEnabled(!nextState);
//     setIsAudioMuted(nextState);
//   }, [localTracks, isAudioMuted]);

//   /* ------------------------------------------------------
//      TOGGLE VIDEO (On / Off)
//   -------------------------------------------------------- */
//   const toggleVideo = useCallback(async () => {
//     const [, camTrack] = localTracks;
//     if (!camTrack) return;

//     const nextOff = !isVideoOff;
//     await camTrack.setEnabled(!nextOff);
//     setIsVideoOff(nextOff);
//   }, [localTracks, isVideoOff]);

//   /* ------------------------------------------------------
//      SCREEN SHARING
//   -------------------------------------------------------- */
//   const startScreenShare = useCallback(async () => {
//     try {
//       const screenTrack = await AgoraRTC.createScreenVideoTrack(
//         { encoderConfig: "1080p_1" },
//         "auto"
//       );

//       screenTrackRef.current = screenTrack;

//       const [, camTrack] = localTracks;
//       if (camTrack) await client.unpublish(camTrack);

//       await client.publish(screenTrack);
//       showNotification?.(
//         { message: "Screen sharing started" },
//         "cameraState"
//       );
//     } catch (err) {
//       console.error("[Media] Screen share start error:", err);
//       setError("Failed to start screen share.");
//     }
//   }, [localTracks]);

//   const stopScreenShare = useCallback(async () => {
//     try {
//       const screenTrack = screenTrackRef.current;
//       if (screenTrack) {
//         await client.unpublish(screenTrack);
//         screenTrack.stop();
//         screenTrack.close();
//         screenTrackRef.current = null;
//       }

//       const [, camTrack] = localTracks;
//       if (camTrack) {
//         await client.publish(camTrack);
//         await camTrack.setEnabled(true);
//         setIsVideoOff(false);
//       }

//       showNotification?.(
//         { message: "Screen sharing stopped" },
//         "cameraState"
//       );
//     } catch (err) {
//       console.error("[Media] Screen share stop error:", err);
//       setError("Failed to stop screen share.");
//     }
//   }, [localTracks]);

//   /* ------------------------------------------------------
//      RETURN HOOK API
//   -------------------------------------------------------- */
//   return {
//     localTracks,
//     isAudioMuted,
//     isVideoOff,
//     localVideoReady,
//     localAudioTrack: localTracks[0],
//     localVideoTrack: localTracks[1],

//     screenTrackRef,
//     videoTrackRef,

//     createAndPublishTracks,
//     toggleAudio,
//     toggleVideo,
//     startScreenShare,
//     stopScreenShare,
//   };
// };








// // src/hooks/agora/useAgoraMedia.js

// import { useState, useRef, useCallback } from "react";
// import AgoraRTC from "agora-rtc-sdk-ng";
// import { AIDenoiserExtension } from "agora-extension-ai-denoiser";

// /* ------------------------------------------------------
//    GLOBAL SINGLETON FOR AI NOISE SUPPRESSION EXTENSION
// -------------------------------------------------------- */
// let denoiserInstance = null;

// function getDenoiser() {
//   if (!denoiserInstance) {
//     denoiserInstance = new AIDenoiserExtension({
//       assetsPath: "/agora-ai-denoiser",
//     });

//     AgoraRTC.registerExtensions([denoiserInstance]);

//     denoiserInstance.onloaderror = (err) => {
//       console.error("❌ AI Noise Suppression WASM load failed:", err);
//     };

//     if (/Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)) {
//       console.warn("⚠️ Safari AI Noise Suppression is not recommended.");
//     }
//   }
//   return denoiserInstance;
// }

// /* ------------------------------------------------------
//    MAIN HOOK
// -------------------------------------------------------- */
// export const useAgoraMedia = ({
//   client,
//   callType,
//   userRole,
//   setError,
//   showNotification,
// }) => {
//   const [localTracks, setLocalTracks] = useState([null, null]);
//   const [isAudioMuted, setIsAudioMuted] = useState(false);
//   const [isVideoOff, setIsVideoOff] = useState(
//     callType === "audio" || callType === "chat"
//   );
//   const [localVideoReady, setLocalVideoReady] = useState(false);

//   const aiProcessorRef = useRef(null);
//   const screenTrackRef = useRef(null);
//   const videoTrackRef = useRef(null);

//   /* ------------------------------------------------------
//      CREATE AND PUBLISH TRACKS
//   -------------------------------------------------------- */
//   const createAndPublishTracks = useCallback(async () => {
//     let tracks = [null, null];

//     try {
//       const denoiser = getDenoiser();

//       /** CHAT MODE */
//       if (callType === "chat") {
//         setIsAudioMuted(true);
//         setIsVideoOff(true);
//       }

//       /** AUDIO CALL */
//       else if (callType === "audio") {
//         const micTrack = await AgoraRTC.createMicrophoneAudioTrack({
//           AEC: true,
//           ANS: false,
//           AGC: true,
//         });

//         const processor = denoiser.createProcessor();
//         aiProcessorRef.current = processor;

//         await micTrack.pipe(processor).pipe(micTrack.processorDestination);
//         await processor.enable();

//         await processor.setMode("NSNG");
//         await processor.setLevel("SOFT");

//         processor.onoverload = async () => {
//           console.warn("⚠️ CPU Overload — disabling AI NS");
//           await processor.disable();
//         };

//         tracks[0] = micTrack;
//         setIsAudioMuted(false);
//         setIsVideoOff(true);

//         console.log("🎧 AI Noise Suppression ENABLED (Audio)");
//       }

//       /** VIDEO CALL */
//       else if (callType === "video") {
//         const [micTrack, camTrack] =
//           await AgoraRTC.createMicrophoneAndCameraTracks(
//             {
//               AEC: true,
//               ANS: false,
//               AGC: true,
//             },
//             {
//               encoderConfig: "720p_2",
//               optimizationMode: "detail",
//             }
//           );

//         const processor = denoiser.createProcessor();
//         aiProcessorRef.current = processor;

//         await micTrack.pipe(processor).pipe(micTrack.processorDestination);
//         await processor.enable();

//         await processor.setMode("NSNG");
//         await processor.setLevel("SOFT");

//         processor.onoverload = async () => {
//           console.warn("⚠️ CPU Overload — disabling AI NS");
//           await processor.disable();
//         };

//         tracks[0] = micTrack;
//         tracks[1] = camTrack;

//         setIsAudioMuted(false);
//         setIsVideoOff(false);
//         setLocalVideoReady(true);

//         console.log("🎧 AI Noise Suppression ENABLED (Video)");
//       }
//     } catch (err) {
//       console.error("[Media] Track creation failed:", err);
//       setError("Failed to initialize audio/video devices.");
//     }

//     /** ROLE-BASED PUBLISH */
//     try {
//       if (userRole === "user") {
//         if (tracks[1]) {
//           await tracks[1].setEnabled(false);
//           setIsVideoOff(true);
//         }
//         if (tracks[0]) await client.publish([tracks[0]]);
//       } else {
//         if (callType === "video" && tracks[1]) {
//           await client.publish([tracks[0], tracks[1]]);
//         } else {
//           await client.publish([tracks[0]]);
//         }
//       }

//       videoTrackRef.current = tracks[1] || null;
//       setLocalTracks(tracks);
//     } catch (err) {
//       console.error("[Media] Publish error:", err);
//       setError("Failed to publish tracks.");
//     }

//     return tracks;
//   }, [callType, userRole, client, setError]);

//   /* ------------------------------------------------------
//      AUDIO TOGGLE
//   -------------------------------------------------------- */
//   const toggleAudio = useCallback(async () => {
//     const [micTrack] = localTracks;
//     if (!micTrack) return;

//     const nextState = !isAudioMuted;
//     await micTrack.setEnabled(!nextState);
//     setIsAudioMuted(nextState);
//   }, [localTracks, isAudioMuted]);

//   /* ------------------------------------------------------
//      VIDEO TOGGLE
//   -------------------------------------------------------- */
//   const toggleVideo = useCallback(async () => {
//     const [, camTrack] = localTracks;
//     if (!camTrack) return;

//     const next = !isVideoOff;
//     await camTrack.setEnabled(!next);
//     setIsVideoOff(next);
//   }, [localTracks, isVideoOff]);

//   /* ------------------------------------------------------
//      SCREEN SHARING
//   -------------------------------------------------------- */
//   const startScreenShare = useCallback(async () => {
//     try {
//       const screenTrack = await AgoraRTC.createScreenVideoTrack(
//         { encoderConfig: "1080p_1" },
//         "auto"
//       );

//       screenTrackRef.current = screenTrack;

//       const [, camTrack] = localTracks;
//       if (camTrack) await client.unpublish(camTrack);

//       await client.publish(screenTrack);

//       showNotification?.({ message: "Screen sharing started" }, "cameraState");
//     } catch (err) {
//       console.error("[Media] Screen share error:", err);
//       setError("Failed to start screen sharing.");
//     }
//   }, [localTracks]);

//   const stopScreenShare = useCallback(async () => {
//     try {
//       const screenTrack = screenTrackRef.current;
//       if (screenTrack) {
//         await client.unpublish(screenTrack);
//         screenTrack.stop();
//         screenTrack.close();
//         screenTrackRef.current = null;
//       }

//       const [, camTrack] = localTracks;
//       if (camTrack) {
//         await client.publish(camTrack);
//         await camTrack.setEnabled(true);
//         setIsVideoOff(false);
//       }

//       showNotification?.({ message: "Screen sharing stopped" }, "cameraState");
//     } catch (err) {
//       console.error("[Media] Stop screen share error:", err);
//       setError("Failed to stop screen sharing.");
//     }
//   }, [localTracks]);

//   /* ------------------------------------------------------
//      RETURN HOOK API (Fixed!)
//   -------------------------------------------------------- */
//   return {
//     localTracks,
//     isAudioMuted,
//     isVideoOff,
//     localVideoReady,

//     /** 💥 THIS FIXES BOTH ERRORS */
//     setLocalVideoReady,

//     localAudioTrack: localTracks[0],
//     localVideoTrack: localTracks[1],

//     screenTrackRef,
//     videoTrackRef,

//     createAndPublishTracks,
//     toggleAudio,
//     toggleVideo,
//     startScreenShare,
//     stopScreenShare,
//   };
// };













// src/hooks/agora/useAgoraMedia.js

import { useState, useRef, useCallback } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { AIDenoiserExtension } from "agora-extension-ai-denoiser";

/* ------------------------------------------------------
   GLOBAL DENOISER INSTANCE
-------------------------------------------------------- */
let denoiserInstance = null;

function getDenoiser() {
  if (!denoiserInstance) {
    denoiserInstance = new AIDenoiserExtension({
      assetsPath: "/agora-ai-denoiser",
    });

    AgoraRTC.registerExtensions([denoiserInstance]);

    denoiserInstance.onloaderror = (err) => {
      console.error("❌ [AI-NS] WASM Load Failed:", err);
      denoiserInstance.__loadFailed = true;
    };

    if (/Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)) {
      console.warn("⚠️ [AI-NS] Safari not supported → fallback ANS");
      denoiserInstance.__loadFailed = true;
    }
  }
  return denoiserInstance;
}

/* ------------------------------------------------------
   AUTO-SELECT BEST MICROPHONE
-------------------------------------------------------- */
async function autoSelectBestMic() {
  const devices = await AgoraRTC.getDevices();
  const mics = devices.filter((d) => d.kind === "audioinput");

  if (!mics.length) return null;

  const priority = ["usb", "studio", "microphone", "external", "hd"];
  const best = mics.find((m) =>
    priority.some((k) => m.label.toLowerCase().includes(k))
  );

  const selected = best?.deviceId || mics[0].deviceId;

  console.log("🎤 [Mic] Selected:", selected);
  return selected;
}

/* ------------------------------------------------------
   INTERNAL WAVEFORM ENGINE (ANALYSER)
-------------------------------------------------------- */
function createWaveformEngine(ctx) {
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 1024;

  const buffer = new Uint8Array(analyser.frequencyBinCount);

  return {
    analyser,
    buffer,
    getLevel: () => {
      analyser.getByteTimeDomainData(buffer);
      let sum = 0;
      for (let i = 0; i < buffer.length; i++) {
        sum += Math.abs(buffer[i] - 128);
      }
      return (sum / buffer.length) / 128;
    }
  };
}

/* ------------------------------------------------------
   STUDIO COMPRESSOR (AUTO MODE)
-------------------------------------------------------- */
function createStudioCompressor(ctx) {
  const comp = ctx.createDynamicsCompressor();

  comp.threshold.setValueAtTime(-35, ctx.currentTime);
  comp.knee.setValueAtTime(25, ctx.currentTime);
  comp.ratio.setValueAtTime(4, ctx.currentTime);
  comp.attack.setValueAtTime(0.003, ctx.currentTime);
  comp.release.setValueAtTime(0.15, ctx.currentTime);

  console.log("🎚️ [Compressor] Initialized");

  return comp;
}

/* ------------------------------------------------------
   ANTI-KEYBOARD MODE (TRANSIENT SUPPRESSOR)
-------------------------------------------------------- */
function createAntiKeyboardFilter(ctx) {
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 3800; // Remove 4–10kHz keyboard click noises

  console.log("⌨️ [Anti-Keyboard] Filter Ready");
  return filter;
}

/* ------------------------------------------------------
   ECHO DESTROYER MODE (AEC++)
-------------------------------------------------------- */
function createEchoDestroyer(ctx) {
  const hp = ctx.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 120;

  const notch = ctx.createBiquadFilter();
  notch.type = "notch";
  notch.frequency.value = 150;

  console.log("🌀 [EchoDestroyer] Activated");
  return { hp, notch };
}

/* ======================================================
   MAIN HOOK
====================================================== */
export const useAgoraMedia = ({
  client,
  callType,
  userRole,
  setError,
  showNotification,
}) => {

  const [localTracks, setLocalTracks] = useState([null, null]);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(
    callType === "audio" || callType === "chat"
  );
  const [localVideoReady, setLocalVideoReady] = useState(false);

  const aiProcessorRef = useRef(null);
  const screenTrackRef = useRef(null);
  const videoTrackRef = useRef(null);

  // internal DSP refs
  const audioContextRef = useRef(null);
  const waveformRef = useRef(null);
  const compressorRef = useRef(null);
  const antiKeyRef = useRef(null);
  const echoDestroyerRef = useRef(null);
  const gainNodeRef = useRef(null);

  /* ------------------------------------------------------
     INTERNAL AUDIO PIPELINE (FULL DSP STACK)
-------------------------------------------------------- */
  const setupInternalAudioPipeline = (micTrack) => {
    console.log("🎧 [Pipeline] Initializing Audio Engine...");

    audioContextRef.current = new AudioContext();
    const ctx = audioContextRef.current;

    // Mic source node
    const sourceNode = ctx.createMediaStreamSource(
      micTrack.getMediaStreamTrack().mediaStream
    );
    console.log("🎤 [Pipeline] Source Connected");

    // Waveform analyser
    waveformRef.current = createWaveformEngine(ctx);
    sourceNode.connect(waveformRef.current.analyser);

    // Studio compressor
    compressorRef.current = createStudioCompressor(ctx);
    sourceNode.connect(compressorRef.current);

    // Anti-keyboard transient filter
    antiKeyRef.current = createAntiKeyboardFilter(ctx);
    compressorRef.current.connect(antiKeyRef.current);

    // Echo destroyer (AEC++)
    const echo = createEchoDestroyer(ctx);
    echoDestroyerRef.current = echo;

    antiKeyRef.current.connect(echo.hp);
    echo.hp.connect(echo.notch);

    // Auto Gain Boost
    const gain = ctx.createGain();
    gain.gain.value = 1.3;
    echo.notch.connect(gain);
    gainNodeRef.current = gain;

    // Output
    gain.connect(ctx.destination);

    console.log("🚀 [Pipeline] Full DSP chain ACTIVE");

    // Noise gate / Auto-mode loop
    const gateLoop = () => {
      const level = waveformRef.current.getLevel();

      const silent = level < 0.02;
      micTrack.setEnabled(!silent);

      if (level > 0.4) {
        console.log("🎙️ [AutoMode] Strong voice → Compressor active");
      }
      if (silent) {
        console.log("🤫 [AutoMode] Silence → Gate active");
      }

      requestAnimationFrame(gateLoop);
    };
    gateLoop();
  };

  /* ------------------------------------------------------
     ADVANCED MICROPHONE CREATION
-------------------------------------------------------- */
  const createEnhancedMicTrack = async () => {
    const bestMic = await autoSelectBestMic();

    console.log("🎛️ [Codec] Using 48kHz / 128kbps OPUS");

    const micTrack = await AgoraRTC.createMicrophoneAudioTrack({
      AEC: true,
      ANS: false,
      AGC: true,
      microphoneId: bestMic,

      sampleRate: 48000,
      bitrate: 128000,
      channelCount: 1,

      highPassFilter: true,
      echoCancellation: true,
    });

    console.log("🎤 [Mic] Track Ready");

    return micTrack;
  };

  /* ------------------------------------------------------
     FALLBACK TO WEBRTC ANS
-------------------------------------------------------- */
  const fallbackToANS = async (oldTrack) => {
    console.warn("🔁 [Fallback] Switching to WebRTC ANS");

    oldTrack.stop();
    oldTrack.close();

    const newTrack = await AgoraRTC.createMicrophoneAudioTrack({
      AEC: true,
      ANS: true,
      AGC: true,
      sampleRate: 48000,
      bitrate: 48000,
    });

    setupInternalAudioPipeline(newTrack);

    return newTrack;
  };

  /* ------------------------------------------------------
     CREATE AND PUBLISH TRACKS
-------------------------------------------------------- */
  const createAndPublishTracks = useCallback(async () => {
    let tracks = [null, null];

    try {
      const denoiser = getDenoiser();

      /* ==================================================
         CHAT MODE
      ================================================== */
      if (callType === "chat") {
        setIsAudioMuted(true);
        setIsVideoOff(true);
      }

      /* ==================================================
         AUDIO CALL
      ================================================== */
      if (callType === "audio") {
        let micTrack = await createEnhancedMicTrack();
        setupInternalAudioPipeline(micTrack);

        if (!denoiser.__loadFailed) {
          try {
            console.log("🧠 [AI-NS] Enabling Processor...");

            const processor = denoiser.createProcessor();
            aiProcessorRef.current = processor;

            await micTrack.pipe(processor).pipe(micTrack.processorDestination);
            await processor.enable();

            if (processor.setVoiceEnhancement)
              processor.setVoiceEnhancement(true);

            await processor.setMode("NSNG");
            await processor.setLevel("SOFT");

            console.log("🎧 [AI-NS] ACTIVE");

            processor.onoverload = async () => {
              console.warn("🔥 [AI-NS] CPU Overload → Using Fallback ANS");
              await processor.disable();
              micTrack = await fallbackToANS(micTrack);
              tracks[0] = micTrack;
            };
          } catch (err) {
            console.error("AI-NS Failed → ANS Fallback:", err);
            micTrack = await fallbackToANS(micTrack);
          }
        }

        tracks[0] = micTrack;

        setIsAudioMuted(false);
        setIsVideoOff(true);
      }

      /* ==================================================
         VIDEO CALL
      ================================================== */
      if (callType === "video") {
        const bestMic = await autoSelectBestMic();

        let [micTrack, camTrack] =
          await AgoraRTC.createMicrophoneAndCameraTracks(
            {
              AEC: true,
              ANS: false,
              AGC: true,
              microphoneId: bestMic,

              sampleRate: 48000,
              bitrate: 128000,
              channelCount: 1,
            },
            {
              encoderConfig: "720p_2",
              optimizationMode: "detail",
            }
          );

        setupInternalAudioPipeline(micTrack);

        if (!denoiser.__loadFailed) {
          try {
            const processor = denoiser.createProcessor();
            aiProcessorRef.current = processor;

            await micTrack.pipe(processor).pipe(micTrack.processorDestination);
            await processor.enable();

            if (processor.setVoiceEnhancement)
              processor.setVoiceEnhancement(true);

            await processor.setMode("NSNG");
            await processor.setLevel("SOFT");

          } catch (err) {
            console.error("AI-NS failed, fallback ANS");
            micTrack = await fallbackToANS(micTrack);
          }
        }

        tracks[0] = micTrack;
        tracks[1] = camTrack;

        setLocalVideoReady(true);
        setIsAudioMuted(false);
        setIsVideoOff(false);
      }

    } catch (err) {
      console.error("[Media] Track creation failed:", err);
      setError("Failed to initialize audio/video devices.");
    }

    /* ======================================================
       ROLE-BASED PUBLISH (unchanged)
    ====================================================== */
    try {
      const [micTrack, camTrack] = tracks;

      if (userRole === "user") {
        if (camTrack) {
          await camTrack.setEnabled(false);
          setIsVideoOff(true);
        }

        if (micTrack) {
          console.log("📡 [Publish] User publishing audio only");
          await client.publish([micTrack]);
        }
      } else {
        if (callType === "video" && camTrack) {
          console.log("📡 [Publish] Publishing Audio + Video");
          await client.publish([micTrack, camTrack]);
        } else {
          console.log("📡 [Publish] Publishing Audio only");
          await client.publish([micTrack]);
        }
      }

      videoTrackRef.current = camTrack || null;
      setLocalTracks(tracks);

      console.log("✅ [Publish] Tracks published successfully");
    } catch (err) {
      console.error("❌ [Media] Publish Error:", err);
      setError("Failed to publish tracks.");
    }

    return tracks;
  }, [callType, userRole, client, setError]);

  /* ------------------------------------------------------
     AUDIO TOGGLE (unchanged)
-------------------------------------------------------- */
  const toggleAudio = useCallback(async () => {
    const [micTrack] = localTracks;
    if (!micTrack) return;

    const nextState = !isAudioMuted;
    await micTrack.setEnabled(!nextState);

    console.log(nextState ? "🔇 [Audio] Muted" : "🎤 [Audio] Unmuted");

    setIsAudioMuted(nextState);
  }, [localTracks, isAudioMuted]);

  /* ------------------------------------------------------
     VIDEO TOGGLE (unchanged)
-------------------------------------------------------- */
  const toggleVideo = useCallback(async () => {
    const [, camTrack] = localTracks;
    if (!camTrack) return;

    const next = !isVideoOff;
    await camTrack.setEnabled(!next);

    console.log(next ? "📷 [Video] Off" : "📸 [Video] On");

    setIsVideoOff(next);
  }, [localTracks, isVideoOff]);

  /* ------------------------------------------------------
     SCREEN SHARING (unchanged)
-------------------------------------------------------- */
  const startScreenShare = useCallback(async () => {
    try {
      console.log("🖥️ [ScreenShare] Starting...");

      const screenTrack = await AgoraRTC.createScreenVideoTrack(
        { encoderConfig: "1080p_1" },
        "auto"
      );

      screenTrackRef.current = screenTrack;

      const [, camTrack] = localTracks;

      if (camTrack) {
        console.log("🛑 [ScreenShare] Unpublishing camera");
        await client.unpublish(camTrack);
      }

      await client.publish(screenTrack);

      console.log("🟢 [ScreenShare] Active");

      showNotification?.({ message: "Screen sharing started" }, "cameraState");
    } catch (err) {
      console.error("❌ [ScreenShare] Error:", err);
      setError("Failed to start screen sharing.");
    }
  }, [localTracks]);

  const stopScreenShare = useCallback(async () => {
    try {
      console.log("🛑 [ScreenShare] Stopping...");

      const screenTrack = screenTrackRef.current;

      if (screenTrack) {
        await client.unpublish(screenTrack);
        screenTrack.stop();
        screenTrack.close();
        screenTrackRef.current = null;
      }

      const [, camTrack] = localTracks;

      if (camTrack) {
        console.log("📸 [ScreenShare] Restoring camera");
        await client.publish(camTrack);
        await camTrack.setEnabled(true);
        setIsVideoOff(false);
      }

      showNotification?.({ message: "Screen sharing stopped" }, "cameraState");

      console.log("🟢 [ScreenShare] Stopped");
    } catch (err) {
      console.error("❌ [ScreenShare] Error:", err);
      setError("Failed to stop screen sharing.");
    }
  }, [localTracks]);

  /* ------------------------------------------------------
     RETURN API (UNCHANGED)
-------------------------------------------------------- */
  return {
    localTracks,
    isAudioMuted,
    isVideoOff,
    localVideoReady,

    setLocalVideoReady,

    localAudioTrack: localTracks[0],
    localVideoTrack: localTracks[1],

    screenTrackRef,
    videoTrackRef,

    createAndPublishTracks,
    toggleAudio,
    toggleVideo,
    startScreenShare,
    stopScreenShare,
  };
};

