// import React from 'react';
// import { formatWaitingTime } from '../../utils/callHelpers';

// const ChatModeOverlay = ({ 
//   isWaiting, 
//   callEnded, 
//   waitingTime 
// }) => {
//   if (!isWaiting || callEnded) return null;

//   return (
//     <div className="chat-mode-loading-overlay" style={{ zIndex: 100 }}>
//       <div className="chat-loading-spinner"></div>
//       <div className="chat-loading-content">
//         <h2 className="chat-loading-title">Waiting for Happiness Executive</h2>
//         <p className="chat-loading-message">
//           Your chat request has been sent. A happiness executive will join shortly to assist you.
//         </p>
//         <div className="chat-loading-status">
//           <div className="chat-loading-pulse-dot"></div>
//           <span>Waiting... {formatWaitingTime(waitingTime)}</span>
//         </div>
//         {waitingTime > 60 && (
//           <p className="chat-loading-timeout-warning">
//             Auto-declining in {120 - waitingTime} seconds if no response...
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default React.memo(ChatModeOverlay);




import React from 'react';
import { formatWaitingTime } from '../../utils/callHelpers';

const ChatModeOverlay = ({ 
  isWaiting, 
  callEnded, 
  waitingTime 
}) => {
  if (!isWaiting || callEnded) return null;

  return (
    <div 
      className="chat-mode-loading-overlay flex items-center justify-center p-4" 
      style={{ zIndex: 100 }}
    >
      {/* WRAPPER: Mobile = column, Desktop = row */}
      <div className="w-full max-w-lg flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">

        {/* Spinner (no class changed, only tailwind added) */}
        <div className="chat-loading-spinner w-16 h-16"></div>

        {/* RIGHT CONTENT */}
        <div className="chat-loading-content flex flex-col items-center md:items-start gap-2">
          
          <h2 className="chat-loading-title">Waiting for Happiness Executive</h2>

          <p className="chat-loading-message">
            Your chat request has been sent. A happiness executive will join shortly to assist you.
          </p>

          <div className="chat-loading-status flex items-center gap-2 mt-1">
            <div className="chat-loading-pulse-dot"></div>
            <span>Waiting... {formatWaitingTime(waitingTime)}</span>
          </div>

          {waitingTime > 60 && (
            <p className="chat-loading-timeout-warning">
              Auto-declining in {120 - waitingTime} seconds if no response...
            </p>
          )}

        </div>
      </div>
    </div>
  );
};

export default React.memo(ChatModeOverlay);
