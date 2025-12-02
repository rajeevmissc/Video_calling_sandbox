// // src/hooks/agora/useAgoraRTM.js
// import { useState, useRef, useEffect, useCallback } from "react";
// import AgoraRTM from "agora-rtm-sdk";

// /**
//  * RTM + chat + synced connection time
//  *
//  * @param {Object} params
//  * @param {string} params.channelName
//  * @param {React.MutableRefObject<number|null>} params.connectionTimeRef
//  * @param {React.MutableRefObject<boolean>} params.timerStartedRef
//  */
// export const useAgoraRTM = ({ channelName, connectionTimeRef, timerStartedRef }) => {
//   const [chatMessages, setChatMessages] = useState([]);
//   const [chatInput, setChatInput] = useState("");

//   const rtmClientRef = useRef(null);
//   const rtmChannelRef = useRef(null);
//   const chatMessagesRef = useRef([]);
//   const chatEndRef = useRef(null);

//   // Called by main hook after it gets tokens/appId/uid
//   const initializeRTM = useCallback(
//     async ({ appId, serverUid, rtmToken }) => {
//       try {
//         if (!appId || !serverUid || !rtmToken) {
//           console.warn("[RTM] Missing appId/serverUid/rtmToken, skipping RTM init");
//           return;
//         }

//         const rtmClient = AgoraRTM.createInstance(appId);
//         rtmClientRef.current = rtmClient;
//         const uidStr = String(serverUid);

//         await rtmClient.login({ uid: uidStr, token: rtmToken });

//         const channel = await rtmClient.createChannel(channelName);
//         rtmChannelRef.current = channel;
//         await channel.join();

//         channel.on("ChannelMessage", (message, memberId) => {
//           let parsed;
//           try {
//             parsed = JSON.parse(message.text);
//           } catch {
//             parsed = { text: message.text };
//           }

//           // Handle synced connection time
//           if (parsed.type === "SYSTEM_CONNECTION_TIME" && parsed.timestamp) {
//             if (!connectionTimeRef.current || parsed.timestamp < connectionTimeRef.current) {
//               connectionTimeRef.current = parsed.timestamp;
//               timerStartedRef.current = true;
//               console.log("🕐 Received synced connection time:", parsed.timestamp);
//             }
//             return;
//           }

//           const isLocal = String(memberId) === uidStr;
//           const newMsg = {
//             id: Date.now() + Math.random(),
//             text: parsed.text ?? message.text,
//             timestamp: new Date().toLocaleTimeString(),
//             sender: isLocal ? "You" : "User",
//             isLocal,
//           };

//           chatMessagesRef.current = [...chatMessagesRef.current, newMsg];
//           setChatMessages(chatMessagesRef.current);
//         });
//       } catch (err) {
//         console.warn("[RTM] Failed to initialize RTM:", err);
//       }
//     },
//     [channelName, connectionTimeRef, timerStartedRef]
//   );

//   const sendConnectionTimeMessage = useCallback(async (timestamp) => {
//     if (!rtmChannelRef.current) return;
//     try {
//       await rtmChannelRef.current.sendMessage({
//         text: JSON.stringify({
//           type: "SYSTEM_CONNECTION_TIME",
//           timestamp,
//         }),
//       });
//     } catch (err) {
//       console.warn("[RTM] Failed to send SYSTEM_CONNECTION_TIME:", err);
//     }
//   }, []);

//   const sendMessage = useCallback(
//     async (messageTextOrEvent) => {
//       let messageText = messageTextOrEvent;

//       if (
//         messageTextOrEvent &&
//         typeof messageTextOrEvent === "object" &&
//         messageTextOrEvent.preventDefault
//       ) {
//         messageTextOrEvent.preventDefault();
//         messageText = chatInput.trim();
//       } else if (typeof messageTextOrEvent === "string") {
//         messageText = messageTextOrEvent;
//       } else {
//         messageText = chatInput.trim();
//       }

//       if (!messageText || !rtmChannelRef.current) return;

//       if (messageText.startsWith("SYSTEM:")) {
//         try {
//           await rtmChannelRef.current.sendMessage({
//             text: JSON.stringify({ text: messageText }),
//           });
//         } catch (err) {
//           console.warn("[RTM] Failed to send system message:", err);
//         }
//         return;
//       }

//       const textToSend = messageText;
//       setChatInput("");

//       try {
//         await rtmChannelRef.current.sendMessage({
//           text: JSON.stringify({ text: textToSend }),
//         });

