import React from 'react';
import AudioLevelIndicator from './AudioLevelIndicator';


export const DraggableLocalVideo = React.memo(({ agora, controls, ui, callType }) => {
  return (
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
      {/* Badge with user info and audio indicator */}
      <div className="call-video-badge">
        <div className="call-video-badge-content">
          <agora.icons.FaUser style={{ color: '#60a5fa' }} />
          {agora.isAudioMuted ? (
            <agora.icons.FaMicrophoneSlash style={{ color: '#f87171' }} />
          ) : (
            <AudioLevelIndicator 
              level={agora.audioLevels.local} 
              getAudioLevelBars={ui.getAudioLevelBars} 
            />
          )}
        </div>
      </div>

      {/* Loading indicator */}
      {controls.isVideoLoading && (
        <div className="call-video-loading">
          <div>
            <div className="call-video-loading-spinner"></div>
          </div>
        </div>
      )}

      {/* Video content area */}
      <div ref={agora.localVideoRef} className="call-video-content">
        {(agora.isVideoOff || callType === 'audio' || !agora.localVideoReady) && 
         !controls.isVideoLoading && (
          <div className="call-video-placeholder">
            <div className="call-video-avatar">
              <agora.icons.FaUser style={{ color: 'white', fontSize: '1rem' }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

DraggableLocalVideo.displayName = 'DraggableLocalVideo';

export const MainLocalVideo = React.memo(({ agora, controls, callType, ui }) => {
  return (
    <div className="call-main-video">
      {/* Badge with user info */}
      <div className="call-main-video-badge">
        <div className="call-main-video-badge-content">
          <agora.icons.FaUser style={{ color: '#60a5fa', fontSize: '0.875rem' }} />
          <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'white' }}>
            You
          </span>
          {agora.isAudioMuted ? (
            <agora.icons.FaMicrophoneSlash style={{ 
              color: '#f87171', 
              fontSize: '0.75rem', 
              marginLeft: '0.25rem' 
            }} />
          ) : (
            <AudioLevelIndicator 
              level={agora.audioLevels.local} 
              getAudioLevelBars={ui.getAudioLevelBars} 
            />
          )}
        </div>
      </div>

      {/* Loading indicator */}
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
            <p style={{ fontSize: '0.875rem', color: 'white', fontWeight: 500 }}>
              Loading video...
            </p>
          </div>
        </div>
      )}

      {/* Main video content area */}
      <div ref={agora.localVideoMainRef} className="call-main-video-content">
        {(agora.isVideoOff || callType === 'audio' || !agora.localVideoReady) && 
         !controls.isVideoLoading && (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: '1rem' 
          }}>
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
  );
});

MainLocalVideo.displayName = 'MainLocalVideo';


export const DraggableRemoteVideo = React.memo(({ user, userState, ui, agora }) => {
  return (
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
      {/* Badge with user info */}
      <div className="call-video-badge">
        <div className="call-video-badge-content">
          <agora.icons.FaUser style={{ color: '#22c55e' }} />
          <span>User</span>
          {!userState?.hasAudio && (
            <agora.icons.FaMicrophoneSlash style={{ color: '#f87171' }} />
          )}
        </div>
      </div>

      {/* Video placeholder */}
      <div className="call-video-content">
        <div className="call-video-placeholder">
          <div 
            className="call-video-avatar" 
            style={{ 
              width: '2rem', 
              height: '2rem', 
              background: 'linear-gradient(135deg, #22c55e, #3b82f6)' 
            }}
          >
            <agora.icons.FaUser style={{ color: 'white', fontSize: '0.875rem' }} />
          </div>
          <agora.icons.FaVideoSlash style={{ color: '#eab308', fontSize: '0.75rem' }} />
        </div>
      </div>
    </div>
  );
});

DraggableRemoteVideo.displayName = 'DraggableRemoteVideo';