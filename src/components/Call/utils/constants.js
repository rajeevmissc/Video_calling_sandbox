// Call status constants
export const CALL_STATUS = {
  WAITING: 'waiting',
  CONNECTED: 'connected',
  ENDED: 'ended',
  DECLINED: 'declined',
  ALONE: 'alone'
};

// Call type constants
export const CALL_TYPE = {
  AUDIO: 'audio',
  VIDEO: 'video',
  CHAT: 'chat'
};

// Timing constants
export const TIMING = {
  AUTO_DECLINE_TIMEOUT: 120000, // 2 minutes
  READY_DELAY: 5000, // 5 seconds
  CLEANUP_DELAY: 300,
  POPUP_DELAY: 500,
  END_POPUP_DELAY: 800,
  SWITCH_DELAY: 1500
};

// Session storage keys
export const STORAGE_KEYS = {
  CALL_SWITCH_STATE: 'callSwitchState'
};

// System message prefixes
export const SYSTEM_MESSAGES = {
  TYPING: 'SYSTEM:TYPING:',
  CALL_DECLINED: 'SYSTEM:CALL_DECLINED:',
  CHAT_ENDED: 'SYSTEM:CHAT_ENDED:',
  CALL_ENDED: 'SYSTEM:CALL_ENDED:',
  SWITCH_CALL_TYPE: 'SYSTEM:SWITCH_CALL_TYPE:'
};