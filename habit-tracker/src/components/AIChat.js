/**

AIChat Component

An interactive AI-powered chat interface that serves as a habit coach and task management assistant.

The component integrates with a generative AI API to provide conversational responses while also

offering direct task manipulation capabilities.

Key Features:

AI-powered conversational interface for habit coaching

Integrated task management system (create, edit, complete, delete tasks)

Natural language processing for task-related commands

Date detection and scheduling capabilities

Visual task list display with interactive controls

Error handling and user feedback

Core Functionality:

AI Conversation:

Maintains conversation history with the user

Connects to a generative AI API for contextual responses

Understands and responds to habit-related queries

Task Management:

Add tasks through natural language or explicit commands

Edit existing tasks

Mark tasks as complete/incomplete

Delete tasks

Schedule tasks for specific dates

Natural Language Processing:

Detects task-related commands in user input

Extracts dates from natural language (e.g., "tomorrow", "next Monday")

Processes AI suggestions for new tasks

Technical Implementation:

Uses styled-components for all UI elements with animations

Implements a custom date parsing algorithm

Maintains local state for messages and tasks

Integrates with external API for AI responses

Provides callback functions for task updates

Implements responsive design for the chat interface

Component Structure:

ChatContainer: Main wrapper for the chat interface

ChatButton: Toggle button to show/hide the chat

ChatWindow: Container for the chat UI

ChatMessages: Scrollable area for message history

Message: Individual message bubbles (user, AI, system)

Task-related components: Checkboxes, edit controls, etc.

Input area with send button

Key Functions:

processTaskCommands(): Parses user input for task operations

extractDateFromText(): Advanced date detection from natural language

handleSendMessage(): Manages message sending and AI responses

Various task manipulation functions (add, edit, complete, delete)

Integration Points:

Accepts user data and tasks as props

Provides onTaskUpdate and onAddTaskWithDate callbacks

Connects to external AI API

Error Handling:

Manages API errors gracefully

Provides user feedback for failed operations

Maintains chat functionality during errors

Accessibility Considerations:

Keyboard navigation support

Clear visual feedback for interactive elements

Responsive design for different screen sizes

The component is designed to be reusable and can be integrated into any React application

that requires an AI-powered habit coaching and task management interface.
*/

