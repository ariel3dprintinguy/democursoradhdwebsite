import React, { useState } from 'react';
import './App.css';

interface Note {
  id: string;
  content: string;
  date: Date;
}

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const addNote = () => {
    if (currentNote.trim() !== '') {
      const newNote: Note = {
        id: Date.now().toString(),
        content: currentNote,
        date: selectedDate,
      };
      setNotes([...notes, newNote]);
      setCurrentNote('');
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const groupNotesByDate = () => {
    const grouped: { [key: string]: Note[] } = {};
    notes.forEach(note => {
      const dateKey = formatDate(note.date);
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(note);
    });
    return grouped;
  };

  return (
    <div className="App">
      <div className="sidebar">
        <h1>Pastel Notes</h1>
        <div className="calendar">
          <input
            type="date"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
          />
        </div>
        <div className="notes-list">
          {Object.entries(groupNotesByDate()).map(([date, dateNotes]) => (
            <div key={date} className="date-group">
              <h2>{date}</h2>
              <ul>
                {dateNotes.map((note) => (
                  <li key={note.id}>{note.content}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="main-content">
        <textarea
          value={currentNote}
          onChange={(e) => setCurrentNote(e.target.value)}
          placeholder="Type your note here..."
        />
        <button onClick={addNote}>Add Note</button>
      </div>
    </div>
  );
}

export default App;