/**
 * Footer Component
 *
 * This file implements the Footer component for the LevelUp application.
 * It displays a footer section that includes:
 *  - A gradient background using the theme's primary colors.
 *  - A list of group members' names displayed in a responsive layout.
 *  - A copyright notice indicating the year 2025.
 *
 * The component utilizes:
 *  - styled-components for CSS-in-JS styling.
 *  - Flexbox for organizing member names in a responsive format.
 *  - Theme-based colors to maintain design consistency.
 *
 * This footer is intended to appear at the bottom of the application and
 * dynamically adjust its spacing using `margin-top: auto` to ensure proper layout.
 */

import styled from 'styled-components';
import { theme } from '../theme';

const FooterContainer = styled.footer`
  background: ${theme.colors.primaryGradient};
  color: ${theme.colors.text};
  padding: 2rem;
  text-align: center;
  margin-top: auto;
`;

const MembersList = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
  margin: 1rem 0;
`;

const MemberName = styled.span`
  font-size: 1.1rem;
  opacity: 0.9;
`;


const Footer = () => {
  return (
    <FooterContainer>
      <h3>Group Members</h3>
      <MembersList>
        <MemberName>Ronitkumar Sabhaya</MemberName>
        <MemberName>Jay Findoliya</MemberName>
        <MemberName>Aashishpal Reddy Kandala</MemberName>
        <MemberName>Siddartha Reddy Pagilla</MemberName>
        <MemberName>Shivam Sakthivelpandi</MemberName> 
        <MemberName>Diego Davila</MemberName></MembersList>
      <p>© 2025 LevelUp. All rights reserved.</p>
    </FooterContainer>
  );
};

export default Footer;