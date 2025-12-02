import React from 'react';
import { formatWaitingTime } from '../../utils/callHelpers';
import CallLayout from '../../call-layout/CallLayout';
import ControlPanel from '../../ControlPanel';

const CallModeLayout = ({
  callEnded,
  callStatus,
  waitingTime,
  agora,
  controls,
  ui,
  callType,
  isWaitingForProvider,
  billing,
  onEndCall,
  chatMessages,
  callData
}) => {
  return (
    <div className={`call-main-content ${ui.showChat && !callEnded ? 'chat-open' : ''}`}>
      {!callEnded && (
        <div className="call-status-indicator">
          <div className={`call-status-badge-top ${callStatus}`}>
            <div className="call-status-dot-indicator" />
            <span>
              {callStatus === "connected" && "Connected"}
              {callStatus === "waiting" && `Waiting for provider... ${formatWaitingTime(waitingTime)}`}
              {callStatus === "alone" && "No participants yet"}
            </span>
            {callStatus === "waiting" && waitingTime > 60 && (
              <span className="waiting-timeout-warning">
                {' '}(Auto-declining in {120 - waitingTime}s)
              </span>
            )}
          </div>
        </div>
      )}

      <div className="call-layout-wrapper">
        <CallLayout
          agora={agora}
          controls={controls}
          ui={ui}
          callType={callType}
          isWaitingForProvider={isWaitingForProvider}
          waitingTime={waitingTime}
          callStatus={callStatus}
          callEnded={callEnded}
          onEndCall={onEndCall}
          billing={billing}
        />
      </div>

      {!callEnded && (
        <div className="call-control-wrapper">
          <ControlPanel
            controls={controls}
            ui={ui}
            callType={callType}
            chatMessages={chatMessages}
            callStatus={callStatus}
            onEndCall={onEndCall}
            callData={callData}
          />
        </div>
      )}
    </div>
  );
};

export default React.memo(CallModeLayout);