//         const newMsg = {
//           id: Date.now(),
//           text: textToSend,
//           timestamp: new Date().toLocaleTimeString(),
//           sender: "You",
//           isLocal: true,
//         };
//         chatMessagesRef.current = [...chatMessagesRef.current, newMsg];
//         setChatMessages(chatMessagesRef.current);
//       } catch (err) {
//         console.warn("[RTM] Failed to send message:", err);

//         const newMsg = {
//           id: Date.now(),
//           text: textToSend,
//           timestamp: new Date().toLocaleTimeString(),
//           sender: "You (not sent)",
//           isLocal: true,
//         };
//         chatMessagesRef.current = [...chatMessagesRef.current, newMsg];
//         setChatMessages(chatMessagesRef.current);
//       }
//     },
//     [chatInput]
//   );

//   useEffect(() => {
//     if (chatEndRef.current) {
//       chatEndRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [chatMessages]);

//   useEffect(() => {
//     return () => {
//       if (rtmChannelRef.current) {
//         rtmChannelRef.current.leave().catch(() => {});
//       }
//       if (rtmClientRef.current) {
//         rtmClientRef.current.logout().catch(() => {});
//       }
//     };
//   }, []);

//   return {
//     chatMessages,
//     chatInput,
//     setChatInput,
//     chatEndRef,
//     chatMessagesRef,
//     initializeRTM,
//     sendMessage,
//     sendConnectionTimeMessage,
//   };
// };








// src/hooks/agora/useAgoraRTM.js
import { useState, useRef, useEffect, useCallback } from "react";
import AgoraRTM from "agora-rtm-sdk";

/**
 * RTM + chat + synced connection time
 *
 * @param {Object} params
 * @param {string} params.channelName
 * @param {React.MutableRefObject<number|null>} params.connectionTimeRef
 * @param {React.MutableRefObject<boolean>} params.timerStartedRef
 */
