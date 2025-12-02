import React, { useEffect, useCallback, useMemo } from 'react';
import RemoteUser from '../components/Call/call-layout/RemoteUser';
import NetworkQualityIndicator from '../components/Call/call-layout/NetworkQualityIndicator';
import AudioLevelIndicator from '../components/Call/call-layout/AudioLevelIndicator';

// All styles inline - no external CSS needed
const styles = `
  /* ===== ANIMATIONS ===== */
  @keyframes slideDown {
    from {
      transform: translate(-50%, -100%);
      opacity: 0;
    }
    to {
      transform: translate(-50%, 0);
      opacity: 1;
    }
  }

  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  /* ===== LAYOUT CONTAINER ===== */
  .call-layout-container {
    display: flex;
    height: 100vh;
    background-color: #111827;
    color: white;
    position: relative;
    overflow: hidden;
  }

  /* ===== OVERLAYS ===== */
  .call-reconnecting-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.75);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
  }

  .call-reconnecting-content {
    background-color: #1e293b;
    padding: 1.5rem;
    border-radius: 0.75rem;
    border: 1px solid #334155;
    text-align: center;
  }

  .call-spinner {
    width: 3rem;
    height: 3rem;
    border: 4px solid #eab308;
    border-top-color: transparent;
    border-radius: 50%;
    margin: 0 auto 0.75rem;
    animation: spin 1s linear infinite;
  }

  /* ===== NOTIFICATIONS ===== */
  .call-notification {
    position: fixed;
    top: 1rem;
    z-index: 50;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    animation: slideDown 0.3s ease-out;
  }

  .call-notification-center {
    left: 50%;
    transform: translateX(-50%);
  }

  .call-notification-right {
    right: 1rem;
    animation: slideInRight 0.3s ease-out;
  }

  .call-notification-joined {
    background-color: #16a34a;
    color: white;
    border: 1px solid #22c55e;
  }

  .call-notification-left {
    background-color: #ea580c;
    color: white;
    border: 1px solid #fb923c;
  }

  .call-notification-camera-on {
    background-color: #16a34a;
    border: 1px solid #22c55e;
    color: white;
  }

  .call-notification-camera-off {
    background-color: #eab308;
    border: 1px solid #facc15;
    color: white;
  }

  .call-notification-audio {
    background-color: #3b82f6;
    border: 1px solid #60a5fa;
    color: white;
  }

  .call-notification-warning {
    background-color: #eab308;
    border: 1px solid #facc15;
    color: white;
  }

  .call-notification-error {
    background-color: #ef4444;
    border: 1px solid #f87171;
    color: white;
  }

  /* ===== HEADER ===== */
  .call-header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(8px);
    padding: 0.5rem 1rem;
    z-index: 30;
    border-bottom: 1px solid #374151;
  }

  .call-header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .call-header-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .call-header-title {
    font-size: 0.875rem;
    font-weight: 500;
    color: white;
  }

  .call-header-meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.75rem;
    color: #d1d5db;
  }

  .call-header-status {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .call-status-badge {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
  }

  .call-status-connected {
    background-color: #16a34a;
  }

  .call-status-connecting {
    background-color: #eab308;
  }

  .call-status-disconnected {
    background-color: #ef4444;
  }

  .call-status-dot {
    width: 0.375rem;
    height: 0.375rem;
    background-color: white;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  /* ===== VIDEO AREA ===== */
  .call-video-area {
    flex: 1;
    position: relative;
    background-color: #000;
  }

  .call-video-fullscreen {
    position: absolute;
    inset: 0;
    z-index: 0;
  }

  .call-waiting-area {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    text-align: center;
    padding: 1rem;
  }

  .call-waiting-icon {
    width: 6rem;
    height: 6rem;
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem;
    box-shadow: 0 10px 40px rgba(59, 130, 246, 0.4);
  }

  .call-waiting-text {
    color: #9ca3af;
    font-size: 1.125rem;
    margin-bottom: 0.5rem;
  }

  .call-waiting-channel {
    color: #6b7280;
    font-size: 0.875rem;
    margin-top: 0.5rem;
  }

  .call-channel-code {
    background-color: #1f2937;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-family: monospace;
  }

  /* ===== DRAGGABLE VIDEO ===== */
  .call-draggable-video {
    position: absolute;
    z-index: 10;
    background-color: #1e293b;
    border-radius: 0.5rem;
    overflow: hidden;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
    border: 2px solid #475569;
    display: flex;
    flex-direction: column;
    cursor: move;
    transition: all 0.2s;
    width: 10rem;
    height: 7.5rem;
  }

  .call-draggable-video:hover {
    border-color: #3b82f6;
  }

  .call-draggable-video.dragging {
    border-color: #3b82f6;
    transform: scale(1.05);
  }

  .call-draggable-video.remote:hover {
    border-color: #22c55e;
  }

  .call-draggable-video.remote.dragging {
    border-color: #22c55e;
  }

  .call-video-badge {
    position: absolute;
    top: 0.25rem;
    left: 0.25rem;
    z-index: 20;
    background-color: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(8px);
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
    border: 1px solid #4b5563;
  }

  .call-video-badge-content {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.75rem;
  }

  .call-video-content {
    width: 100%;
    height: 100%;
    background-color: #0f172a;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .call-video-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .call-video-avatar {
    width: 2rem;
    height: 2rem;
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .call-video-avatar-large {
    width: 8rem;
    height: 8rem;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3);
  }

  .call-video-loading {
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 30;
  }

  .call-video-loading-spinner {
    width: 1rem;
    height: 1rem;
    border: 2px solid white;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 0.25rem;
  }

  /* ===== MAIN VIDEO VIEW ===== */
  .call-main-video {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .call-main-video-badge {
    position: absolute;
    top: 1rem;
    left: 1rem;
    z-index: 10;
    background-color: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(8px);
    padding: 0.375rem 0.75rem;
    border-radius: 9999px;
    border: 1px solid #4b5563;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
  }

  .call-main-video-badge-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .call-main-video-content {
    width: 100%;
    height: 100%;
    background-color: #000;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* ===== VIDEO ELEMENT FIXES FOR ALL DEVICES ===== */
  /* This ensures videos display properly on ANY device */
  .call-video-fullscreen video,
  .call-main-video-content video,
  .call-video-content video {
    width: 100% !important;
    height: 100% !important;
    object-fit: contain !important;
    background-color: #000;
  }

  /* For draggable small videos - cover to fill the small box */
  .call-draggable-video video {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
  }

  /* Mobile portrait mode - ensure full video visibility */
  @media (orientation: portrait) {
    .call-video-fullscreen video,
    .call-main-video-content video {
      object-fit: contain !important;
    }
  }

  /* Tablet and desktop landscape - ensure full video visibility */
  @media (orientation: landscape) {
    .call-video-fullscreen video,
    .call-main-video-content video {
      object-fit: contain !important;
    }
  }

  /* ===== RESPONSIVE DESIGN ===== */
  @media (max-width: 640px) {
    .call-draggable-video {
      width: 5rem;
      height: 6.5rem;
      bottom: 5rem !important;
      right: 0.5rem !important;
    }

    .call-waiting-icon {
      width: 4rem;
      height: 4rem;
    }

    .call-waiting-text {
      font-size: 1rem;
    }

    .call-header {
      padding: 0.375rem 0.75rem;
    }

    .call-header-title {
      font-size: 0.75rem;
    }

    .call-header-meta {
      font-size: 0.625rem;
    }

    .call-notification {
      font-size: 0.75rem;
      padding: 0.375rem 0.75rem;
    }

    .call-main-video-badge {
      top: 0.5rem;
      left: 0.5rem;
      padding: 0.25rem 0.5rem;
    }

    .call-video-avatar-large {
      width: 5rem;
      height: 5rem;
    }
  }

  @media (min-width: 640px) and (max-width: 1023px) {
    .call-draggable-video {
      width: 8rem;
      height: 6rem;
    }
  }

  @media (min-width: 1024px) {
    .call-draggable-video {
      width: 12rem;
      height: 9rem;
    }
  }

  /* Landscape orientation optimization */
  @media (orientation: landscape) and (max-height: 600px) {
    .call-draggable-video {
      width: 6rem;
      height: 8rem;
      bottom: 0.5rem !important;
    }

    .call-header {
      padding: 0.25rem 0.75rem;
    }

    .call-waiting-icon {
      width: 4rem;
      height: 4rem;
    }
  }

  /* GPU Acceleration */
  .call-video-content,
  .call-main-video-content,
  .call-draggable-video {
    transform: translateZ(0);
    -webkit-transform: translateZ(0);
    will-change: transform;
  }

  /* Safe area support for mobile devices */
  @supports (padding: env(safe-area-inset-bottom)) {
    .call-draggable-video {
      bottom: max(6rem, calc(env(safe-area-inset-bottom) + 5.5rem)) !important;
    }

    .call-header {
      padding-top: max(0.5rem, env(safe-area-inset-top));
    }
  }
`;

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
  // Inject styles
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.id = 'call-layout-styles';
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);

    return () => {
      const existingStyle = document.getElementById('call-layout-styles');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

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

  // Enhanced local video playback
  useEffect(() => {
    const playLocalVideo = async () => {
      if (callType === 'video' &&
        agora.localTracks.length >= 2 &&
        agora.localTracks[1] &&
        !agora.isVideoOff &&
        !controls.videoToggleInProgress) {

        const shouldShowInMain = agora.remoteUsers.length > 0 && !agora.remoteUserStates[agora.remoteUsers[0]?.uid]?.hasVideo;
        const targetRef = shouldShowInMain ? agora.localVideoMainRef : agora.localVideoRef;

        if (!targetRef.current) return;

        let retries = 0;
        const maxRetries = 3;

        while (retries < maxRetries) {
          try {
            try { agora.localTracks[1].stop(); } catch (e) { /* Ignore */ }
            await agora.localTracks[1].play(targetRef.current);
            agora.setLocalVideoReady(true);
            break;
          } catch (err) {
            retries++;
            if (retries >= maxRetries) {
              console.error('Failed to play local video after all retries');
              agora.setLocalVideoReady(false);
            } else {
              await new Promise(resolve => setTimeout(resolve, 300));
            }
          }
        }
      } else if (agora.isVideoOff) {
        agora.setLocalVideoReady(false);
      }
    };

    playLocalVideo();
  }, [agora.localTracks, agora.isVideoOff, callType, controls.videoToggleInProgress, agora.remoteUsers, agora.remoteUserStates]);

  // Ensure local video is initially visible and playing
  useEffect(() => {
    const ensureLocalVideo = async () => {
      if (callType === 'video' &&
        agora.localTracks.length >= 2 &&
        agora.localTracks[1] &&
        !agora.isVideoOff) {

        const shouldShowInMain = agora.remoteUsers.length > 0 && !agora.remoteUserStates[agora.remoteUsers[0]?.uid]?.hasVideo;
        const targetRef = shouldShowInMain ? agora.localVideoMainRef : agora.localVideoRef;

        if (!targetRef.current) return;

        try {
          try { agora.localTracks[1].stop(); } catch (e) { /* Ignore */ }
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
  }, [agora.localTracks, callType, agora.isVideoOff, agora.remoteUsers, agora.remoteUserStates]);

  // Memoized video area rendering
  const renderVideoArea = useCallback(() => {
    if (agora.remoteUsers.length > 0) {
      const remoteUser = agora.remoteUsers[0];
      const userState = agora.remoteUserStates[remoteUser.uid];

      if (userState?.hasVideo) {
        return (
          <>
            {/* Remote user in main view - Full Screen */}
            <div className="call-video-fullscreen">
              <RemoteUser
                user={remoteUser}
                callType={callType}
                isFullscreen
                audioLevel={agora.audioLevels.remote[remoteUser.uid] || 0}
                userState={userState}
              />
            </div>

            {/* Local user overlay (draggable) - Smaller */}
            <DraggableLocalVideo
              agora={agora}
              controls={controls}
              ui={ui}
              callType={callType}
            />
          </>
        );
      } else {
        return (
          <>
            {/* Local user in main view (when remote camera is off) */}
            <div className="call-video-fullscreen">
              <MainLocalVideo
                agora={agora}
                controls={controls}
                callType={callType}
                ui={ui}
              />
            </div>

            {/* Remote user overlay (draggable) - Smaller */}
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
      return (
        // No remote users - show waiting screen
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
            <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '0.25rem' }}>Please wait</p>
          </div>
        </div>
      )}

      {/* User left notification */}
      {agora.userLeftNotification && (
        <div className={`call-notification call-notification-center ${agora.userLeftNotification.type === 'joined'
            ? 'call-notification-joined'
            : 'call-notification-left'
          }`}>
          {agora.userLeftNotification.type === 'joined' ? (
            <agora.icons.FaCheckCircle />
          ) : (
            <agora.icons.FaUserTimes />
          )}
          <span>{agora.userLeftNotification.message}</span>
        </div>
      )}

      {/* Camera state notification */}
      {agora.cameraStateNotification && (
        <div className={`call-notification call-notification-right ${agora.cameraStateNotification.type === 'cameraOn' ? 'call-notification-camera-on' :
            agora.cameraStateNotification.type === 'cameraOff' ? 'call-notification-camera-off' :
              'call-notification-audio'
          }`}>
          {agora.cameraStateNotification.type === 'cameraOn' ? (
            <agora.icons.FaVideo />
          ) : agora.cameraStateNotification.type === 'cameraOff' ? (
            <agora.icons.FaVideoSlash />
          ) : agora.cameraStateNotification.type === 'audioToggle' ? (
            <agora.icons.FaMicrophone />
          ) : (
            <agora.icons.FaDesktop />
          )}
          <span>{agora.cameraStateNotification.message}</span>
        </div>
      )}

      {/* Token expiry warning */}
      {agora.tokenExpiryWarning && (
        <div className="call-notification call-notification-center call-notification-warning">
          <agora.icons.FaExclamationTriangle />
          <span>Session expiring soon. Renewing...</span>
        </div>
      )}

      {/* Connection error notification */}
      {agora.error && !agora.reconnecting && agora.connectionState !== 'DISCONNECTED' && (
        <div className="call-notification call-notification-center call-notification-error">
          <agora.icons.FaExclamationTriangle />
          <span>{agora.error}</span>
        </div>
      )}

      {/* Header - Minimal and Transparent */}
      {ui.showHeader && (
        <div className="call-header">
          <div className="call-header-content">
            <div className="call-header-info">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <agora.icons.FaWifi style={{
                  color: agora.networkQuality.uplink <= 2 ? '#22c55e' :
                    agora.networkQuality.uplink <= 4 ? '#eab308' : '#ef4444'
                }} />
                <div>
                  <h1 className="call-header-title">
                    {callType === 'video' ? 'Video Call' : 'Audio Call'}
                  </h1>
                  <div className="call-header-meta">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <agora.icons.FaClock />
                      <span>{ui.formatDuration(agora.callDuration)}</span>
                    </span>
                    <span>•</span>
                    <span>{agora.remoteUsers.length} participant{agora.remoteUsers.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="call-header-status">
              <NetworkQualityIndicator
                quality={agora.networkQuality.uplink}
                getNetworkQualityInfo={ui.getNetworkQualityInfo}
              />
              <div className={`call-status-badge ${agora.connectionState === 'CONNECTED' ? 'call-status-connected' :
                  agora.connectionState === 'CONNECTING' ? 'call-status-connecting' :
                    'call-status-disconnected'
                }`}>
                <div className="call-status-dot"></div>
                <span>{agora.connectionState === 'CONNECTED' ? 'Live' : agora.connectionState}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Area - Full Screen with Smart Switching */}
      <div className="call-video-area">
        {renderVideoArea()}
      </div>
    </div>
  );
};

// Sub-components for better organization - All optimized with React.memo
const DraggableLocalVideo = React.memo(({ agora, controls, ui, callType }) => (
  <div
    className={`call-draggable-video ${ui.dragging ? 'dragging' : ''}`}
    style={{
      left: ui.overlayPos.x !== null ? `${ui.overlayPos.x}px` : 'auto',
      top: ui.overlayPos.y !== null ? `${ui.overlayPos.y}px` : 'auto',
      right: ui.overlayPos.x === null ? '1rem' : 'auto',
      bottom: ui.overlayPos.y === null ? '6rem' : 'auto',
    }}
    onMouseDown={ui.handleOverlayMouseDown}
    onTouchStart={ui.handleOverlayMouseDown}
  >
    <div className="call-video-badge">
      <div className="call-video-badge-content">
        <agora.icons.FaUser style={{ color: '#60a5fa' }} />
        {agora.isAudioMuted ? (
          <agora.icons.FaMicrophoneSlash style={{ color: '#f87171' }} />
        ) : (
          <AudioLevelIndicator level={agora.audioLevels.local} getAudioLevelBars={ui.getAudioLevelBars} />
        )}
      </div>
    </div>

    {controls.isVideoLoading && (
      <div className="call-video-loading">
        <div>
          <div className="call-video-loading-spinner"></div>
        </div>
      </div>
    )}

    <div ref={agora.localVideoRef} className="call-video-content">
      {(agora.isVideoOff || callType === 'audio' || !agora.localVideoReady) && !controls.isVideoLoading && (
        <div className="call-video-placeholder">
          <div className="call-video-avatar">
            <agora.icons.FaUser style={{ color: 'white', fontSize: '1rem' }} />
          </div>
        </div>
      )}
    </div>
  </div>
));

const MainLocalVideo = React.memo(({ agora, controls, callType, ui }) => (
  <div className="call-main-video">
    <div className="call-main-video-badge">
      <div className="call-main-video-badge-content">
        <agora.icons.FaUser style={{ color: '#60a5fa', fontSize: '0.875rem' }} />
        <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'white' }}>You</span>
        {agora.isAudioMuted ? (
          <agora.icons.FaMicrophoneSlash style={{ color: '#f87171', fontSize: '0.75rem', marginLeft: '0.25rem' }} />
        ) : (
          <AudioLevelIndicator level={agora.audioLevels.local} getAudioLevelBars={ui.getAudioLevelBars} />
        )}
      </div>
    </div>

    {controls.isVideoLoading && (
      <div className="call-video-loading">
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '3rem',
            height: '3rem',
            border: '4px solid white',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            margin: '0 auto 0.75rem',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ fontSize: '0.875rem', color: 'white', fontWeight: 500 }}>Loading video...</p>
        </div>
      </div>
    )}

    <div ref={agora.localVideoMainRef} className="call-main-video-content">
      {(agora.isVideoOff || callType === 'audio' || !agora.localVideoReady) && !controls.isVideoLoading && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div className="call-video-avatar call-video-avatar-large">
            <agora.icons.FaUser style={{ color: 'white', fontSize: '2.5rem' }} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '1rem', color: '#9ca3af', fontWeight: 500 }}>
              {callType === 'audio' ? 'Audio only' : 'Your camera is off'}
            </p>
          </div>
        </div>
      )}
    </div>
  </div>
));

