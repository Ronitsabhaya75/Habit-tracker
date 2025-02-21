import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { theme } from '../theme';

const HomeContainer = styled.div`
  min-height: 100vh;
  background: ${theme.colors.primaryGradient};
  color: ${theme.colors.text};
  padding: 2rem;
`;

const HeroSection = styled.div`
  text-align: center;
  padding: 4rem 0;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  line-height: 1.2;
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  line-height: 1.6;
`;

const CTAButton = styled(Link)`
  background: ${theme.colors.secondary};
  color: ${theme.colors.text};
  padding: 1rem 2rem;
  border-radius: 30px;
  text-decoration: none;
  font-weight: bold;
  display: inline-block;
  margin: 1rem 0;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 4rem auto;
`;

const FeatureCard = styled.div`
  background: ${theme.colors.glassWhite};
  padding: 2rem;
  border-radius: 15px;
  text-align: center;
  backdrop-filter: blur(5px);
  border: 1px solid ${theme.colors.borderWhite};
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  margin: 1rem 0;
`;

const FeatureText = styled.p`
  opacity: 0.9;
  line-height: 1.6;
`;

const Home = () => {
  return (
    <HomeContainer>
      <HeroSection>
        <Title>Level Up</Title>
        <Subtitle>
          Turn your daily habits into an engaging game. Track progress, earn
          <br />
          XP, unlock achievements, and build lasting habits while having fun!
        </Subtitle>
        <CTAButton to="/register">Get Started</CTAButton>
      </HeroSection>

      <FeaturesGrid>
        <FeatureCard>
          <FeatureTitle>Track Progress</FeatureTitle>
          <FeatureText>
            Monitor your habits with beautiful
            <br />
            visualizations and stats
          </FeatureText>
        </FeatureCard>

        <FeatureCard>
          <FeatureTitle>Earn Rewards</FeatureTitle>
          <FeatureText>
            Level up and unlock achievements as you
            <br />
            build better habits
          </FeatureText>
        </FeatureCard>

        <FeatureCard>
          <FeatureTitle>Stay Motivated</FeatureTitle>
          <FeatureText>
            Join a community of people building better
            <br />
            habits together
          </FeatureText>
        </FeatureCard>
      </FeaturesGrid>
    </HomeContainer>
  );
};

export default Home;