export const useAgoraRTM = ({ channelName, connectionTimeRef, timerStartedRef }) => {
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [rtmConnected, setRtmConnected] = useState(false);

  const rtmClientRef = useRef(null);
  const rtmChannelRef = useRef(null);
  const chatMessagesRef = useRef([]);
  const chatEndRef = useRef(null);

  // Called by main hook after it gets tokens/appId/uid
  const initializeRTM = useCallback(
    async ({ appId, serverUid, rtmToken }) => {
      try {
        if (!appId || !serverUid || !rtmToken) {
          console.warn("[RTM] Missing appId/serverUid/rtmToken, skipping RTM init");
          return;
        }

        console.log("🔐 [RTM] Starting initialization:", {
          channelName,
          serverUid,
          appId: appId.substring(0, 8) + "...",
          token: rtmToken.substring(0, 20) + "..."
        });

        const rtmClient = AgoraRTM.createInstance(appId);
        rtmClientRef.current = rtmClient;
        const uidStr = String(serverUid);

        console.log("🔑 [RTM] Attempting login with UID:", uidStr);

        await rtmClient.login({ uid: uidStr, token: rtmToken });

        console.log("✅ [RTM] Login successful");

        const channel = await rtmClient.createChannel(channelName);
        rtmChannelRef.current = channel;
        
        await channel.join();

        console.log("✅ [RTM] Channel joined:", channelName);

        // Listen for member events
        channel.on("MemberJoined", (memberId) => {
          console.log("👤 [RTM] Member joined:", memberId);
        });

        channel.on("MemberLeft", (memberId) => {
          console.log("👋 [RTM] Member left:", memberId);
        });

        channel.on("ChannelMessage", (message, memberId) => {
          console.log("📩 [RTM] Received message:", {
            from: memberId,
            text: message.text,
            isLocal: String(memberId) === uidStr
          });

          let parsed;
          try {
            parsed = JSON.parse(message.text);
          } catch {
            parsed = { text: message.text };
          }

          // Handle synced connection time
          if (parsed.type === "SYSTEM_CONNECTION_TIME" && parsed.timestamp) {
            if (!connectionTimeRef.current || parsed.timestamp < connectionTimeRef.current) {
              connectionTimeRef.current = parsed.timestamp;
              timerStartedRef.current = true;
              console.log("🕐 [RTM] Received synced connection time:", parsed.timestamp);
            }
            return;
          }

          const isLocal = String(memberId) === uidStr;
          const newMsg = {
            id: Date.now() + Math.random(),
            text: parsed.text ?? message.text,
            timestamp: new Date().toLocaleTimeString(),
            sender: isLocal ? "You" : "User",
            isLocal,
          };

          console.log("💬 [RTM] Adding message to chat:", newMsg);

          chatMessagesRef.current = [...chatMessagesRef.current, newMsg];
          setChatMessages(chatMessagesRef.current);
        });

        setRtmConnected(true);
        console.log("✅ [RTM] Setup complete - ready to send/receive messages");

      } catch (err) {
        console.error("❌ [RTM] Failed to initialize:", err);
        console.error("❌ [RTM] Error details:", {
          name: err.name,
          code: err.code,
          message: err.message
        });
        setRtmConnected(false);
      }
    },
    [channelName, connectionTimeRef, timerStartedRef]
  );

  const sendConnectionTimeMessage = useCallback(async (timestamp) => {
    if (!rtmChannelRef.current) {
      console.warn("[RTM] Cannot send connection time - channel not ready");
      return;
    }
    try {
      console.log("📤 [RTM] Sending connection time:", timestamp);
      await rtmChannelRef.current.sendMessage({
        text: JSON.stringify({
          type: "SYSTEM_CONNECTION_TIME",
          timestamp,
        }),
      });
      console.log("✅ [RTM] Connection time sent");
    } catch (err) {
      console.error("❌ [RTM] Failed to send SYSTEM_CONNECTION_TIME:", err);
    }
  }, []);

  const sendMessage = useCallback(
    async (messageTextOrEvent) => {
      let messageText = messageTextOrEvent;

      if (
        messageTextOrEvent &&
        typeof messageTextOrEvent === "object" &&
        messageTextOrEvent.preventDefault
      ) {
        messageTextOrEvent.preventDefault();
        messageText = chatInput.trim();
      } else if (typeof messageTextOrEvent === "string") {
        messageText = messageTextOrEvent;
      } else {
        messageText = chatInput.trim();
      }

      if (!messageText) {
        console.warn("[RTM] Empty message, not sending");
        return;
      }

      if (!rtmChannelRef.current) {
        console.error("❌ [RTM] Cannot send message - channel not ready");
        console.error("❌ [RTM] RTM Status:", {
          clientExists: !!rtmClientRef.current,
          channelExists: !!rtmChannelRef.current,
          connected: rtmConnected
        });
        return;
      }

      // System messages
      if (messageText.startsWith("SYSTEM:")) {
        try {
          console.log("📤 [RTM] Sending system message:", messageText);
          await rtmChannelRef.current.sendMessage({
            text: JSON.stringify({ text: messageText }),
          });
          console.log("✅ [RTM] System message sent");
        } catch (err) {
          console.error("❌ [RTM] Failed to send system message:", err);
        }
        return;
      }

      // Regular messages
      const textToSend = messageText;
      setChatInput("");

      try {
        console.log("📤 [RTM] Sending message:", textToSend);
        
        await rtmChannelRef.current.sendMessage({
          text: JSON.stringify({ text: textToSend }),
        });

        console.log("✅ [RTM] Message sent successfully");

        const newMsg = {
          id: Date.now(),
          text: textToSend,
          timestamp: new Date().toLocaleTimeString(),
          sender: "You",
          isLocal: true,
        };
        
        chatMessagesRef.current = [...chatMessagesRef.current, newMsg];
        setChatMessages(chatMessagesRef.current);
        
      } catch (err) {
        console.error("❌ [RTM] Failed to send message:", err);
        console.error("❌ [RTM] Error details:", {
          name: err.name,
          code: err.code,
          message: err.message
        });

        const newMsg = {
          id: Date.now(),
          text: textToSend,
          timestamp: new Date().toLocaleTimeString(),
          sender: "You (not sent)",
          isLocal: true,
        };
        chatMessagesRef.current = [...chatMessagesRef.current, newMsg];
        setChatMessages(chatMessagesRef.current);
      }
    },
    [chatInput, rtmConnected]
  );

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  useEffect(() => {
    return () => {
      console.log("🧹 [RTM] Cleaning up...");
      if (rtmChannelRef.current) {
        rtmChannelRef.current.leave().catch(() => {});
      }
      if (rtmClientRef.current) {
        rtmClientRef.current.logout().catch(() => {});
      }
      setRtmConnected(false);
    };
  }, []);

  return {
    chatMessages,
    chatInput,
    setChatInput,
    chatEndRef,
    chatMessagesRef,
    rtmConnected, // ← Added this
    initializeRTM,
    sendMessage,
    sendConnectionTimeMessage,
  };
};
