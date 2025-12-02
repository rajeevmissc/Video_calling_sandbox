import React from 'react';
import { FaSignal } from 'react-icons/fa';

const NetworkQualityIndicator = ({ quality, getNetworkQualityInfo }) => {
  const { color, text } = getNetworkQualityInfo(quality);

  return (
    <div className={`flex items-center space-x-1 ${color}`}>
      <FaSignal className="text-sm" />
      <span className="text-xs">{text}</span>
    </div>
  );
};

export default NetworkQualityIndicator;