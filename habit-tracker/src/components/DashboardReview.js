/*
Overview
The DashboardReview component provides users with an interactive review submission interface within the HabitQuest application. It features a visually appealing form with animated background elements and a clean, modern design.

Key Features
1. Review Form Functionality
Name Input: Captures user's names

Star Rating System: 5-star interactive rating selector

Review Text Area: For detailed feedback

Form Validation: Ensures all fields are completed

Submission Handling: Processes and clears form on submit

2. Visual Elements
Animated Space Theme: Floating stars, rocket with trail

Progress Circle: Animated rotating element

Achievement Badge: Trophy icon for gamification

XP Orbs: Subtle floating particles

Mountain Scenery: Background landscape

3. User Experience
Interactive Rating: Clickable star ratings

Form Feedback: Success and error messages

Navigation: Sidebar for accessing other app sections

Responsive Design: Adapts to different screen sizes

Technical Implementation
Component Structure
Styled Components: Uses styled-components for all UI elements

Custom Animations: Keyframe animations for interactive elements

Form State Management: React hooks for form control

Navigation: React Router integration

State Management
name: Stores user's name input

rating: Tracks selected star rating (1-5)

review: Stores review text content

submitted: Boolean for submission status

error: Stores validation error messages

Key Functions
handleRatingClick: Updates selected star rating

handleSubmit: Validates and processes form submission

Basic form validation with error feedback

Data Flow
User interacts with form elements (name, rating, review)

State updates on each interaction

On submission, validation occurs

If valid, form clears and shows success message

If invalid, shows error message

Integration Points
Navigation
Links to other application sections:

Dashboard

Games

Events

Review (current active)

Dependencies
React

styled-components

React Router

Theme configuration

UI Elements
Form Components
Input Field: For user's name

Star Rating: Interactive 5-star selector

Text Area: For detailed review content

Submit Button: With disabled state handling

Messages: Success and error feedback

Visual Elements
Animated Background: Space-themed with floating elements

Sidebar Navigation: Consistent app navigation

Decorative Elements: Rocket, stars, progress circle

Accessibility Features
Semantic HTML form structure

Clear labels for all form inputs

Interactive elements have visual feedback

Responsive design

Error Handling
Form validation with user feedback

Error message display

Protected against empty submissions

Usage Example
jsx
Copy
<DashboardReview />
The component is self-contained and only requires proper routing setup in the application.

Styling Details
Animations
floatAnimation: Gentle up/down floating motion

starGlow: Pulsing glow effect for stars

slowRotate: Continuous rotation for progress circle

trailAnimation: Rocket exhaust trail effect

Color Scheme
Uses theme colors for consistency

Dark background with accent highlights

Semi-transparent elements for depth

Layout
Fixed sidebar navigation

Centered main content area

Responsive padding and spacing

This component provides a engaging way for users to submit feedback while maintaining the gamified aesthetic of the HabitQuest application. The combination of functional form elements and decorative animations creates an enjoyable user experience.

*/

import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../theme';
import { useNavigate } from 'react-router-dom';

// **ANIMATIONS**
const floatAnimation = keyframes`
  0% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(2deg); }
  100% { transform: translateY(0) rotate(0deg); }
`;

const starGlow = keyframes`
  0% { opacity: 0.6; filter: blur(1px); }
  50% { opacity: 1; filter: blur(0px); }
  100% { opacity: 0.6; filter: blur(1px); }
`;

const slowRotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const trailAnimation = keyframes`
  0% { opacity: 0; transform: translateX(20px); }
  20% { opacity: 0.7; }
  100% { opacity: 0; transform: translateX(-100px); }
`;

// **BACKGROUND**
const Background = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #2b3a67 0%, #1a2233 100%);
  overflow: hidden;
`;

// Gradient Overlay
const GradientOverlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 30% 50%, rgba(114, 137, 218, 0.15) 0%, transparent 70%),
              radial-gradient(circle at 70% 70%, rgba(90, 128, 244, 0.1) 0%, transparent 60%);
  z-index: 1;
`;

