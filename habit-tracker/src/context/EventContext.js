import React, { createContext, useContext, useState, useEffect } from 'react';

const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState(() => {
    try {
      const savedEvents = localStorage.getItem('events');
      return savedEvents ? JSON.parse(savedEvents) : {};
    } catch (error) {
      console.error('Failed to load events from localStorage:', error);
      return {};
    }
  });
  const [userExp, setUserExp] = useState(() => {
    try {
      const savedExp = localStorage.getItem('userExp');
      return savedExp ? parseInt(savedExp, 10) : 0;
    } catch (error) {
      console.error('Failed to load userExp from localStorage:', error);
      return 0;
    }
  });
  const [progressHistory, setProgressHistory] = useState(() => {
    try {
      const savedHistory = localStorage.getItem('progressHistory');
      return savedHistory ? JSON.parse(savedHistory) : [];
    } catch (error) {
      console.error('Failed to load progressHistory from localStorage:', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('events', JSON.stringify(events));
    } catch (error) {
      console.error('Failed to save events to localStorage:', error);
    }
  }, [events]);

  useEffect(() => {
    try {
      localStorage.setItem('userExp', userExp);
    } catch (error) {
      console.error('Failed to save userExp to localStorage:', error);
    }
  }, [userExp]);

  useEffect(() => {
    try {
      localStorage.setItem('progressHistory', JSON.stringify(progressHistory));
    } catch (error) {
      console.error('Failed to save progressHistory to localStorage:', error);
    }
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
    setEvents(prev => {
      const updatedEvents = {
        ...prev,
        [dateKey]: prev[dateKey].filter(event => event.id !== eventId),
      };
      if (updatedEvents[dateKey].length === 0) {
        delete updatedEvents[dateKey];
      }
      return updatedEvents;
    });
  };

  const toggleEventCompletion = (dateKey, eventId, isCompleted) => {
    setEvents(prev => {
      const updatedEvents = {
        ...prev,
        [dateKey]: prev[dateKey].map(event =>
          event.id === eventId ? { ...event, completed: isCompleted } : event
        ),
      };
      return updatedEvents;
    });

    setUserExp(prevExp => {
      const expChange = isCompleted ? 20 : -20;
      const newExp = Math.max(0, prevExp + expChange);
      setProgressHistory(prevHistory => {
        const today = new Date().toISOString().split('T')[0];
        const updatedHistory = [...prevHistory];
        const todayEntry = updatedHistory.find(entry => entry.date === today);
        if (todayEntry) {
          todayEntry.points = Math.max(0, (todayEntry.points || 0) + expChange);
        } else if (isCompleted) {
          updatedHistory.push({ date: today, points: 20 });
        }
        return updatedHistory.slice(-7);
      });
      return newExp;
    });
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