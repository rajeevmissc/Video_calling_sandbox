import { useState, useRef, useCallback } from 'react';

export const useCallUI = () => {
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [overlayPos, setOverlayPos] = useState({ x: null, y: null });
  const [dragging, setDragging] = useState(false);
  const [showHeader, setShowHeader] = useState(true);

  const dragOffset = useRef({ x: 0, y: 0 });

  // Dragging functionality
  const handleOverlayMouseDown = useCallback((e) => {
    setDragging(true);
    const overlay = e.currentTarget;
    const rect = overlay.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    e.preventDefault();
  }, []);

  // Handle mouse move for dragging
  const handleMouseMove = useCallback((e) => {
    if (!dragging) return;
    setOverlayPos({
      x: e.clientX - dragOffset.current.x,
      y: e.clientY - dragOffset.current.y
    });
  }, [dragging]);

  // Handle mouse up for dragging
  const handleMouseUp = useCallback(() => {
    setDragging(false);
  }, []);

  // Format duration helper
  const formatDuration = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Network quality indicator
  const getNetworkQualityInfo = useCallback((quality) => {
    const getQualityColor = () => {
      if (quality === 0) return 'text-gray-300';
      if (quality <= 2) return 'text-green-400';
      if (quality <= 4) return 'text-yellow-400';
      return 'text-red-400';
    };

    const getQualityText = () => {
      if (quality === 0) return 'Unknown';
      if (quality <= 2) return 'Excellent';
      if (quality <= 4) return 'Good';
      return 'Poor';
    };

    return { color: getQualityColor(), text: getQualityText() };
  }, []);

  // Audio level indicator
  const getAudioLevelBars = useCallback((level) => {
    const bars = Math.ceil(level * 5);
    return [1, 2, 3, 4, 5].map(i => ({
      index: i,
      active: i <= bars
    }));
  }, []);

  return {
    // State
    showChat,
    setShowChat,
    showParticipants,
    setShowParticipants,
    overlayPos,
    setOverlayPos,
    dragging,
    setDragging,
    showHeader,
    setShowHeader,

    // Functions
    handleOverlayMouseDown,
    handleMouseMove,
    handleMouseUp,
    formatDuration,
    getNetworkQualityInfo,
    getAudioLevelBars
  };
};




