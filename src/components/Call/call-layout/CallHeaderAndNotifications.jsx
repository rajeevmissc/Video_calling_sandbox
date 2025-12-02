import React from 'react';
import NetworkQualityIndicator from './NetworkQualityIndicator';


export const CallHeader = React.memo(({ agora, ui, callType }) => {
  return (
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
                <span>
                  {agora.remoteUsers.length} participant{agora.remoteUsers.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="call-header-status">
          <NetworkQualityIndicator
            quality={agora.networkQuality.uplink}
            getNetworkQualityInfo={ui.getNetworkQualityInfo}
          />
          <div className={`call-status-badge ${
            agora.connectionState === 'CONNECTED' ? 'call-status-connected' :
            agora.connectionState === 'CONNECTING' ? 'call-status-connecting' :
            'call-status-disconnected'
          }`}>
            <div className="call-status-dot"></div>
            <span>
              {agora.connectionState === 'CONNECTED' ? 'Live' : agora.connectionState}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

CallHeader.displayName = 'CallHeader';


export const CallNotifications = React.memo(({ agora }) => {
  return (
    <>
      {/* User joined/left notification */}
      {agora.userLeftNotification && (
        <div className={`call-notification call-notification-center ${
          agora.userLeftNotification.type === 'joined'
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
        <div className={`call-notification call-notification-right ${
          agora.cameraStateNotification.type === 'cameraOn' ? 'call-notification-camera-on' :
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
    </>
  );
});

CallNotifications.displayName = 'CallNotifications';