import React from 'react';
import './Note.css';

interface NoteProps {
  content: string;
}

const Note: React.FC<NoteProps> = ({ content }) => {
  return <div className="note">{content}</div>;
};

export default Note;