// // context/UserStatusContext.jsx
// import { createContext, useContext, useEffect, useState, useRef } from "react";
// import { useSocket } from "./Socketcontext";
// import axios from "axios";

// const PresenceContext = createContext();

// export const PresenceProvider = ({ children }) => {
//   const [presenceMap, setPresenceMap] = useState({});
//   const { socket, isConnected } = useSocket();
//   const registeredRef = useRef(false);
//   const providerIdRef = useRef(null);

//   // Get providerId from localStorage
//   useEffect(() => {
//     const userData = JSON.parse(localStorage.getItem('userData') || '{}');
//     providerIdRef.current = userData.providerId;
//   }, []);

//   // Fetch initial presence data
//   const fetchPresence = async () => {
//     try {
//       const res = await axios.get(
//         `${process.env.REACT_APP_BACKEND_URL || "https://socket-server-d9ts.onrender.com"}/api/providers/presence`
//       );
//       setPresenceMap(res.data.presence || {});
//       console.log("✅ Initial presence loaded:", Object.keys(res.data.presence || {}).length, "providers");
//     } catch (err) {
//       console.error("❌ Error fetching presence:", err);
//     }
//   };

//   useEffect(() => {
//   console.log("🟦 presenceMap state changed:", presenceMap);
// }, [presenceMap]);


//   // Initial presence fetch - only once
//   useEffect(() => {
//     fetchPresence();
//   }, []); // Empty deps - only run once on mount

//   // Register provider when socket connects
//   useEffect(() => {
//     if (!socket || !isConnected || !providerIdRef.current) {
//       return;
//     }

//     // Only register once per connection
//     if (!registeredRef.current) {
//       console.log("📝 Registering provider:", providerIdRef.current);
//       socket.emit("register-provider", providerIdRef.current);
//       registeredRef.current = true;
//     }

//     // Reset registration flag when disconnected
//     const handleDisconnect = () => {
//       console.log("🔴 Socket disconnected, will re-register on reconnect");
//       registeredRef.current = false;
//     };

//     socket.on("disconnect", handleDisconnect);

//     return () => {
//       socket.off("disconnect", handleDisconnect);
//     };
//   }, [socket, isConnected]); // Only depend on socket and isConnected

//   // Listen for presence changes
//   useEffect(() => {
//     if (!socket) return;

//    const handlePresenceChanged = (data) => {
//   console.log("📡 RAW presenceChanged event:", data);

//   const { providerId, isOnline, status } = data;

//   console.log("📡 Parsed presenceChanged:", providerId, status);

//   setPresenceMap((prev) => {
//     const updated = {
//       ...prev,
//       [providerId]: { isOnline, status },
//     };

//     console.log("🟦 New presenceMap after update:", updated);
//     return updated;
//   });
// };

//     socket.on("presenceChanged", handlePresenceChanged);

//     return () => {
//       socket.off("presenceChanged", handlePresenceChanged);
//     };
//   }, [socket]); // Only depend on socket

//   return (
//     <PresenceContext.Provider value={{ presenceMap, socket }}>
//       {children}
//     </PresenceContext.Provider>
//   );
// };

// export const usePresence = () => {
//   const context = useContext(PresenceContext);
//   if (!context) {
//     throw new Error("usePresence must be used within PresenceProvider");
//   }
//   return context;
// };




// context/UserStatusContext.jsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback
} from "react";
import { useSocket } from "./Socketcontext";
import axios from "axios";

const PresenceContext = createContext();

export const PresenceProvider = ({ children }) => {
  const [presenceMap, setPresenceMap] = useState({});
  const { socket, isConnected } = useSocket();
  const registeredRef = useRef(false);
  const providerIdRef = useRef(null);

  /* -----------------------------------------
      GET PROVIDER ID FROM LOCAL STORAGE
  ------------------------------------------ */
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    providerIdRef.current = userData.providerId;
  }, []);

  /* -----------------------------------------
      FETCH INITIAL PRESENCE ONE TIME
  ------------------------------------------ */
  const fetchPresence = async () => {
    try {
      const res = await axios.get(
        `${
          process.env.REACT_APP_BACKEND_URL ||
          "https://socket-server-d9ts.onrender.com"
        }/api/providers/presence`
      );

      setPresenceMap(res.data.presence || {});
      console.log(
        "✅ Initial presence loaded:",
        Object.keys(res.data.presence || {}).length,
        "providers"
      );
    } catch (err) {
      console.error("❌ Error fetching presence:", err);
    }
  };

  useEffect(() => {
    fetchPresence();
  }, []); // runs ONCE

  useEffect(() => {
    console.log("🟦 presenceMap state changed:", presenceMap);
  }, [presenceMap]);

  /* -----------------------------------------
      REGISTER PROVIDER ON SOCKET CONNECT
  ------------------------------------------ */
  useEffect(() => {
    if (!socket || !isConnected || !providerIdRef.current) return;

    if (!registeredRef.current) {
      console.log("📝 Registering provider:", providerIdRef.current);
      socket.emit("register-provider", providerIdRef.current);
      registeredRef.current = true;
    }

    const handleDisconnect = () => {
      console.log("🔴 Socket disconnected, will re-register on reconnect");
      registeredRef.current = false;
    };

    socket.on("disconnect", handleDisconnect);
    return () => socket.off("disconnect", handleDisconnect);
  }, [socket, isConnected]);

  /* -----------------------------------------
      HANDLE PRESENCE CHANGES (STABLE FUNCTION)
  ------------------------------------------ */
  const handlePresenceChanged = useCallback((data) => {
    console.log("📡 RAW presenceChanged:", data);

    const { providerId, isOnline, status } = data;
    console.log("📡 Parsed presenceChanged:", providerId, status);

    setPresenceMap((prev) => {
      const updated = {
        ...prev,
        [providerId]: { isOnline, status }
      };

      console.log("🟦 New presenceMap after update:", updated);
      return updated;
    });
  }, []);

  /* -----------------------------------------
      SOCKET LISTENER — STABLE + SAFE
  ------------------------------------------ */
  useEffect(() => {
    if (!socket) return;

    console.log("🟢 Attaching presenceChanged listener");

    socket.on("presenceChanged", handlePresenceChanged);

    return () => {
      console.log("🔴 Removing presenceChanged listener");
      socket.off("presenceChanged", handlePresenceChanged);
    };
  }, [socket, handlePresenceChanged]);

  return (
    <PresenceContext.Provider value={{ presenceMap, socket }}>
      {children}
    </PresenceContext.Provider>
  );
};

export const usePresence = () => {
  const ctx = useContext(PresenceContext);
  if (!ctx) throw new Error("usePresence must be used within PresenceProvider");
  return ctx;
};
