import { useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';

export const useCallControls = (agora) => {
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [videoToggleInProgress, setVideoToggleInProgress] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  // 🔈 Toggle audio (reactive)
  const toggleAudio = async () => {
    if (!agora.localTracks[0]) return;
    setIsAudioLoading(true);
    try {
      const newMuted = !isAudioMuted;
      await agora.localTracks[0].setEnabled(!newMuted);
      setIsAudioMuted(newMuted);
      agora.setIsAudioMuted?.(newMuted);
      agora.showNotification?.({
        message: newMuted ? 'Microphone muted' : 'Microphone unmuted',
        type: 'audioToggle'
      }, 'cameraState', 1500);
    } catch (error) {
      console.error('Failed to toggle audio:', error);
      agora.setError?.('Failed to toggle microphone');
    } finally {
      setIsAudioLoading(false);
    }
  };

  // 🎥 Toggle video (reactive)
  const toggleVideo = async () => {
    if (!agora.localTracks[1]) {
      agora.setError?.('Video track not available');
      return;
    }

    setVideoToggleInProgress(true);
    setIsVideoLoading(true);
    try {
      const newVideoOff = !isVideoOff;

      if (newVideoOff) {
        agora.localTracks[1].stop();
        await agora.localTracks[1].setEnabled(false);
        setIsVideoOff(true);
        agora.setIsVideoOff?.(true);
        agora.showNotification?.({ message: 'Camera turned off', type: 'cameraOff' }, 'cameraState', 1500);
      } else {
        await agora.localTracks[1].setEnabled(true);
        setIsVideoOff(false);
        agora.setIsVideoOff?.(false);
        await new Promise(resolve => setTimeout(resolve, 500));
        const targetRef = agora.localVideoRef;
        if (targetRef?.current) await agora.localTracks[1].play(targetRef.current);
        agora.showNotification?.({ message: 'Camera turned on', type: 'cameraOn' }, 'cameraState', 1500);
      }
    } catch (error) {
      console.error('Failed to toggle video:', error);
      agora.setError?.('Failed to toggle camera. Please try again.');
    } finally {
      setIsVideoLoading(false);
      setTimeout(() => setVideoToggleInProgress(false), 500);
    }
  };

  // 🖥 Screen share
  const startScreenShare = async () => {
    // STOP screen sharing
    if (isScreenSharing) {
      try {
        if (agora.screenTrackRef.current) {
          await agora.client.unpublish([agora.screenTrackRef.current]);
          agora.screenTrackRef.current.close();
          agora.screenTrackRef.current = null;
        }

        setIsScreenSharing(false);

        agora.showNotification?.({
          message: 'Screen sharing stopped',
          type: 'screenShare'
        }, 'cameraState', 2000);
      } catch (err) {
        console.error('Error stopping screen share:', err);
        agora.setError?.('Failed to stop screen sharing');
      }
      return;
    }

    // START screen sharing
    try {
      const screenTrack = await AgoraRTC.createScreenVideoTrack({
        encoderConfig: '1080p_1',
        optimizationMode: 'detail'
      });
      agora.screenTrackRef.current = screenTrack;

      await agora.client.unpublish([agora.localTracks[1]]);
      await agora.client.publish([screenTrack]);
      setIsScreenSharing(true);

      agora.showNotification?.({
        message: 'Screen sharing started',
        type: 'screenShare'
      }, 'cameraState', 2000);

      screenTrack.on('track-ended', async () => {
        await agora.client.unpublish([screenTrack]);
        if (agora.localTracks[1]) await agora.client.publish([agora.localTracks[1]]);
        setIsScreenSharing(false);
        screenTrack.close();
        agora.screenTrackRef.current = null;
        agora.showNotification?.({
          message: 'Screen sharing stopped',
          type: 'screenShare'
        }, 'cameraState', 2000);
      });
    } catch (error) {
      console.error('Screen sharing failed:', error);
      alert('Failed to start screen sharing: ' + error.message);
    }
  };

  return {
    // State
    isScreenSharing,
    isVideoLoading,
    isAudioLoading,
    videoToggleInProgress,
    isAudioMuted,
    isVideoOff,

    // Functions
    toggleAudio,
    toggleVideo,
    startScreenShare
  };
};
