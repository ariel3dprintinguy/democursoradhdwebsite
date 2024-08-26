import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { getGroqResponse } from '../utils/groqApi';
import '../styles/CalendarView.css';

function CalendarView() {
  const [notes, setNotes] = useState({});
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [adhTip, setAdhTip] = useState('');
  const [showAdhTip, setShowAdhTip] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('date');
    
    if (error) {
      console.error('Error fetching notes:', error);
    } else {
      const groupedNotes = data.reduce((acc, note) => {
        const dateKey = new Date(note.date).toISOString().split('T')[0];
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(note);
        return acc;
      }, {});
      setNotes(groupedNotes);
    }
  };

  const addNote = async () => {
    if (newNote.trim() && selectedDate) {
      const dateKey = selectedDate.toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('notes')
        .insert([
          { content: newNote, date: dateKey }
        ]);

      if (error) {
        console.error('Error adding note:', error);
      } else {
        setNotes(prev => ({
          ...prev,
          [dateKey]: [...(prev[dateKey] || []), { content: newNote }]
        }));
        setNewNote('');
        getAISuggestions(newNote);
      }
    }
  };

  const handleDayClick = (date) => {
    const clickedDate = new Date(date);
    clickedDate.setHours(0, 0, 0, 0);
    setSelectedDate(clickedDate);
    setAiSuggestions([]);
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const calendar = [];
    let week = [];

    // Add empty cells for days before the first of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      week.push(<td key={`empty-${i}`} className="empty-day"></td>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateKey = date.toISOString().split('T')[0];
      const isToday = dateKey === new Date().toISOString().split('T')[0];
      const isSelected = selectedDate && dateKey === selectedDate.toISOString().split('T')[0];

      week.push(
        <td 
          key={dateKey} 
          onClick={() => handleDayClick(date)} 
          className={`calendar-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
        >
          <div className="day-content">
            <span className="day-number">{day}</span>
            {notes[dateKey] && (
              <div className="note-indicators">
                {notes[dateKey].map((_, index) => (
                  <span key={index} className="note-dot"></span>
                ))}
              </div>
            )}
          </div>
        </td>
      );

      if (week.length === 7) {
        calendar.push(<tr key={`week-${calendar.length}`}>{week}</tr>);
        week = [];
      }
    }

    // Add empty cells for days after the last day of the month
    if (week.length > 0) {
      for (let i = week.length; i < 7; i++) {
        week.push(<td key={`empty-end-${i}`} className="empty-day"></td>);
      }
      calendar.push(<tr key={`week-${calendar.length}`}>{week}</tr>);
    }

    return calendar;
  };

  const getADHDTip = async () => {
    try {
      const prompt = "Give a short, helpful tip for managing ADHD tasks and staying organized with a calendar.";
      const response = await getGroqResponse(prompt);
      setAdhTip(response);
      setShowAdhTip(true);
    } catch (error) {
      console.error('Error fetching ADHD tip:', error);
      setAdhTip('Oops! I forgot the tip. Can you remind me later? 😅');
    }
  };

  const getAISuggestions = async (note) => {
    try {
      const prompt = `Based on the note "${note}", suggest 3 related tasks or follow-up actions for someone with ADHD.`;
      const response = await getGroqResponse(prompt);
      const suggestions = response.split('\n').filter(s => s.trim() !== '');
      setAiSuggestions(suggestions);
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
      setAiSuggestions(['Error: Unable to get suggestions. Please try again.']);
    }
  };

  const applySuggestion = async (suggestion) => {
    if (selectedDate) {
      const dateKey = selectedDate.toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('notes')
        .insert([
          { content: suggestion, date: dateKey }
        ]);

      if (error) {
        console.error('Error adding suggestion:', error);
      } else {
        setNotes(prev => ({
          ...prev,
          [dateKey]: [...(prev[dateKey] || []), { content: suggestion }]
        }));
      }
    }
  };

  const changeMonth = (delta) => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + delta);
      return newDate;
    });
  };

  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <button onClick={() => changeMonth(-1)} className="month-nav-button">&lt;</button>
        <h2>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
        <button onClick={() => changeMonth(1)} className="month-nav-button">&gt;</button>
      </div>
      <div className="calendar-grid">
        <table>
          <thead>
            <tr>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {renderCalendar()}
          </tbody>
        </table>
      </div>
      {selectedDate && (
        <div className="note-section">
          <h3>{selectedDate.toLocaleDateString()}</h3>
          <div className="add-note-form">
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Enter your note..."
              className="note-input"
            />
            <button onClick={addNote} className="add-note-button">Add Note</button>
          </div>
          <div className="notes-list">
            {notes[selectedDate.toISOString().split('T')[0]]?.map((note, index) => (
              <div key={index} className="note-item">
                {note.content}
              </div>
            ))}
          </div>
          {aiSuggestions.length > 0 && (
            <div className="ai-suggestions">
              <h4>AI Suggestions</h4>
              <ul>
                {aiSuggestions.map((suggestion, index) => (
                  <li key={index}>
                    <span>{suggestion}</span>
                    <button onClick={() => applySuggestion(suggestion)} className="apply-suggestion-button">Apply</button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      <div className="ai-assistant">
        <button className="adhd-helper" onClick={getADHDTip}>
          <span role="img" aria-label="AI Assistant">🐨</span>
        </button>
        {showAdhTip && (
          <div className="comic-bubble">
            <p>{adhTip}</p>
            <button onClick={() => setShowAdhTip(false)} className="close-tip-button">Close</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CalendarView;