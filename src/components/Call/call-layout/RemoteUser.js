import { useEffect, useRef, useState } from 'react';
import { FaUser, FaMicrophoneSlash, FaVideoSlash, FaMicrophone } from 'react-icons/fa';

const RemoteUser = ({ user, callType, isFullscreen, audioLevel, userState }) => {
  const videoRef = useRef(null);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);

  useEffect(() => {
    const playVideo = async () => {
      if (callType === 'video' && user.videoTrack && videoRef.current && userState?.hasVideo) {
        setVideoLoading(true);
        let retries = 0;
        const maxRetries = 3;

        while (retries < maxRetries) {
          try {
            await user.videoTrack.play(videoRef.current);
            setVideoPlaying(true);
            setVideoLoading(false);
            break;
          } catch (err) {
            retries++;
            console.error(`Error playing remote video (attempt ${retries}/${maxRetries}):`, err);

            if (retries < maxRetries) {
              await new Promise(resolve => setTimeout(resolve, 300));
            } else {
              setVideoPlaying(false);
              setVideoLoading(false);
            }
          }
        }
      } else if (!userState?.hasVideo) {
        setVideoPlaying(false);
        setVideoLoading(false);
      }
    };

    playVideo();

    if (user.audioTrack && userState?.hasAudio) {
      user.audioTrack.play();
    }

    return () => {
      if (user.videoTrack) {
        try {
          user.videoTrack.stop();
        } catch (e) {
          console.warn('Error stopping remote video:', e);
        }
      }
      setVideoPlaying(false);
    };
  }, [user, callType, userState]);

  return (
    <div className="w-full h-full flex items-center justify-center bg-black">
      <div className="w-full h-full relative">
        {/* User badge */}
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-black bg-opacity-70 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-600 shadow-lg">
            <div className="flex items-center space-x-2">
              <FaUser className="text-green-400 text-sm" />
              <span className="text-sm font-medium text-white">User {user.uid}</span>
              {userState?.hasAudio && audioLevel > 0 ? (
                <div className="flex items-center space-x-0.5 ml-1">
                  {[1, 2, 3].map(i => (
                    <div
                      key={i}
                      className={`w-1 h-2 rounded-full transition-colors duration-100 ${i <= Math.ceil(audioLevel * 3) ? 'bg-green-400' : 'bg-gray-500'
                        }`}
                    />
                  ))}
                </div>
              ) : !userState?.hasAudio ? (
                <FaMicrophoneSlash className="text-red-400 text-xs ml-1" />
              ) : null}
              {!userState?.hasVideo && (
                <FaVideoSlash className="text-yellow-400 text-xs ml-1" />
              )}
            </div>
          </div>
        </div>

        {/* Video loading indicator */}
        {videoLoading && userState?.hasVideo && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-sm text-white font-medium">Loading video...</p>
            </div>
          </div>
        )}

        {/* Video element */}
        <div
          ref={videoRef}
          className="w-full h-full bg-black flex items-center justify-center relative"
        >
          {/* Show avatar when no video */}
          {(callType === 'audio' || !userState?.hasVideo || (!videoPlaying && !videoLoading)) && (
            <div className="flex flex-col items-center space-y-4 absolute inset-0 bg-black flex items-center justify-center">
              <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-2xl ring-4 ring-green-500 ring-opacity-30">
                <FaUser className="text-white text-4xl" />
              </div>
              <div className="text-center">
                <p className="text-base text-gray-400 font-medium">
                  {callType === 'audio' ? 'Audio only' : userState?.hasVideo ? 'Loading...' : 'Camera is off'}
                </p>
                {userState?.hasAudio && (
                  <div className="flex items-center justify-center space-x-1 mt-2">
                    <FaMicrophone className="text-green-400 text-xs" />
                    <span className="text-xs text-green-400">Speaking</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RemoteUser;




