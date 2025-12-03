// components/ProviderCallAlert/EnableCallAlertsPrompt.jsx
import { useState, useEffect } from 'react';

const EnableCallAlertsPrompt = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if already enabled in this session
    const enabled = sessionStorage.getItem('callAlertsEnabled');
    if (enabled === 'true') {
      setIsEnabled(true);
      setIsDismissed(true);
    }
  }, []);

  const enableAlerts = async () => {
    try {
      // Unlock audio
      const testAudio = new Audio('https://commondatastorage.googleapis.com/codeskulptor-assets/Epoq-Lepidoptera.ogg');
      testAudio.volume = 0.1;
      await testAudio.play();
      testAudio.pause();
      testAudio.currentTime = 0;

      // Test vibration
      if ('vibrate' in navigator) {
        navigator.vibrate(100);
      }

      // Request notification permission
      if (Notification.permission === 'default') {
        await Notification.requestPermission();
      }

      // Mark as enabled
      sessionStorage.setItem('callAlertsEnabled', 'true');
      window.audioUnlocked = true;
      
      setIsEnabled(true);
      setTimeout(() => setIsDismissed(true), 2000);

      console.log('✅ Call alerts enabled successfully!');
    } catch (err) {
      console.error('❌ Failed to enable alerts:', err);
      alert('Please allow audio and notifications for call alerts');
    }
  };

  if (isDismissed) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '16px',
        zIndex: 9998,
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
        <span style={{ fontSize: '24px' }}>🔔</span>
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
            {isEnabled ? '✅ Call Alerts Enabled!' : 'Enable Call Alerts'}
          </div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>
            {isEnabled 
              ? 'You will receive ringtone and vibration for incoming calls'
              : 'Tap to enable ringtone, vibration, and notifications for incoming calls'
            }
          </div>
        </div>
      </div>

      {!isEnabled ? (
        <button
          onClick={enableAlerts}
          style={{
            background: 'white',
            color: '#667eea',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 24px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        >
          🔊 Enable Now
        </button>
      ) : (
        <button
          onClick={() => setIsDismissed(true)}
          style={{
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '8px',
            padding: '8px 16px',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          Dismiss
        </button>
      )}
    </div>
  );
};

export default EnableCallAlertsPrompt;