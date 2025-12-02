// src/hooks/agora/agoraClient.js
import AgoraRTC from "agora-rtc-sdk-ng";

AgoraRTC.setLogLevel(1);

const client = AgoraRTC.createClient({
  mode: "rtc",
  codec: "vp8",
});

export default client;
