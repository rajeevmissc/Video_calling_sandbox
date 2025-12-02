import React, { useEffect, useCallback } from 'react';
import RemoteUser from './RemoteUser';
import { 
  DraggableLocalVideo, 
  MainLocalVideo, 
  DraggableRemoteVideo 
} from './VideoComponents';
import { CallHeader } from './CallHeaderAndNotifications';
import { CallNotifications } from './CallHeaderAndNotifications';
import './CallLayout.css';

const CallLayout = ({
  agora,
  controls,
  ui,
  callType,
  isWaitingForProvider,
  waitingTime,
  callStatus,
  callEnded,
  onEndCall
}) => {
  // Dragging effect - Optimized with useCallback
  useEffect(() => {
    if (!ui.dragging) return;

    const handleMouseMove = (e) => ui.handleMouseMove(e);
    const handleMouseUp = () => ui.handleMouseUp();

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleMouseMove, { passive: false });
    window.addEventListener('touchend', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [ui.dragging, ui.handleMouseMove, ui.handleMouseUp]);

  // Enhanced local video playback with retry logic
  useEffect(() => {
    const playLocalVideo = async () => {
      if (callType === 'video' &&
        agora.localTracks.length >= 2 &&
        agora.localTracks[1] &&
        !agora.isVideoOff &&
        !controls.videoToggleInProgress) {

        const shouldShowInMain = agora.remoteUsers.length > 0 && 
          !agora.remoteUserStates[agora.remoteUsers[0]?.uid]?.hasVideo;
        const targetRef = shouldShowInMain ? agora.localVideoMainRef : agora.localVideoRef;

        if (!targetRef?.current) return;

        let retries = 0;
        const maxRetries = 3;

        while (retries < maxRetries) {
          try {
            // Stop previous playback
            try { 
              agora.localTracks[1].stop(); 
            } catch (e) { 
              // Ignore stop errors
            }
            
            await agora.localTracks[1].play(targetRef.current);
            agora.setLocalVideoReady(true);
            break;
          } catch (err) {
            retries++;
            if (retries >= maxRetries) {
              console.error('Failed to play local video after retries:', err);
              agora.setLocalVideoReady(false);
            } else {
              // Wait before retry
              await new Promise(resolve => setTimeout(resolve, 300));
            }
          }
        }
      } else if (agora.isVideoOff) {
        agora.setLocalVideoReady(false);
      }
    };

    playLocalVideo();
  }, [
    agora.localTracks, 
    agora.isVideoOff, 
    callType, 
    controls.videoToggleInProgress, 
    agora.remoteUsers, 
    agora.remoteUserStates
  ]);

  // Ensure local video is initially visible and playing
  useEffect(() => {
    const ensureLocalVideo = async () => {
      if (callType === 'video' &&
        agora.localTracks.length >= 2 &&
        agora.localTracks[1] &&
        !agora.isVideoOff) {

        const shouldShowInMain = agora.remoteUsers.length > 0 && 
          !agora.remoteUserStates[agora.remoteUsers[0]?.uid]?.hasVideo;
        const targetRef = shouldShowInMain ? agora.localVideoMainRef : agora.localVideoRef;

        if (!targetRef?.current) return;

        try {
          try { 
            agora.localTracks[1].stop(); 
          } catch (e) { 
            // Ignore
          }
          
          await agora.localTracks[1].play(targetRef.current);
          agora.setLocalVideoReady(true);
        } catch (err) {
          console.error('Error playing local video on mount:', err);
          agora.setLocalVideoReady(false);
        }
      }
    };

    if (agora.localTracks.length > 0) {
      ensureLocalVideo();
    }
  }, [
    agora.localTracks, 
    callType, 
    agora.isVideoOff, 
    agora.remoteUsers, 
    agora.remoteUserStates
  ]);

  // Memoized video area rendering - Optimized for performance
  const renderVideoArea = useCallback(() => {
    if (agora.remoteUsers.length > 0) {
      const remoteUser = agora.remoteUsers[0];
      const userState = agora.remoteUserStates[remoteUser.uid];

      if (userState?.hasVideo) {
        // Remote user has video - show them in main view
        return (
          <>
            <div className="call-video-fullscreen">
              <RemoteUser
                user={remoteUser}
                callType={callType}
                isFullscreen
                audioLevel={agora.audioLevels.remote[remoteUser.uid] || 0}
                userState={userState}
              />
            </div>

            <DraggableLocalVideo
              agora={agora}
              controls={controls}
              ui={ui}
              callType={callType}
            />
          </>
        );
      } else {
        // Remote user camera is off - show local user in main view
        return (
          <>
            <div className="call-video-fullscreen">
              <MainLocalVideo
                agora={agora}
                controls={controls}
                callType={callType}
                ui={ui}
              />
            </div>

            <DraggableRemoteVideo
              user={remoteUser}
              userState={userState}
              ui={ui}
              agora={agora}
            />
          </>
        );
      }
    } else {
      // No remote users - show waiting screen
      return (
        <div className="call-waiting-area">
          <div>
            <div className="call-waiting-icon">
              <agora.icons.FaUser style={{ fontSize: '2.5rem', color: 'white' }} />
            </div>
            <p className="call-waiting-text">Waiting for participants to join...</p>
          </div>
        </div>
      );
    }
  }, [agora, controls, ui, callType]);

  return (
    <div className="call-layout-container">
      {/* Reconnecting overlay */}
      {agora.reconnecting && (
        <div className="call-reconnecting-overlay">
          <div className="call-reconnecting-content">
            <div className="call-spinner"></div>
            <p style={{ fontSize: '1.125rem', fontWeight: 600 }}>Reconnecting...</p>
            <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '0.25rem' }}>
              Please wait
            </p>
          </div>
        </div>
      )}

      {/* Notifications */}
      <CallNotifications agora={agora} />

      {/* Header */}
      {ui.showHeader && (
        <CallHeader 
          agora={agora} 
          ui={ui} 
          callType={callType} 
        />
      )}

      {/* Video Area */}
      <div className="call-video-area">
        {renderVideoArea()}
      </div>
    </div>
  );
};

// Wrap with React.memo for performance optimization
export default React.memo(CallLayout);