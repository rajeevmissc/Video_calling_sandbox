import React from 'react';

const AudioLevelIndicator = ({ level, getAudioLevelBars }) => {
  const bars = getAudioLevelBars(level);

  return (
    <div className="flex items-center space-x-0.5">
      {bars.map(bar => (
        <div
          key={bar.index}
          className={`w-1 h-2 rounded-full transition-colors duration-100 ${bar.active ? 'bg-green-400' : 'bg-gray-400'
            }`}
        />
      ))}
    </div>
  );
};

export default AudioLevelIndicator;