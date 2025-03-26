import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { theme } from '../theme';

// Keyframe animations
const slideIn = keyframes`
  from { transform: translateY(100px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

// Styled components
const ChatContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const ChatButton = styled.button`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${theme.colors.accent};
  color: white;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  transition: all 0.3s ease;
  z-index: 1001;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
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

const AIChat = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
      {
        text: `Hi${user?.name ? ` ${user.name}` : ''}! I'm your Habit Coach AI. How can I help you today?`,
        sender: 'ai'
      }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
  
    // Enhanced error handling state
    const [apiError, setApiError] = useState(null);
  
    const API_KEY = 'get_your_own';
    const API_KEY = 'get_your_own_key';
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
  
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
  
    useEffect(() => {
      scrollToBottom();
    }, [messages]);
  
    const handleSendMessage = async () => {
      if (!inputValue.trim() || isLoading) return;
  
      const userMessage = { text: inputValue, sender: 'user' };
      setMessages(prev => [...prev, userMessage]);
      setInputValue('');
      setIsLoading(true);
      setApiError(null);
  
      try {
        // Enhanced prompt with habit coaching context
        const prompt = {
          contents: [{
            parts: [{
              text: `You are an AI habit coach. Provide concise, actionable advice.
              User's current habits: ${JSON.stringify(user.habits || [])}
              Current conversation:
              ${messages.slice(-4).map(m => `${m.sender}: ${m.text}`).join('\n')}
              
              User: ${inputValue}`
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
        
        // Handle response
        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || 
                      "I didn't understand that. Could you rephrase?";
        
        setMessages(prev => [...prev, { text: aiText, sender: 'ai' }]);
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
  
    // Mock response when API fails (development only)
    const getMockResponse = (input) => {
      const mockResponses = [
        "Building habits takes time! Try starting small with 5-minute daily sessions.",
        "Consistency is key. Have you tried habit stacking with an existing routine?",
        "Remember to celebrate small wins to stay motivated!",
        "What's one small step you can take today toward your habit goal?"
      ];
      return mockResponses[Math.floor(Math.random() * mockResponses.length)];
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
                <Message key={index} className={message.sender}>
                  {message.text}
                </Message>
              ))}
              {isLoading && (
                <Message className="ai">
                  <LoadingDots>
                    <div>•</div>
                    <div>•</div>
                    <div>•</div>
                  </LoadingDots>
                </Message>
              )}
              <div ref={messagesEndRef} />
            </ChatMessages>
            <ChatInputContainer>
              <ChatInput
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about habits..."
                disabled={isLoading}
              />
              <SendButton onClick={handleSendMessage} disabled={isLoading}>
                {isLoading ? '...' : '→'}
              </SendButton>
            </ChatInputContainer>
          </ChatWindow>
        )}
        <ChatButton onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? '✕' : '🤖'}
        </ChatButton>
      </ChatContainer>
    );
  };
  
  export default AIChat;