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