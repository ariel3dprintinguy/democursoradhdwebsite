import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './Login';
import { supabase } from './supabaseClient';
import CalendarView from './components/CalendarView';
import FocusAI from './components/FocusAI';
import TaskBreakdown from './components/TaskBreakdown';
import TimeManagement from './components/TimeManagement';
import MindfulnessExercises from './components/MindfulnessExercises';

const themes = {
  lavender: {
    '--bg-color': '#f3e5f5',
    '--calendar-bg': '#ffffff',
    '--text-color': '#37474f',
    '--note-color': '#e1bee7',
    '--button-color': '#9c27b0',
    '--button-hover': '#7b1fa2',
    '--accent-color': '#4a148c',
  },
  mint: {
    '--bg-color': '#e0f2f1',
    '--calendar-bg': '#ffffff',
    '--text-color': '#37474f',
    '--note-color': '#b2dfdb',
    '--button-color': '#009688',
    '--button-hover': '#00796b',
    '--accent-color': '#004d40',
  },
  peach: {
    '--bg-color': '#fff3e0',
    '--calendar-bg': '#ffffff',
    '--text-color': '#37474f',
    '--note-color': '#ffe0b2',
    '--button-color': '#ff9800',
    '--button-hover': '#f57c00',
    '--accent-color': '#e65100',
  },
};

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('calendar');
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('lavender');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user;
        setUser(currentUser ?? null);
      }
    );

    applyTheme(currentTheme);

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [currentTheme]);

  const applyTheme = (themeName) => {
    const theme = themes[themeName];
    if (theme) {
      Object.keys(theme).forEach(key => {
        document.documentElement.style.setProperty(key, theme[key]);
      });
    } else {
      console.error(`Theme "${themeName}" not found`);
    }
  };

  const handleLogin = (user) => {
    setUser(user);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const toggleSideMenu = () => {
    setIsSideMenuOpen(!isSideMenuOpen);
  };

  const renderView = () => {
    switch (currentView) {
      case 'calendar':
        return <CalendarView />;
      case 'focusAI':
        return <FocusAI />;
      case 'taskBreakdown':
        return <TaskBreakdown />;
      case 'timeManagement':
        return <TimeManagement />;
      case 'mindfulness':
        return <MindfulnessExercises />;
      default:
        return <CalendarView />;
    }
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="App">
      <div className={`side-menu ${isSideMenuOpen ? 'open' : ''}`}>
        <button onClick={toggleSideMenu} className="close-menu">&times;</button>
        <h2>Menu</h2>
        <ul>
          <li onClick={() => setCurrentView('calendar')} className={currentView === 'calendar' ? 'active' : ''}>Calendar View</li>
          <li onClick={() => setCurrentView('focusAI')} className={currentView === 'focusAI' ? 'active' : ''}>Focus AI</li>
          <li onClick={() => setCurrentView('taskBreakdown')} className={currentView === 'taskBreakdown' ? 'active' : ''}>Task Breakdown</li>
          <li onClick={() => setCurrentView('timeManagement')} className={currentView === 'timeManagement' ? 'active' : ''}>Time Management</li>
          <li onClick={() => setCurrentView('mindfulness')} className={currentView === 'mindfulness' ? 'active' : ''}>Mindfulness Exercises</li>
        </ul>
        <div className="theme-switcher">
          <h3>Theme</h3>
          <div className="theme-buttons">
            <button onClick={() => setCurrentTheme('lavender')} className={`theme-button lavender ${currentTheme === 'lavender' ? 'active' : ''}`}></button>
            <button onClick={() => setCurrentTheme('mint')} className={`theme-button mint ${currentTheme === 'mint' ? 'active' : ''}`}></button>
            <button onClick={() => setCurrentTheme('peach')} className={`theme-button peach ${currentTheme === 'peach' ? 'active' : ''}`}></button>
          </div>
        </div>
      </div>
      <div className="app-container">
        <div className="user-info">
          <button onClick={toggleSideMenu} className="menu-button">☰</button>
          <span>Welcome, {user.email}!</span>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
        <div className="content-area">
          {renderView()}
        </div>
      </div>
    </div>
  );
}

export default App;