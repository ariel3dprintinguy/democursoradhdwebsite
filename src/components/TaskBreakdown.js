import React, { useState } from 'react';
import { getGroqResponse } from '../utils/groqApi';
import '../styles/TaskBreakdown.css';

function TaskBreakdown() {
  const [task, setTask] = useState('');
  const [steps, setSteps] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (task.trim()) {
      setIsLoading(true);
      try {
        const prompt = `Break down the following task into 3-5 manageable steps for someone with ADHD: "${task}"`;
        const response = await getGroqResponse(prompt);
        const newSteps = response.split('\n').filter(step => step.trim() !== '');
        setSteps(newSteps);
      } catch (error) {
        console.error('Error breaking down task:', error);
        setSteps(['Error: Unable to break down the task. Please try again.']);
      } finally {
        setIsLoading(false);
      }
      setTask('');
    }
  };

  return (
    <div className="task-breakdown glass-panel">
      <h2 className="task-breakdown-title">Task Breakdown</h2>
      <form onSubmit={handleSubmit} className="task-form glass-panel">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter a task to break down"
          disabled={isLoading}
          className="glass-input"
        />
        <button type="submit" disabled={isLoading} className="glass-button">
          {isLoading ? '🕒' : '📋'} Break Down Task
        </button>
      </form>
      {isLoading && <p className="loading-message">Breaking down your task... 🧠</p>}
      {steps.length > 0 && (
        <div className="steps-container glass-panel">
          <h3>Steps:</h3>
          <ol className="steps-list">
            {steps.map((step, index) => (
              <li key={index} className="step-item glass-panel">
                {step.trim()}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

export default TaskBreakdown;