import React, { useState, useEffect } from 'react';
import '../styles/FloatingTimer.css';

function FloatingTimer() {
  const [timer, setTimer] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && timer > 0) {
      interval = setInterval(() => {
        setTimer(timer => timer - 1);
        updateTabTitle(timer - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsActive(false);
      alert("Time's up! Take a break.");
      updateTabTitle(0);
    }
    return () => {
      clearInterval(interval);
      document.title = 'Pastel Notes'; // Reset title when component unmounts
    };
  }, [isActive, timer]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setTimer(25 * 60);
    setIsActive(false);
    updateTabTitle(25 * 60);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const updateTabTitle = (time) => {
    const formattedTime = formatTime(time);
    document.title = `(${formattedTime}) Pastel Notes`;
  };

  return (
    <div className={`floating-timer ${isActive ? 'active' : ''}`}>
      <div className="timer-display">{formatTime(timer)}</div>
      <div className="timer-controls">
        <button onClick={toggleTimer}>{isActive ? '⏸' : '▶'}</button>
        <button onClick={resetTimer}>↺</button>
      </div>
    </div>
  );
}

export default FloatingTimer;