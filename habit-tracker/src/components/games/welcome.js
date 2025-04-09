import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';

const WelcomeOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const WelcomeCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 30px;
  max-width: 500px;
  width: 90%;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const Logo = styled.h1`
  font-size: 48px;
  color: #1a73e8;
  margin: 0 0 30px;
  font-family: 'Arial', sans-serif;
  font-weight: bold;
`;

const GuideBox = styled.div`
  background: #f8f9fa;
  border: 2px solid #e8eaed;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
  position: relative;
`;

const GuideHeader = styled.div`
  background: #1a73e8;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  display: inline-block;
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const InputGroup = styled.div`
  margin: 20px 0;
  text-align: left;
`;

const Label = styled.div`
  font-weight: 500;
  color: #5f6368;
  margin-bottom: 8px;
`;

const Input = styled.div`
  padding: 12px;
  border: 2px solid #e8eaed;
  border-radius: 8px;
  background: white;
  color: #1a73e8;
  font-weight: 500;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CheckIcon = styled.span`
  color: #34a853;
  font-size: 20px;
`;

const GetStartedButton = styled.button`
  background: #1a73e8;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 24px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #1557b0;
  }
`;

const Welcome = ({ onClose }) => {
  const { user } = useAuth();
  const displayName = user?.name || 'New Player';
  const username = user?.email?.split('@')[0] || 'player123';

  return (
    <WelcomeOverlay>
      <WelcomeCard>
        <Logo>Welcome to Gamify</Logo>
        <GuideBox>
          <GuideHeader>Guide</GuideHeader>
          <p style={{ marginTop: '20px' }}>
            Hello there! You must be new here. My name is Guide,
            and I'll be your guide in Gamify.
          </p>
          <p>
            Below you'll find your display name and username. Once you're ready,
            we'll get started by creating your avatar!
          </p>
        </GuideBox>

        <InputGroup>
          <Label>Display name</Label>
          <Input>
            {displayName}
            <CheckIcon>✓</CheckIcon>
          </Input>
        </InputGroup>

        <InputGroup>
          <Label>Username</Label>
          <Input>
            @{username}
            <CheckIcon>✓</CheckIcon>
          </Input>
        </InputGroup>

        <GetStartedButton onClick={onClose}>
          Get Started
        </GetStartedButton>
      </WelcomeCard>
    </WelcomeOverlay>
  );
};

export default Welcome; 

