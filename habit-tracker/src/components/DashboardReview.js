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
import styled, { keyframes, css } from 'styled-components';
import { useNavigate } from 'react-router-dom';

// Theme from Original Dashboard (aligned with updated Track)
const dashboardTheme = {
  backgroundGradient: 'linear-gradient(to bottom, #0B1A2C, #152642)',
  accentGlow: '#00FFF5',
  accentGradientStart: '#00FFC6',
  accentGradientEnd: '#4A90E2',
  textPrimary: '#B8FFF9',
  cardBackground: 'rgba(21, 38, 66, 0.8)',
  glassOverlay: 'rgba(11, 26, 44, 0.9)',
  borderGlow: 'rgba(0, 255, 198, 0.3)',
  buttonGradient: 'linear-gradient(90deg, #00FFC6 0%, #4A90E2 100%)',
};

// Animations from Original Dashboard (aligned with updated Track)
const starFloat = keyframes`
  0% { opacity: 0; transform: translateY(0px) translateX(0px); }
  50% { opacity: 1; }
  100% { opacity: 0; transform: translateY(-20px) translateX(10px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const glow = keyframes`
  0% { filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.7)); }
  50% { filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.9)); }
  100% { filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.7)); }
`;

const float = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0); }
`;

const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

// Styled Components with Dashboard Theme
const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${dashboardTheme.backgroundGradient};
  overflow: hidden;
  z-index: 0;
`;

const Star = styled.div`
  position: absolute;
  width: ${props => props.size || 2}px;
  height: ${props => props.size || 2}px;
  background-color: #ffffff;
  border-radius: 50%;
  opacity: ${props => props.opacity || 0.7};
  top: ${props => props.top}%;
  left: ${props => props.left}%;
  animation: ${starFloat} ${props => props.duration || 10}s linear infinite;
  animation-delay: ${props => props.delay || 0}s;
  box-shadow: 0 0 ${props => props.glow || 1}px ${props => props.glow || 1}px ${dashboardTheme.textPrimary};
`;

const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  position: relative;
  color: ${dashboardTheme.textPrimary};
`;

const Sidebar = styled.div`
  width: 250px;
  padding: 2rem;
  background: ${dashboardTheme.glassOverlay};
  border-right: 1px solid ${dashboardTheme.borderGlow};
  backdrop-filter: blur(10px);
  z-index: 1000;
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  box-shadow: 5px 0 15px rgba(0, 0, 0, 0.1);
  
  h2 {
    color: ${dashboardTheme.accentGlow};
    font-size: 1.8rem;
    margin-bottom: 2rem;
    font-weight: 700;
    letter-spacing: 0.5px;
    text-shadow: 0 0 10px rgba(0, 255, 245, 0.5);
  }
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
  color: ${dashboardTheme.textPrimary};
  
  &:hover {
    background: rgba(0, 255, 198, 0.1);
    transform: translateX(5px);
  }
  
  &.active {
    background: linear-gradient(90deg, rgba(0, 255, 198, 0.3), rgba(74, 144, 226, 0.3));
    border-left: 3px solid ${dashboardTheme.accentGradientStart};
    color: ${dashboardTheme.accentGlow};
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 3rem;
  margin-left: 250px;
  z-index: 10;
  overflow-y: auto;
  max-height: 100vh;
`;

const ReviewFormContainer = styled.div`
  background: ${dashboardTheme.cardBackground};
  padding: 2.5rem;
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid ${dashboardTheme.borderGlow};
  max-width: 800px;
  margin: 0 auto;
  color: ${dashboardTheme.textPrimary};
  box-shadow: 0 0 15px rgba(0, 255, 198, 0.2);
  animation: ${css`${fadeIn} 0.5s ease-out`};
`;

const FormTitle = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  color: ${dashboardTheme.accentGlow};
  text-shadow: 0 0 10px rgba(0, 255, 245, 0.5);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: ${dashboardTheme.textPrimary};
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid ${dashboardTheme.borderGlow};
  border-radius: 8px;
  color: ${dashboardTheme.textPrimary};
  font-size: 1rem;
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid ${dashboardTheme.borderGlow};
  border-radius: 8px;
  color: ${dashboardTheme.textPrimary};
  font-size: 1rem;
  appearance: none;
  cursor: pointer;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid ${dashboardTheme.borderGlow};
  border-radius: 8px;
  color: ${dashboardTheme.textPrimary};
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
  color: ${props => (props.active ? dashboardTheme.accentGlow : 'rgba(255, 255, 255, 0.4)')};
  transition: color 0.2s ease;
  &:hover {
    color: ${dashboardTheme.accentGlow};
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: ${dashboardTheme.buttonGradient};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0 10px rgba(0, 255, 198, 0.3);
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(0, 255, 198, 0.5);
  }
  &:disabled {
    background: rgba(0, 255, 198, 0.5);
    cursor: not-allowed;
    transform: none;
  }