const DraggableRemoteVideo = React.memo(({ user, userState, ui, agora }) => (
  <div
    className={`call-draggable-video remote ${ui.dragging ? 'dragging' : ''}`}
    style={{
      left: ui.overlayPos.x !== null ? `${ui.overlayPos.x}px` : 'auto',
      top: ui.overlayPos.y !== null ? `${ui.overlayPos.y}px` : 'auto',
      right: ui.overlayPos.x === null ? '1rem' : 'auto',
      bottom: ui.overlayPos.y === null ? '6rem' : 'auto',
    }}
    onMouseDown={ui.handleOverlayMouseDown}
    onTouchStart={ui.handleOverlayMouseDown}
  >
    <div className="call-video-badge">
      <div className="call-video-badge-content">
        <agora.icons.FaUser style={{ color: '#22c55e' }} />
        <span>User</span>
        {!userState?.hasAudio && (
          <agora.icons.FaMicrophoneSlash style={{ color: '#f87171' }} />
        )}
      </div>
    </div>

    <div className="call-video-content">
      <div className="call-video-placeholder">
        <div className="call-video-avatar" style={{ width: '2rem', height: '2rem', background: 'linear-gradient(135deg, #22c55e, #3b82f6)' }}>
          <agora.icons.FaUser style={{ color: 'white', fontSize: '0.875rem' }} />
        </div>
        <agora.icons.FaVideoSlash style={{ color: '#eab308', fontSize: '0.75rem' }} />
      </div>
    </div>
  </div>
));

// Add display names for better debugging
DraggableLocalVideo.displayName = 'DraggableLocalVideo';
MainLocalVideo.displayName = 'MainLocalVideo';
DraggableRemoteVideo.displayName = 'DraggableRemoteVideo';

// Wrap with React.memo for performance
export default React.memo(CallLayout);