// Mountain scenery in the background (like in the gaming controller image)
const Scenery = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 30%;
  background: linear-gradient(180deg, transparent 0%, rgba(48, 56, 97, 0.2) 100%);
  z-index: 1;
  
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 5%;
    width: 30%;
    height: 80%;
    background: linear-gradient(135deg, #3b4874 20%, #2b3a67 100%);
    clip-path: polygon(0% 100%, 50% 30%, 100% 100%);
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    right: 15%;
    width: 40%;
    height: 90%;
    background: linear-gradient(135deg, #2b3a67 20%, #1a2233 100%);
    clip-path: polygon(0% 100%, 40% 20%, 80% 60%, 100% 100%);
  }
`;

// **STARS**
const Star = styled.div`
  position: absolute;
  width: ${props => props.size || '30px'};
  height: ${props => props.size || '30px'};
  background: radial-gradient(circle, rgba(255, 210, 70, 0.9) 0%, rgba(255, 210, 70, 0) 70%);
  border-radius: 50%;
  z-index: 2;
  animation: ${starGlow} ${props => props.duration || '3s'} infinite ease-in-out;
  animation-delay: ${props => props.delay || '0s'};
  opacity: 0.7;
  
  &::before {
    content: '★';
    position: absolute;
    font-size: ${props => parseInt(props.size) * 0.8 || '24px'};
    color: rgba(255, 210, 70, 0.9);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

// **ROCKET WITH TRAIL**
const Rocket = styled.div`
  position: absolute;
  top: 30%;
  left: 15%;
  width: 50px;
  height: 50px;
  z-index: 3;
  animation: ${floatAnimation} 8s infinite ease-in-out;
  transform-origin: center center;
  
  &::before {
    content: '🚀';
    position: absolute;
    font-size: 28px;
    transform: rotate(45deg);
  }
`;

const RocketTrail = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  width: 80px;
  height: 8px;
  background: linear-gradient(90deg, rgba(100, 220, 255, 0) 0%, rgba(100, 220, 255, 0.7) 100%);
  border-radius: 4px;
  z-index: 2;
  opacity: 0.5;
  filter: blur(2px);
  transform: translateX(-80px);
  animation: ${trailAnimation} 2s infinite;
`;

// **PROGRESS CIRCLE**
const ProgressCircle = styled.div`
  position: absolute;
  bottom: 20%;
  right: 10%;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid rgba(100, 220, 255, 0.2);
  border-top: 3px solid rgba(100, 220, 255, 0.8);
  animation: ${slowRotate} 8s linear infinite;
  z-index: 2;
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 70px;
    height: 70px;
    border-radius: 50%;
    border: 2px dashed rgba(100, 220, 255, 0.2);
  }
`;

// **XP ORB - SUBTLE VERSION**
const XPOrb = styled.div`
  position: absolute;
  width: 15px;
  height: 15px;
  background: radial-gradient(circle, rgba(160, 232, 255, 0.6) 30%, rgba(160, 232, 255, 0) 70%);
  border-radius: 50%;
  animation: ${floatAnimation} ${props => props.duration || '4s'} infinite ease-in-out;
  animation-delay: ${props => props.delay || '0s'};
  opacity: 0.5;
  z-index: 2;
`;

// **ACHIEVEMENT BADGE**
const AchievementBadge = styled.div`
  position: absolute;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(114, 137, 218, 0.2) 0%, rgba(114, 137, 218, 0) 70%);
  border: 2px solid rgba(114, 137, 218, 0.3);
  box-shadow: 0 0 15px rgba(114, 137, 218, 0.2);
  top: 15%;
  right: 15%;
  z-index: 2;
  
  &::before {
    content: '🏆';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 24px;
  }
`;

const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  position: relative;
  color: ${theme.colors.text};
`;

const Sidebar = styled.div`
  width: 250px;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  border-right: 1px solid ${theme.colors.borderWhite};
  backdrop-filter: blur(8px);
  z-index: 10;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 2rem;
`;

const NavItem = styled.li`
  padding: 1rem;
  margin: 0.5rem 0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 1rem;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  &.active {
    background: ${theme.colors.secondary};
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 3rem;
  margin-left: -100px;
  z-index: 10;
`;

// **REVIEW FORM STYLES**
const ReviewFormContainer = styled.div`
  background: rgba(30, 39, 73, 0.6);
  padding: 2.5rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(114, 137, 218, 0.2);
  max-width: 600px;
  margin: 0 auto;
  color: ${theme.colors.text};
  box-shadow: 0 8px 32px rgba(14, 21, 47, 0.2), 
              0 0 0 1px rgba(114, 137, 218, 0.1), 
              inset 0 1px 1px rgba(255, 255, 255, 0.05);
`;