import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { theme } from '../theme';
import { useEventContext } from '../context/EventContext';
// Keyframe animations remain unchanged
const slideIn = keyframes`
  from { transform: translateY(100px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

// Styled components remain unchanged
const ChatContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const ChatButton = styled.button`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  color: white;
  border: none;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  z-index: 1000;
  outline: none;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 14px;

  &:hover {
    transform: scale(1.05) translateY(-3px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: scale(0.98) translateY(0);
  }
`;
const ChatWindow = styled.div`
  width: 350px;
  height: 500px;
  background: ${theme.colors.glassWhite};
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid ${theme.colors.borderWhite};
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transform-origin: bottom right;
  animation: ${css`${slideIn} 0.3s ease-out forwards`};
`;

const ChatHeader = styled.div`
  padding: 16px;
  background: rgba(30, 39, 73, 0.9);
  color: white;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid ${theme.colors.borderWhite};

  h3 {
    margin: 0;
    font-weight: 600;
  }
`;

const ChatMessages = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Message = styled.div`
  max-width: 80%;
  padding: 10px 14px;
  border-radius: 18px;
  animation: ${css`${fadeIn} 0.3s ease-out`};
  word-wrap: break-word;
  line-height: 1.4;

  &.user {
    align-self: flex-end;
    background: ${theme.colors.accent};
    color: white;
    border-bottom-right-radius: 4px;
  }

  &.ai {
    align-self: flex-start;
    background: rgba(255, 255, 255, 0.1);
    color: ${theme.colors.text};
    border-bottom-left-radius: 4px;
  }
  
  &.system {
    align-self: center;
    background: rgba(255, 255, 255, 0.05);
    color: rgba(255, 255, 255, 0.7);
    font-size: 12px;
    border-radius: 12px;
  }
`;

const ChatInputContainer = styled.div`
  padding: 12px;
  border-top: 1px solid ${theme.colors.borderWhite};
  display: flex;
  gap: 8px;
  background: rgba(30, 39, 73, 0.8);
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border-radius: 24px;
  border: 1px solid ${theme.colors.borderWhite};
  background: rgba(255, 255, 255, 0.1);
  color: ${theme.colors.text};
  outline: none;
  font-size: 14px;

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
`;

const SendButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${theme.colors.accent};
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${theme.colors.secondary};
  }
`;

const Button = styled.button`
  background: ${theme.colors.accent};
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;

  &:hover {
    background: ${theme.colors.secondary};
  }
`;

const LoadingDots = styled.div`
  display: flex;
  gap: 5px;
  
  & > div {
    animation: ${css`${fadeIn} 0.5s infinite alternate`};
    
    &:nth-child(2) {
      animation-delay: 0.2s;
    }
    
    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
`;

const TaskCheckbox = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid ${props => props.completed ? theme.colors.accent : 'rgba(255, 255, 255, 0.3)'};
  background: ${props => props.completed ? theme.colors.accent : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  
  &::after {
    content: ${props => props.completed ? '"✓"' : '""'};
    color: white;
    font-size: 0.8rem;
  }
  
  &:hover {
    border-color: ${theme.colors.accent};
    transform: scale(1.1);
  }
`;

const TaskItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  margin: 6px 0;
  position: relative;
`;

const TaskText = styled.span`
  flex: 1;
  color: ${props => props.completed ? 'rgba(255, 255, 255, 0.5)' : '#ffffff'};
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
`;

const TaskEditInput = styled.input`
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid ${theme.colors.borderWhite};
  border-radius: 4px;
  padding: 4px 8px;
  color: white;
  outline: none;
`;

const TaskControls = styled.div`
  display: flex;
  gap: 5px;
`;

const TaskButton = styled.button`
  background: transparent;
  color: rgba(255, 255, 255, 0.6);
  border: none;
  cursor: pointer;
  font-size: 12px;
  padding: 2px 5px;
  border-radius: 3px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
`;

const AIChat = ({ user, onTaskUpdate, tasks = [], onAddTaskWithDate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: `Hi${user?.name ? ` ${user.name}` : ''}! I'm your Habit Coach AI. I can help track your tasks and habits.`,
      sender: 'ai'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTasks, setActiveTasks] = useState(tasks);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const messagesEndRef = useRef(null);
  const [apiError, setApiError] = useState(null);

  const API_KEY = 'AIzaSyAcE4ZbgOGLQsrS8ihpODooTDdNZXQMTTo';
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeTasks]);

  useEffect(() => {
    setActiveTasks(tasks);
  }, [tasks]);

  const handleTaskToggle = (taskId) => {
    const updatedTasks = activeTasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setActiveTasks(updatedTasks);
    
    if (onTaskUpdate) {
      onTaskUpdate(taskId, !activeTasks.find(t => t.id === taskId).completed);
    }
    
    const task = updatedTasks.find(t => t.id === taskId);
    setMessages(prev => [...prev, {
      text: `Marked task "${task.title}" as ${task.completed ? 'completed' : 'not completed'}`,
      sender: 'system'
    }]);
  };

  const startEditTask = (taskId) => {
    const task = activeTasks.find(t => t.id === taskId);
    if (task) {
      setEditingTaskId(taskId);
      setEditValue(task.title);
    }
  };

  const saveEditTask = () => {
    if (editingTaskId && editValue.trim()) {
      const updatedTasks = activeTasks.map(task => 
        task.id === editingTaskId ? { ...task, title: editValue.trim() } : task
      );
      
      setActiveTasks(updatedTasks);
      
      if (onTaskUpdate) {
        const updatedTask = updatedTasks.find(t => t.id === editingTaskId);
        onTaskUpdate('edit', updatedTask);
      }
      
      setMessages(prev => [...prev, {
        text: `Updated task: "${editValue.trim()}"`,
        sender: 'system'
      }]);
      
      setEditingTaskId(null);
      setEditValue('');
    }
  };

  const cancelEditTask = () => {
    setEditingTaskId(null);
    setEditValue('');
  };

  const handleKeyPressForEdit = (e) => {
    if (e.key === 'Enter') {
      saveEditTask();
    } else if (e.key === 'Escape') {
      cancelEditTask();
    }
  };

  const removeTask = (taskId) => {
    const taskToRemove = activeTasks.find(t => t.id === taskId);
    if (!taskToRemove) return;
    
    const updatedTasks = activeTasks.filter(task => task.id !== taskId);
    setActiveTasks(updatedTasks);
    
    if (onTaskUpdate) {
      onTaskUpdate('remove', taskToRemove);
    }
    
    setMessages(prev => [...prev, {
      text: `Removed task: "${taskToRemove.title}"`,
      sender: 'system'
    }]);
  };

  // Enhanced date extraction
  const extractDateFromText = (text) => {
    const today = new Date();
    const lowerText = text.toLowerCase();
    
    // Handle common date references
    if (lowerText.includes('today')) {
      return today;
    } else if (lowerText.includes('tomorrow')) {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow;
    } else if (lowerText.includes('next week')) {
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);
      return nextWeek;
    } else if (lowerText.includes('next month')) {
      const nextMonth = new Date(today);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      return nextMonth;
    }
    
    // Day names
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    for (let i = 0; i < dayNames.length; i++) {
      if (lowerText.includes(dayNames[i])) {
        const targetDay = i;
        const todayDay = today.getDay();
        const daysUntilTarget = (targetDay + 7 - todayDay) % 7;
        const nextOccurrence = new Date(today);
        nextOccurrence.setDate(today.getDate() + (daysUntilTarget === 0 ? 7 : daysUntilTarget));
        return nextOccurrence;
      }
    }
    
    // Try to parse specific date formats (MM/DD/YYYY or DD/MM/YYYY)
    const dateMatch = text.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (dateMatch) {
      const [_, part1, part2, year] = dateMatch;
      // Try both MM/DD and DD/MM interpretations and take the most reasonable one
      const candidate1 = new Date(year, parseInt(part1) - 1, parseInt(part2)); // MM/DD
      const candidate2 = new Date(year, parseInt(part2) - 1, parseInt(part1)); // DD/MM
      
      if (isFinite(candidate1) && part1 <= 12) {
        return candidate1;
      } else if (isFinite(candidate2) && part2 <= 12) {
        return candidate2;
      }
    }
    
    // Match more date formats like "March 15" or "15th of March"
    const monthNames = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
    for (let i = 0; i < monthNames.length; i++) {
      const monthName = monthNames[i];
      if (lowerText.includes(monthName)) {
        // Look for a day number near the month name
        const dayRegex = new RegExp(`(\\d{1,2})(?:st|nd|rd|th)? (?:of )?${monthName}|${monthName} (\\d{1,2})(?:st|nd|rd|th)?`, 'i');
        const match = lowerText.match(dayRegex);
        if (match) {
          const day = parseInt(match[1] || match[2]);
          if (day > 0 && day <= 31) {
            const targetDate = new Date(today.getFullYear(), i, day);
            if (targetDate < today) {
              targetDate.setFullYear(targetDate.getFullYear() + 1);
            }
            return targetDate;
          }
        }
      }
    }
    
    return null; // No date found
  };

  // Process user input for task management commands
  const processTaskCommands = (userInput, aiResponse) => {
    const lowerInput = userInput.toLowerCase();
    let commandDetected = false;
    
    // Check for completion command
    const completePattern = /\b(complete|finish|mark done|mark as done|mark completed|check off)\b.+?\b(.+?)\b/i;
    const completeMatch = userInput.match(completePattern);
    
    if (completeMatch) {
      const taskNameHint = completeMatch[2].trim();
      // Find a task that matches or contains the mentioned name
      const taskToComplete = activeTasks.find(task => 
        task.title.toLowerCase().includes(taskNameHint.toLowerCase()) && !task.completed
      );
      
      if (taskToComplete) {
        handleTaskToggle(taskToComplete.id);
        return true;
      }
    }
    
    // Check for edit command
    const editPattern = /\b(edit|change|update|rename)\b.+?\b(.+?)\b.+?\b(to|as)\b.+?\b(.+)\b/i;
    const editMatch = userInput.match(editPattern);
    
    if (editMatch) {
      const oldTaskHint = editMatch[2].trim();
      const newTaskName = editMatch[4].trim();
      
      // Find a task that matches or contains the mentioned name
      const taskToEdit = activeTasks.find(task => 
        task.title.toLowerCase().includes(oldTaskHint.toLowerCase())
      );
      
      if (taskToEdit && newTaskName) {
        const updatedTasks = activeTasks.map(task => 
          task.id === taskToEdit.id ? { ...task, title: newTaskName } : task
        );
        
        setActiveTasks(updatedTasks);
        
        if (onTaskUpdate) {
          const updatedTask = { ...taskToEdit, title: newTaskName };
          onTaskUpdate('edit', updatedTask);
        }
        
        setMessages(prev => [...prev, {
          text: `Updated task: "${oldTaskHint}" to "${newTaskName}"`,
          sender: 'system'
        }]);
        
        return true;
      }
    }
    
    // Check for add task command (enhanced to catch more patterns)
    const addPattern = /\b(add|create|set up|make|schedule)\b.+?\b(task|todo|to do|reminder)\b.+?\b(.+)\b/i;
    const addMatch = userInput.match(addPattern);
    
    if (addMatch || (lowerInput.includes('add') && lowerInput.includes('task'))) {
      const taskTitle = addMatch ? addMatch[3].trim() : userInput.replace(/^.*\b(add|create|set up|make|schedule)\b.+?\b(task|todo|to do|reminder)\b/i, '').trim();
      
      if (taskTitle) {
        // Check for date in the task description
        const taskDate = extractDateFromText(userInput);
        
        if (taskDate) {
          // Add task with specific date
          const newTask = {
            id: Date.now(),
            title: taskTitle,
            completed: false
          };
          
          if (onAddTaskWithDate) {
            onAddTaskWithDate(taskDate, newTask);
            setMessages(prev => [...prev, {
              text: `Added new task for ${taskDate.toLocaleDateString()}: "${taskTitle}"`,
              sender: 'system'
            }]);
          }
        } else {
          // Add task for today
          const newTask = {
            id: Date.now(),
            title: taskTitle,
            completed: false
          };
          
          setActiveTasks(prev => [...prev, newTask]);
          
          if (onTaskUpdate) {
            onTaskUpdate('add', newTask);
          }
          
          setMessages(prev => [...prev, {
            text: `Added new task: "${taskTitle}"`,
            sender: 'system'
          }]);
        }
        
        return true;
      }
    }
    
    // Check for delete/remove command
    const deletePattern = /\b(delete|remove|cancel)\b.+?\b(.+?)\b/i;
    const deleteMatch = userInput.match(deletePattern);
    
    if (deleteMatch) {
      const taskNameHint = deleteMatch[2].trim();
      // Find a task that matches or contains the mentioned name
      const taskToDelete = activeTasks.find(task => 
        task.title.toLowerCase().includes(taskNameHint.toLowerCase())
      );
      
      if (taskToDelete) {
        removeTask(taskToDelete.id);
        return true;
      }
    }
    
    // Check if the AI is suggesting a task
    if (
      aiResponse.toLowerCase().includes("add task") || 
      aiResponse.toLowerCase().includes("create task") || 
      aiResponse.toLowerCase().includes("schedule task") ||
      aiResponse.toLowerCase().includes("add to your list") ||
      aiResponse.toLowerCase().includes("want me to add") ||
      aiResponse.toLowerCase().includes("should i add")
    ) {
      // Extract potential task from AI response
      let taskText = aiResponse.replace(/.*?(add|create|schedule) (a )?task( to)?:?\s+/i, '').trim();
      taskText = taskText.split(/\?|\./)[0]; // Get the first sentence
      
      if (taskText && taskText.length > 5) {
        const hasDate = extractDateFromText(aiResponse) !== null;
        
        const suggestion = {
          text: "Would you like me to add this as a new task?",
          sender: 'ai',
          isTaskSuggestion: true,
          suggestedTask: taskText,
          hasDate: hasDate
        };
        
        if (hasDate) {
          suggestion.text += " I noticed a date reference. Should I schedule it for that date?";
        }
        
        setMessages(prev => [...prev, suggestion]);
        return true;
      }
    }
    
    return false;
  };

  const addSuggestedTask = (taskText, forSpecificDate = false) => {
    if (!taskText) return;
    
    // Extract task title, removing common prefixes
    let taskTitle = taskText
      .replace(/^.*(add|suggest|recommend|create|schedule)/i, '')
      .replace(/[.?]$/, '')
      .trim();
    
    // Try to extract date from the task text
    const taskDate = extractDateFromText(taskText);
    const hasDate = taskDate !== null;
    
    if (taskTitle) {
      const newTask = {
        id: Date.now(),
        title: taskTitle,
        completed: false
      };
      
      if (hasDate || forSpecificDate) {
        // If there's a date reference or user wants to schedule it
        const targetDate = taskDate || new Date(); // Default to today if no date found
        if (onAddTaskWithDate) {
          onAddTaskWithDate(targetDate, newTask);
          setMessages(prev => [...prev, {
            text: `Added new task for ${targetDate.toLocaleDateString()}: "${taskTitle}"`,
            sender: 'system'
          }]);
        }
      } else {
        // Add to today's tasks
        setActiveTasks(prev => [...prev, newTask]);
        if (onTaskUpdate) {
          onTaskUpdate('add', newTask);
        }
        setMessages(prev => [...prev, {
          text: `Added new task: "${taskTitle}"`,
          sender: 'system'
        }]);
      }
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = { text: inputValue, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setApiError(null);

    try {
      // Enhanced prompt with date context
      const today = new Date();
      const prompt = {
        contents: [{
          parts: [{
            text: `You are an AI habit coach. Today is ${today.toLocaleDateString()}.
            The user has these current tasks:
            ${activeTasks.map(t => `- ${t.title} [${t.completed ? 'Completed' : 'Pending'}]`).join('\n')}
            
            User's current habits: ${JSON.stringify(user.habits || [])}
            Current conversation:
            ${messages.slice(-4).map(m => `${m.sender}: ${m.text}`).join('\n')}
            
            User: ${inputValue}
            
            Keep your response short and simple, only 2-3 conversational sentences without any formatting, asterisks, or bullet points.
            If the user wants to add, edit, complete, or remove a task, respond conversationally but briefly.`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500
        }
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(prompt)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'API request failed');
      }

      const data = await response.json();
      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || 
                    "I didn't understand that. Could you rephrase?";
      
      // Process the input for direct task commands before showing AI response
      const commandProcessed = processTaskCommands(inputValue, aiText);
      
      // Only add the AI response if a command wasn't processed
      // or the AI is suggesting a task (which processTaskCommands would handle)
      if (!commandProcessed) {
        setMessages(prev => [...prev, { text: aiText, sender: 'ai' }]);
        
        // Second pass to check if the AI is suggesting a task
        processTaskCommands(inputValue, aiText);
      }
    } catch (error) {
      console.error('Chat Error:', error);
      setApiError(error.message);
      setMessages(prev => [...prev, { 
        text: "I'm having trouble connecting. Please check your internet connection.", 
        sender: 'ai' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <ChatContainer>
      {isOpen && (
        <ChatWindow>
          <ChatHeader>
            <div style={{ fontSize: '24px' }}>🤖</div>
            <h3>Habit Coach AI</h3>
            {apiError && (
              <div style={{ 
                color: '#ff6b6b', 
                fontSize: '12px',
                marginTop: '4px'
              }}>
                API Error: {apiError}
              </div>
            )}
          </ChatHeader>
          <ChatMessages>
            {messages.map((message, index) => (
              <React.Fragment key={index}>
                <Message className={message.sender}>
                  {message.text}
                  {message.isTaskSuggestion && (
                    <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
                      <Button 
                        onClick={() => addSuggestedTask(message.suggestedTask)}
                        style={{ padding: '5px 10px', fontSize: '12px' }}
                      >
                        Add to Today
                      </Button>
                      {message.hasDate && (
                        <Button 
                          onClick={() => addSuggestedTask(message.suggestedTask, true)}
                          style={{ padding: '5px 10px', fontSize: '12px' }}
                        >
                          Schedule for Date
                        </Button>
                      )}
                    </div>
                  )}
                </Message>
              </React.Fragment>
            ))}
            
            {activeTasks.length > 0 && (
  inputValue.toLowerCase().includes("task") || 
  inputValue.toLowerCase().includes("show task") || 
  inputValue.toLowerCase().includes("list") || 
  inputValue.toLowerCase().includes("show me") || 
  messages.some(m => m.text.toLowerCase().includes("current tasks")) ? (
    <Message className="ai">
      <h4 style={{ marginBottom: '8px' }}>Your Current Tasks:</h4>
      {activeTasks.map(task => (
        <TaskItem key={task.id}>
          {/* Task items rendering - keep this part unchanged */}
          {editingTaskId === task.id ? (
            <>
              <TaskEditInput 
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyPressForEdit}
                autoFocus
              />
              <TaskControls>
                <TaskButton onClick={saveEditTask}>Save</TaskButton>
                <TaskButton onClick={cancelEditTask}>Cancel</TaskButton>
              </TaskControls>
            </>
          ) : (
            <>
              <TaskCheckbox 
                completed={task.completed}
                onClick={() => handleTaskToggle(task.id)}
              />
              <TaskText completed={task.completed}>
                {task.title}
              </TaskText>
              <TaskControls>
                <TaskButton onClick={() => startEditTask(task.id)}>Edit</TaskButton>
                <TaskButton onClick={() => removeTask(task.id)}>Delete</TaskButton>
              </TaskControls>
            </>
          )}
        </TaskItem>
      ))}
    </Message>
  ) : null
)}
            <div ref={messagesEndRef} />
          </ChatMessages>
          <ChatInputContainer>
            <ChatInput
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about habits or tasks..."
              disabled={isLoading}
            />        
              <SendButton onClick={handleSendMessage} disabled={isLoading}>
              <span style={{ fontSize: '16px' }}>➤</span>
            </SendButton>
          </ChatInputContainer>
        </ChatWindow>
      )}
      <ChatButton onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✕' : 'Coach'}
      </ChatButton>
    </ChatContainer>
  );
};

export default AIChat;