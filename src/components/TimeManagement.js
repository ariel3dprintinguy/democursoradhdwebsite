import React, { useState, useEffect } from 'react';
import '../styles/TimeManagement.css';

function TimeManagement() {
  const [timer, setTimer] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && timer > 0) {
      interval = setInterval(() => {
        setTimer(timer => timer - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsActive(false);
      alert("Time's up! Take a break.");
    }
    return () => clearInterval(interval);
  }, [isActive, timer]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setTimer(25 * 60);
    setIsActive(false);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="time-management glass-panel">
      <h2>Time Management</h2>
      <div className="pomodoro-timer glass-panel">
        <h3>Pomodoro Timer</h3>
        <p className="timer-display">{formatTime(timer)}</p>
        <div className="timer-controls">
          <button onClick={toggleTimer} className="glass-button">{isActive ? 'Pause' : 'Start'}</button>
          <button onClick={resetTimer} className="glass-button">Reset</button>
        </div>
      </div>
    </div>
  );
}

export default TimeManagement;