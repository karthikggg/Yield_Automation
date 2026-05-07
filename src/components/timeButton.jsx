import React, { useState, useEffect } from 'react';

export default function TimerButton() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval;

    if (isRunning) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  const handleButtonClick = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setTime(0);
    setIsRunning(false);
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (time % 60) / 60 * circumference;

  return (
    <div style={styles.container}>
      <div style={styles.timerWrapper}>
        <svg style={styles.svg} viewBox="0 0 120 120">
          {/* Background circle */}
          <circle
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke="#e0e0e0"
            strokeWidth="3"
          />
          {/* Progress circle */}
          <circle
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke="#6366f1"
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 0.3s ease',
              transform: 'rotate(-90deg)',
              transformOrigin: '50% 50%',
            }}
          />
        </svg>

        <button
          onClick={handleButtonClick}
          style={{
            ...styles.button,
            ...(isRunning ? styles.buttonRunning : styles.buttonPaused),
          }}
        >
          <div style={styles.buttonContent}>
            <div style={styles.timeDisplay}>{formatTime(time)}</div>
            <div style={styles.buttonLabel}>
              {isRunning ? 'PAUSE' : time === 0 ? 'START' : 'RESUME'}
            </div>
          </div>
        </button>

        {time > 0 && (
          <button
            onClick={handleReset}
            style={styles.resetButton}
            title="Reset timer"
          >
            ↻
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  },
  timerWrapper: {
    position: 'relative',
    width: '200px',
    height: '200px',
  },
  svg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
  button: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '140px',
    height: '140px',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
    outline: 'none',
  },
  buttonRunning: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    transform: 'translate(-50%, -50%) scale(1)',
  },
  buttonPaused: {
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    color: '#fff',
    transform: 'translate(-50%, -50%) scale(0.95)',
  },
  buttonContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '4px',
  },
  timeDisplay: {
    fontSize: '32px',
    fontWeight: '700',
    fontVariantNumeric: 'tabular-nums',
    letterSpacing: '-1px',
  },
  buttonLabel: {
    fontSize: '12px',
    fontWeight: '700',
    letterSpacing: '1.5px',
    opacity: 0.85,
  },
  resetButton: {
    position: 'absolute',
    bottom: '-50px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    border: 'none',
    background: '#fff',
    color: '#667eea',
    fontSize: '20px',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    outline: 'none',
  },
};

// Add hover effect dynamically
const style = document.createElement('style');
style.textContent = `
  button:hover {
    transform: scale(1.05) !important;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25) !important;
  }
  
  button:active {
    transform: scale(0.95) !important;
  }
`;
if (typeof document !== 'undefined') {
  document.head.appendChild(style);
}