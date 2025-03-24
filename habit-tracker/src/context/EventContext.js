// src/contexts/EventContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState(() => {
    const savedEvents = localStorage.getItem('events');
    return savedEvents ? JSON.parse(savedEvents) : {};
  });
  const [userExp, setUserExp] = useState(() => {
    const savedExp = localStorage.getItem('userExp');
    return savedExp ? parseInt(savedExp, 10) : 0;
  });
  const [progressHistory, setProgressHistory] = useState(() => {
    const savedHistory = localStorage.getItem('progressHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('userExp', userExp);
  }, [userExp]);

  useEffect(() => {
    localStorage.setItem('progressHistory', JSON.stringify(progressHistory));
  }, [progressHistory]);

  const addEvent = (dateKey, event) => {
    setEvents(prev => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), event],
    }));
  };

  const updateEvent = (dateKey, eventId, updates) => {
    setEvents(prev => ({
      ...prev,
      [dateKey]: prev[dateKey].map(event =>
        event.id === eventId ? { ...event, ...updates } : event
      ),
    }));
  };

  const deleteEvent = (dateKey, eventId) => {
    setEvents(prev => ({
      ...prev,
      [dateKey]: prev[dateKey].filter(event => event.id !== eventId),
    }));
  };

  const toggleEventCompletion = (dateKey, eventId, isCompleted) => {
    console.log(`Toggling completion for event ${eventId} on ${dateKey} to ${isCompleted}`);
    setEvents(prev => {
      const updatedEvents = {
        ...prev,
        [dateKey]: prev[dateKey].map(event =>
          event.id === eventId ? { ...event, completed: isCompleted } : event
        ),
      };
      console.log('Updated events:', updatedEvents);
      return updatedEvents;
    });

    if (isCompleted) {
      setUserExp(prevExp => {
        const newExp = prevExp + 20;
        console.log(`Adding 20 points. New userExp: ${newExp}`);
        setProgressHistory(prevHistory => {
          const today = new Date().toISOString().split('T')[0];
          const updatedHistory = [...prevHistory];
          const todayEntry = updatedHistory.find(entry => entry.date === today);
          if (todayEntry) {
            todayEntry.points = (todayEntry.points || 0) + 20;
          } else {
            updatedHistory.push({ date: today, points: 20 });
          }
          // Keep only the last 7 days
          const newHistory = updatedHistory.slice(-7);
          console.log('Updated progressHistory:', newHistory);
          return newHistory;
        });
        return newExp;
      });
    }
  };

  return (
    <EventContext.Provider value={{ events, userExp, progressHistory, addEvent, updateEvent, deleteEvent, toggleEventCompletion }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEventContext = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEventContext must be used within an EventProvider');
  }
  return context;
};