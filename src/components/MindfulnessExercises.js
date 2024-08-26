import React, { useState, useEffect } from 'react';
import { getGroqResponse } from '../utils/groqApi';
import '../styles/MindfulnessExercises.css';

function MindfulnessExercises() {
  const [exercises, setExercises] = useState([]);
  const [currentExercise, setCurrentExercise] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const prompt = "Generate 3 brief mindfulness exercises suitable for people with ADHD. For each exercise, provide a name and short instructions. Format the response as a list with each exercise on a new line, starting with the name followed by a colon and then the instructions.";
      const response = await getGroqResponse(prompt);
      const parsedExercises = parseExercises(response);
      setExercises(parsedExercises);
    } catch (error) {
      console.error('Error fetching mindfulness exercises:', error);
      setError('Unable to load exercises. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const parseExercises = (response) => {
    const lines = response.split('\n').filter(line => line.trim() !== '');
    return lines.map(line => {
      const [name, ...instructionParts] = line.split(':');
      return {
        name: name.trim(),
        instructions: instructionParts.join(':').trim()
      };
    });
  };

  const startExercise = (exercise) => {
    setCurrentExercise(exercise);
  };

  const generateNewExercises = () => {
    fetchExercises();
  };

  if (isLoading) {
    return (
      <div className="mindfulness-exercises glass-panel">
        <h2 className="mindfulness-title">Mindfulness Exercises</h2>
        <p className="loading-message">Loading mindfulness exercises... 🧘</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mindfulness-exercises glass-panel">
        <h2 className="mindfulness-title">Mindfulness Exercises</h2>
        <p className="error-message">{error}</p>
        <button onClick={generateNewExercises} className="glass-button generate-new">
          🔄 Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="mindfulness-exercises glass-panel">
      <h2 className="mindfulness-title">Mindfulness Exercises</h2>
      {currentExercise ? (
        <div className="exercise-details glass-panel">
          <h3>{currentExercise.name}</h3>
          <p>{currentExercise.instructions}</p>
          <button onClick={() => setCurrentExercise(null)} className="glass-button">
            ⬅️ Back to List
          </button>
        </div>
      ) : (
        <>
          <ul className="exercise-list">
            {exercises.map((exercise, index) => (
              <li key={index} className="exercise-item glass-panel">
                <button onClick={() => startExercise(exercise)} className="glass-button">
                  {index === 0 ? '🌟' : index === 1 ? '🌈' : '🌺'} {exercise.name}
                </button>
              </li>
            ))}
          </ul>
          <button onClick={generateNewExercises} className="glass-button generate-new">
            🔄 Generate New Exercises
          </button>
        </>
      )}
    </div>
  );
}

export default MindfulnessExercises;