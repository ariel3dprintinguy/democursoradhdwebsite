import React, { useState } from 'react';
import { getGroqResponse } from '../utils/groqApi';
import '../styles/FocusAI.css';

function FocusAI() {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim()) {
      setConversation(prev => [...prev, { role: 'user', content: message }]);
      setIsLoading(true);
      
      try {
        const prompt = `Provide a focus tip for the following ADHD-related task or question: "${message}"`;
        const aiResponse = await getGroqResponse(prompt);
        
        setConversation(prev => [...prev, { role: 'ai', content: aiResponse }]);
      } catch (error) {
        console.error('Error getting AI response:', error);
        setConversation(prev => [...prev, { role: 'ai', content: 'Sorry, I encountered an error. Please try again.' }]);
      } finally {
        setIsLoading(false);
      }
      
      setMessage('');
    }
  };

  return (
    <div className="focus-ai glass-panel">
      <h2 className="focus-ai-title">Focus AI Assistant</h2>
      <div className="chat-container glass-panel">
        <div className="chat-messages">
          {conversation.map((msg, index) => (
            <div key={index} className={`message ${msg.role} glass-panel`}>
              <strong>{msg.role === 'user' ? '😊 You' : '🤖 AI'}:</strong> {msg.content}
            </div>
          ))}
          {isLoading && <div className="message ai glass-panel">🤖 AI is thinking...</div>}
        </div>
        <form onSubmit={handleSubmit} className="chat-input glass-panel">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask for focus tips or describe your task..."
            disabled={isLoading}
            className="glass-input"
          />
          <button type="submit" disabled={isLoading} className="glass-button">
            {isLoading ? '🕒' : '✉️'} Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default FocusAI;