const FormTitle = styled.h2`
  text-align: center;
  margin-bottom: 1.5rem;
  color: #ffffff;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid ${theme.colors.borderWhite};
  border-radius: 8px;
  color: ${theme.colors.text};
  font-size: 1rem;
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid ${theme.colors.borderWhite};
  border-radius: 8px;
  color: ${theme.colors.text};
  font-size: 1rem;
  resize: vertical;
  min-height: 120px;
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
`;

const RatingContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const RatingStar = styled.span`
  font-size: 1.5rem;
  cursor: pointer;
  color: ${props => (props.active ? theme.colors.accent : 'rgba(255, 255, 255, 0.4)')};
  transition: color 0.2s ease;
  &:hover {
    color: ${theme.colors.accent};
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: ${theme.colors.accent};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    background: ${theme.colors.secondary};
    transform: translateY(-2px);
  }
  &:disabled {
    background: rgba(114, 137, 218, 0.5);
    cursor: not-allowed;
    transform: none;
  }
`;

const SuccessMessage = styled.div`
  text-align: center;
  margin-top: 1rem;
  color: ${theme.colors.accent};
  font-weight: 600;
`;

const ErrorMessage = styled.div`
  color: #ff4d4d;
  margin-top: 1rem;
  text-align: center;
`;

const DashboardReview = () => {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleRatingClick = (value) => {
    setRating(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!name.trim() || !review.trim() || rating === 0) {
      setError('Please fill out all fields and select a rating.');
      return;
    }

    // Simulate form submission (e.g., send to backend)
    console.log('Review Submitted:', { name, rating, review });

    // Clear form and show success message
    setName('');
    setRating(0);
    setReview('');
    setSubmitted(true);
    setError('');
  };

  return (
    <DashboardContainer>
      <Background>
        <GradientOverlay />
        <Scenery />
        <Star size="20px" style={{ top: '10%', left: '10%' }} duration="4s" delay="0.5s" />
        <Star size="15px" style={{ top: '25%', left: '25%' }} duration="3s" delay="1s" />
        <Star size="25px" style={{ top: '15%', right: '30%' }} duration="5s" delay="0.2s" />
        <Rocket>
          <RocketTrail />
        </Rocket>
        <AchievementBadge />
        <ProgressCircle />
        <XPOrb style={{ top: '65%', left: '15%' }} duration="6s" delay="0.2s" />
        <XPOrb style={{ top: '30%', right: '25%' }} duration="5s" delay="1.2s" />
        <XPOrb style={{ top: '75%', right: '30%' }} duration="7s" delay="0.5s" />
        <XPOrb style={{ top: '45%', left: '60%' }} duration="5.5s" delay="1.5s" />
      </Background>

      <Sidebar>
        <h2>HabitQuest</h2>
        <NavList>
          <NavItem onClick={() => navigate('/dashboard')}>Dashboard</NavItem>
          <NavItem onClick={() => navigate('/breakthrough-game')}>Mini Games</NavItem>
          <NavItem onClick={() => navigate('/track')}>Calender Tracker</NavItem>
          <NavItem onClick={() => navigate('/NewHabit')}>Habit Creation</NavItem>
          <NavItem onClick={() => navigate('/shop')}>Shop</NavItem>
          <NavItem className="active">Review</NavItem>
        </NavList>
      </Sidebar>

      <MainContent>
        <ReviewFormContainer>
          <FormTitle>Leave a Review</FormTitle>
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Your Name</Label>
              <Input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label>Rating</Label>
              <RatingContainer>
                {[1, 2, 3, 4, 5].map((star) => (
                  <RatingStar
                    key={star}
                    active={star <= rating}
                    onClick={() => handleRatingClick(star)}
                  >
                    ★
                  </RatingStar>
                ))}
              </RatingContainer>
            </FormGroup>

            <FormGroup>
              <Label>Your Review</Label>
              <TextArea
                placeholder="Write your review here..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
              />
            </FormGroup>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <SubmitButton type="submit" disabled={submitted}>
              {submitted ? 'Thank You!' : 'Submit Review'}
            </SubmitButton>

            {submitted && (
              <SuccessMessage>
                Thank you for your feedback! 🎉
              </SuccessMessage>
            )}
          </form>
        </ReviewFormContainer>
      </MainContent>
    </DashboardContainer>
  );
};

export default DashboardReview;
