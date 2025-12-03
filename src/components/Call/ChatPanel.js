import { useRef, useEffect, useState } from "react";
import { formatTimer } from './utils/callHelpers';
import {
  FaComments,
  FaTimes,
  FaPaperPlane,
  FaUser,
  FaUserCircle,
  FaSmile,
  FaReply,
  FaCheck,
  FaCheckDouble,
  FaPaperclip,
  FaChevronDown,
} from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";

const ChatPanel = ({
  chatMessages,
  chatInput,
  setChatInput,
  sendMessage,
  remoteUsers,
  onClose,
  onEndChat,            // <-- new: called when ending chat (used on mobile)
  callDuration,
  currentUserId = "local",
  isWaitingForProvider = false,
  isRemoteTyping = false,
  onTypingChange,
  providerName
}) => {
  const chatEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const typingTimeoutRef = useRef(null);
  const lastScrollTop = useRef(0);
  const lastMessageCount = useRef(0);

  const [isMobile, setIsMobile] = useState(false);
  console.log('endchat', onEndChat)
  // Detect mobile viewport (max-width 640px) and update on resize/change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(max-width: 640px)');
    const handler = (e) => setIsMobile(e.matches);
    setIsMobile(mql.matches);
    // modern API
    if (mql.addEventListener) {
      mql.addEventListener('change', handler);
    } else {
      mql.addListener(handler); // fallback
    }
    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener('change', handler);
      } else {
        mql.removeListener(handler);
      }
    };
  }, []);

  const getUserRole = () => {
    try {
      const userData = localStorage.getItem("userData");
      if (userData) {
        const parsed = JSON.parse(userData);
        return parsed.role || "user";
      }
    } catch (error) {
      console.error("Error parsing userData:", error);
    }
    return "user";
  };

  const userRole = getUserRole();

  const getOnlineStatusText = () => {
    if (isWaitingForProvider) {
      return userRole === "provider"
        ? "Waiting for user..."
        : "Waiting for provider...";
    }

    if (remoteUsers.length > 0) {
      return userRole === "provider"
        ? "User online"
        : providerName;
    }

    return "Offline";
  };

  // Handle scroll behavior
  const handleScroll = () => {
    if (!chatContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    const isNearBottom = distanceFromBottom < 100;

    setAutoScroll(isNearBottom);
    setShowScrollButton(!isNearBottom && distanceFromBottom > 200);

    // Reset unread count when scrolling to bottom
    if (isNearBottom) {
      setUnreadCount(0);
    }

    lastScrollTop.current = scrollTop;
  };

  // Track new messages when not at bottom
  useEffect(() => {
    if (chatMessages.length > lastMessageCount.current) {
      const newMessagesCount = chatMessages.length - lastMessageCount.current;
      if (!autoScroll) {
        setUnreadCount(prev => prev + newMessagesCount);
      }
      lastMessageCount.current = chatMessages.length;
    }
  }, [chatMessages, autoScroll]);

  // Scroll to bottom
  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
      setUnreadCount(0);
    }
  };

  // Auto-scroll for new messages and typing indicator
  useEffect(() => {
    if (autoScroll && chatEndRef.current) {
      setTimeout(() => {
        chatEndRef.current.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [chatMessages, isRemoteTyping, autoScroll]);

  // Handle typing indicator
  const handleInputChange = (e) => {
    setChatInput(e.target.value);

    if (onTypingChange) {
      onTypingChange(true);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        onTypingChange(false);
      }, 2000);
    }
  };

  // Handle message send
  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    let messageToSend = chatInput;

    if (replyingTo) {
      messageToSend = JSON.stringify({
        text: chatInput,
        replyTo: {
          id: replyingTo.id,
          text: replyingTo.text,
          sender: replyingTo.sender
        }
      });
    }

    sendMessage(messageToSend);
    setReplyingTo(null);

    if (onTypingChange) {
      onTypingChange(false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }

    setAutoScroll(true);
    setTimeout(scrollToBottom, 100);
  };

  // Handle message long press
  const handleMessageLongPress = (message, e) => {
    e?.preventDefault();
    setSelectedMessage(message);
  };

  // Format time
  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';

    try {
      if (typeof timestamp === 'string' && timestamp.includes(':')) {
        return timestamp;
      }

      const date = new Date(timestamp);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      return '';
    }
  };

  // Parse message
  const parseMessage = (message) => {
    try {
      if (typeof message.text === 'string' && message.text.startsWith('{')) {
        const parsed = JSON.parse(message.text);
        return {
          ...message,
          text: parsed.text,
          replyTo: parsed.replyTo
        };
      }
    } catch (error) {
      // Not JSON
    }
    return message;
  };

  // Group messages by date
  const groupMessagesByDate = (messages) => {
    const groups = [];
    let currentDate = null;
    let currentGroup = [];

    messages.forEach(msg => {
      const msgDate = new Date(msg.timestamp || Date.now()).toDateString();

      if (msgDate !== currentDate) {
        if (currentGroup.length > 0) {
          groups.push({ date: currentDate, messages: currentGroup });
        }
        currentDate = msgDate;
        currentGroup = [msg];
      } else {
        currentGroup.push(msg);
      }
    });

    if (currentGroup.length > 0) {
      groups.push({ date: currentDate, messages: currentGroup });
    }

    return groups;
  };



  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const isOnline = remoteUsers.length > 0 && !isWaitingForProvider;
  const messageGroups = groupMessagesByDate(chatMessages);

  return (
    <div className="h-full w-full bg-[#0a0e1a] flex flex-col relative">

      {/* WhatsApp-Style Header */}
      <div className="bg-[#1a1f2e] p-3 sm:p-4 border-b border-gray-800 flex-shrink-0 shadow-lg">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            {/* Avatar with online indicator */}
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center ring-2 ring-blue-500 ring-opacity-30">
                <FaUserCircle className="text-white text-lg" />
              </div>
              {isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1a1f2e]"></div>
              )}
            </div>

            <div className="flex flex-col">
              <h3 className="font-semibold text-white text-sm sm:text-base">
                {userRole === "provider" ? "User" : "Happiness Care Executive"}
              </h3>
              <div className="flex items-center space-x-1.5">
                <span
                  className={`text-xs ${isOnline ? "text-green-400" : "text-gray-500"
                    }`}
                >
                  {isRemoteTyping ? (
                    <span className="flex items-center gap-1">
                      <span className="animate-pulse">typing</span>
                      <span className="flex gap-0.5">
                        <span className="w-1 h-1 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-1 h-1 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-1 h-1 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </span>
                    </span>
                  ) : (
                    getOnlineStatusText()
                  )}
                </span>
              </div>
            </div>
          </div>


          <div className="flex items-center gap-2">
            {/* Timer only on mobile */}
            {isMobile && typeof callDuration !== 'undefined' && (
              <div className="hidden sm:hidden flex items-center mr-2 text-xs text-gray-300 px-2 py-1 rounded-md bg-gray-800/40">
                <span className="mr-1">⏱</span>
                <span>{formatTimer(callDuration)}</span>
              </div>
            )}

            <button className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-colors">
              <BsThreeDotsVertical className="text-lg" />
            </button>

            {/* ============================
       MOBILE: Show "End Chat"
       DESKTOP: Show X icon
     ============================ */}
            {isMobile ? (
              <button
                onClick={() => {
                  if (typeof onEndChat === "function") {
                    console.log("Mobile end-chat triggered");
                    onEndChat();
                  }
                }}
                className="text-red-400 hover:text-white px-3 py-1 rounded-lg hover:bg-red-500/20 transition-colors text-sm font-medium"
              >
                End Chat
              </button>
            ) : (
              <button
                onClick={() => {
                  if (typeof onClose === "function") {
                    console.log("Desktop close triggered");
                    onClose();
                  }
                }}
                className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-colors"
                title="Close"
              >
                <FaTimes className="text-lg" />
              </button>
            )}
          </div>


        </div>
      </div>

      {/* Messages Container */}
      <div
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-3 sm:p-4 bg-[#0a0e1a] relative"
        style={{
          scrollBehavior: 'smooth',
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.03) 0%, transparent 50%)'
        }}
      >
        {chatMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 py-8 sm:py-12">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-4">
              <FaComments className="text-4xl text-blue-400 opacity-50" />
            </div>
            <p className="text-sm font-medium text-gray-400">No messages yet</p>
            <p className="text-xs mt-2 text-gray-600 max-w-xs">
              {isWaitingForProvider
                ? "Waiting for provider to join the conversation..."
                : "Send a message to start the conversation!"}
            </p>
          </div>
        ) : (
          messageGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-3">
              {/* Messages */}
              {group.messages.map((msg) => {
                const message = parseMessage(msg);
                const isCurrentUser =
                  message.isLocal ||
                  message.senderId === currentUserId ||
                  message.sender === "You" ||
                  message.sender === currentUserId;

                const alignRight = isCurrentUser;
                // 100% correct emoji-only detector (numbers NEVER match)
                const isOnlyEmoji = (() => {
                  const trimmed = message.text.trim();

                  // Contains at least 1 emoji
                  const emojiChar = /\p{Emoji}/u;
                  const hasEmoji = emojiChar.test(trimmed);

                  // Contains ANY non-emoji normal characters (letters, numbers, punctuation, symbols)
                  const nonEmojiChar = /[0-9A-Za-z~`!@#$%^&*()\-_=+{}\[\]:;"'<>,.?/\\|]/;
                  const hasNonEmoji = nonEmojiChar.test(trimmed);

                  return hasEmoji && !hasNonEmoji;
                })();


                return (
                  <div
                    key={message.id}
                    className={`flex items-end gap-2 ${alignRight ? "flex-row-reverse" : "flex-row"
                      } group animate-fadeIn`}
                    onContextMenu={(e) => handleMessageLongPress(message, e)}
                    onClick={() => {
                      if (selectedMessage?.id === message.id) {
                        setSelectedMessage(null);
                      }
                    }}
                  >
                    {/* Avatar (only for received messages) */}
                    {!isCurrentUser && (
                      <div className="flex-shrink-0 mb-1">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center ring-2 ring-gray-700 ring-opacity-50">
                          <FaUserCircle className="text-white text-sm" />
                        </div>
                      </div>
                    )}

                    {/* Message Container */}
                    <div className={`flex flex-col max-w-[75%] ${alignRight ? 'items-end' : 'items-start'}`}>

                      {/* Reply Preview */}
                      {message.replyTo && (
                        <div className={`mb-1 w-full`}>
                          <div className={`${alignRight
                            ? 'bg-blue-600/20 border-l-2 border-blue-400'
                            : 'bg-gray-700/50 border-l-2 border-gray-500'
                            } rounded-md p-2 backdrop-blur-sm`}>
                            <div className="text-xs text-gray-400 truncate">
                              {message.replyTo.text}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Message Bubble */}
                      <div className="relative">
                        {/* Tail */}
                        {!isOnlyEmoji && (
                          <div
                            className={`absolute ${alignRight ? 'right-0 -mr-1' : 'left-0 -ml-1'
                              } bottom-0 w-3 h-3 overflow-hidden`}
                          >
                            <div
                              className={`w-3 h-3 ${alignRight
                                ? 'bg-gradient-to-br from-blue-600 to-blue-700 rotate-45 origin-bottom-left translate-x-1'
                                : 'bg-[#1a1f2e] -rotate-45 origin-bottom-right -translate-x-1'
                                }`}
                            ></div>
                          </div>
                        )}

                        {/* Bubble Content */}
                        <div
                          className={`${isOnlyEmoji
                            ? "bg-transparent p-0 shadow-none"
                            : alignRight
                              ? "bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-900/20"
                              : "bg-[#1a1f2e] shadow-lg shadow-black/20"
                            } ${isOnlyEmoji
                              ? ""
                              : alignRight
                                ? "rounded-2xl rounded-br-sm"
                                : "rounded-2xl rounded-bl-sm"
                            } ${isOnlyEmoji ? 'p-1' : 'px-3 py-2'} transition-all duration-200 hover:scale-[1.02]`}
                        >
                          <p
                            className={`${isOnlyEmoji
                              ? "text-4xl leading-tight"
                              : "text-sm leading-relaxed text-white"
                              } break-words whitespace-pre-wrap`}
                          >
                            {message.text}
                          </p>

                          {/* Time & Status */}
                          {!isOnlyEmoji && (
                            <div className={`flex items-center gap-1.5 mt-1 ${alignRight ? 'justify-end' : 'justify-start'}`}>
                              <span className="text-[10px] text-gray-300 opacity-70">
                                {formatMessageTime(message.timestamp)}
                              </span>
                              {isCurrentUser && (
                                <FaCheckDouble className="text-[10px] text-blue-200" />
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Reply Button */}
                      {selectedMessage?.id === message.id && (
                        <button
                          onClick={() => {
                            setReplyingTo(message);
                            setSelectedMessage(null);
                            inputRef.current?.focus();
                          }}
                          className={`mt-2 flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 bg-gray-800/80 backdrop-blur-sm px-3 py-1.5 rounded-full transition-all hover:bg-gray-800 animate-fadeIn shadow-lg`}
                        >
                          <FaReply className="text-xs" />
                          Reply
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}

        {/* Typing Indicator Bubble - WhatsApp Style */}
        {isRemoteTyping && (
          <div className="flex items-end gap-2 flex-row animate-fadeIn mt-3">
            {/* Avatar */}
            <div className="flex-shrink-0 mb-1">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center ring-2 ring-gray-700 ring-opacity-50">
                <FaUserCircle className="text-white text-sm" />
              </div>
            </div>

            {/* Typing Bubble */}
            <div className="relative">
              {/* Tail */}
              <div className="absolute left-0 -ml-1 bottom-0 w-3 h-3 overflow-hidden">
                <div className="w-3 h-3 bg-[#1a1f2e] -rotate-45 origin-bottom-right -translate-x-1"></div>
              </div>

              {/* Bubble Content */}
              <div className="bg-[#1a1f2e] rounded-2xl rounded-bl-sm px-5 py-3 shadow-lg shadow-black/20">
                <div className="flex space-x-1.5 items-center">
                  <div
                    className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDuration: '1.4s', animationDelay: '0ms' }}
                  ></div>
                  <div
                    className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDuration: '1.4s', animationDelay: '200ms' }}
                  ></div>
                  <div
                    className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDuration: '1.4s', animationDelay: '400ms' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Scroll to Bottom Button */}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-24 right-6 bg-gradient-to-br from-blue-600 to-blue-700 text-white p-3 rounded-full shadow-2xl hover:scale-110 transition-all duration-200 z-10 animate-fadeIn"
        >
          <FaChevronDown className="text-lg" />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-lg">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Reply Preview Bar */}
      {replyingTo && (
        <div className="px-3 sm:px-4 py-3 bg-[#1a1f2e] border-t border-gray-800 flex items-start gap-3 animate-slideUp">
          <div className="w-1 h-12 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-blue-400 font-semibold mb-0.5">
              Replying to message
            </div>
            <div className="text-sm text-gray-300 truncate">
              {replyingTo.text}
            </div>
          </div>
          <button
            onClick={() => setReplyingTo(null)}
            className="text-gray-400 hover:text-white p-1.5 hover:bg-gray-800 rounded-lg transition-colors flex-shrink-0"
          >
            <MdClose className="text-xl" />
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="p-3 sm:p-4 border-t border-gray-800 bg-[#1a1f2e] flex-shrink-0 relative">

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="absolute bottom-20 left-4 z-50 animate-fadeIn">
            <EmojiPicker
              theme="dark"
              height={400}
              width={320}
              onEmojiClick={(emoji) => {
                setChatInput((prev) => prev + emoji.emoji);
                setShowEmojiPicker(false);
                inputRef.current?.focus();
              }}
            />
          </div>
        )}

        <div className="flex items-center gap-2">

          {/* Emoji Button */}
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="text-gray-400 hover:text-white p-2.5 hover:bg-gray-800 rounded-lg transition-all"
            title="Emoji"
          >
            <FaSmile className="text-xl" />
          </button>

          {/* Input Container */}
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={chatInput}
              onChange={handleInputChange}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !isWaitingForProvider) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={
                isWaitingForProvider
                  ? "Waiting for provider..."
                  : replyingTo
                    ? "Type your reply..."
                    : "Type a message..."
              }
              disabled={isWaitingForProvider}
              className="w-full bg-[#0a0e1a] border border-gray-700 rounded-full px-4 py-3 pr-12 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-500"
            />
          </div>

          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            disabled={!chatInput.trim() || isWaitingForProvider}
            className="bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-700 disabled:to-gray-800 p-3 text-white rounded-full transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg disabled:shadow-none"
          >
            <FaPaperPlane className="text-base" />
          </button>

        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }

        /* Custom scrollbar */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: transparent;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(75, 85, 99, 0.5);
          border-radius: 3px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(75, 85, 99, 0.7);
        }
      `}</style>
    </div>
  );
};

export default ChatPanel;