`;

const SuccessMessage = styled.div`
  text-align: center;
  margin-top: 1rem;
  color: ${dashboardTheme.accentGlow};
  font-weight: 600;
`;

const ErrorMessage = styled.div`
  color: rgba(255, 82, 82, 0.9);
  margin-top: 1rem;
  text-align: center;
`;

const DashboardReview = () => {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [usageFrequency, setUsageFrequency] = useState('');
  const [favoriteFeatures, setFavoriteFeatures] = useState('');
  const [improvements, setImprovements] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [review, setReview] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleRatingClick = (value) => {
    setRating(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!name.trim() || rating === 0 || !usageFrequency || !favoriteFeatures.trim() || 
        !improvements.trim() || !recommendation || !review.trim()) {
      setError('Please fill out all fields.');
      return;
    }

    // Simulate form submission
    console.log('Review Submitted:', { 
      name, 
      rating, 
      usageFrequency, 
      favoriteFeatures, 
      improvements, 
      recommendation, 
      review 
    });

    // Clear form and show success
    setName('');
    setRating(0);
    setUsageFrequency('');
    setFavoriteFeatures('');
    setImprovements('');
    setRecommendation('');
    setReview('');
    setSubmitted(true);
    setError('');
  };

  const generateStars = (count) => {
    const stars = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        id: i,
        size: Math.random() * 3 + 1,
        top: Math.random() * 100,
        left: Math.random() * 100,
        opacity: Math.random() * 0.7 + 0.3,
        duration: Math.random() * 15 + 10,
        delay: Math.random() * 10,
        glow: Math.random() > 0.8 ? 3 : 1,
      });
    }
    return stars;
  };

  const stars = generateStars(100);

  return (
    <DashboardContainer>
      <Background>
        {stars.map(star => (
          <Star
            key={star.id}
            size={star.size}
            top={star.top}
            left={star.left}
            opacity={star.opacity}
            duration={star.duration}
            delay={star.delay}
            glow={star.glow}
          />
        ))}
      </Background>

      <Sidebar>
        <h2>HabitQuest</h2>
        <NavList>
          <NavItem onClick={() => navigate('/dashboard')}>👾 Dashboard</NavItem>
          <NavItem onClick={() => navigate('/breakthrough-game')}>🎮 Mini Games</NavItem>
          <NavItem onClick={() => navigate('/track')}>📅 Calendar Tracker</NavItem>
          <NavItem onClick={() => navigate('/new-habit')}>✨ Habit Creation</NavItem>
          <NavItem onClick={() => navigate('/shop')}>🛒 Shop</NavItem>
          <NavItem onClick={() => navigate('/review')}>📊 Review</NavItem>
        </NavList>
      </Sidebar>
      <MainContent>
        <ReviewFormContainer>
          <FormTitle>HabitQuest Review</FormTitle>
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
              <Label>Overall Rating</Label>
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
              <Label>How often do you use HabitQuest?</Label>
              <Select
                value={usageFrequency}
                onChange={(e) => setUsageFrequency(e.target.value)}
              >
                <option value="">Select an option</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="rarely">Rarely</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>What features do you like most?</Label>
              <TextArea
                placeholder="Tell us what you enjoy..."
                value={favoriteFeatures}
                onChange={(e) => setFavoriteFeatures(e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label>How can we improve?</Label>
              <TextArea
                placeholder="Suggestions for improvement..."
                value={improvements}
                onChange={(e) => setImprovements(e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label>Would you recommend HabitQuest?</Label>
              <Select
                value={recommendation}
                onChange={(e) => setRecommendation(e.target.value)}
              >
                <option value="">Select an option</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
                <option value="maybe">Maybe</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Additional Comments</Label>
              <TextArea
                placeholder="Anything else to share?"
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