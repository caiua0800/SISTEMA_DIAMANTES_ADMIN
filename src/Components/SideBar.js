// Components/SideBar.js

import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { NavLink } from 'react-router-dom'; // Importe NavLink para criar links de navegação

export default function SideBar({ NAV_LINKS }) {
  const [expanded, setExpanded] = useState(false);

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  return (
    <SideBarAbsolute>
      <SideBarContainer expanded={expanded}>
        <ToggleButton onClick={toggleSidebar}>
          <ArrowIcon
            src="https://firebasestorage.googleapis.com/v0/b/white-lable-528b0.appspot.com/o/assets%2Farrow-right-svgrepo-com.png?alt=media&token=0c7997e8-f75a-4ff8-b6fb-5c7bfc94ee34"
            expanded={expanded}
          />
          {expanded ? "" : <VerticalText>SideBar</VerticalText>}
        </ToggleButton>
        {expanded && (
          <>
            <LogoContainer>
              <LogoText>LOGO</LogoText>
            </LogoContainer>
            <NavItemsWrapper>
              <NavItemsContainer>
                {NAV_LINKS.map((link, index) => (
                  <NavItem key={index}>
                    <NavLink to={link.path} activeClassName="active-link">
                      {link.name}
                    </NavLink>
                  </NavItem>
                ))}
              </NavItemsContainer>
            </NavItemsWrapper>
            <NavFooter>FOOTER</NavFooter>
          </>
        )}
      </SideBarContainer>
    </SideBarAbsolute>
  );
}

const SideBarAbsolute = styled.div`
  position: fixed;
  top: 0;
  left: 0;
`;

const SideBarContainer = styled.div`
  background-color: #233142;
  width: ${({ expanded }) => (expanded ? "350px" : "80px")};
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: width 0.3s ease;
  position: relative;
  z-index: 999;
`;

const LogoContainer = styled.div`
  width: 100%;
  background: #455d7a;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LogoText = styled.span`
  color: #e3e3e3;
  font-size: 24px;
`;

const NavItemsWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const NavItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  align-items: center;
`;

const NavItem = styled.div`
  width: 100%;
  height: 50px;
  background: #e3e3e3;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s, transform 0.3s;
  cursor: pointer;

  a {
    text-decoration: none;
    color: black;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &:hover {
    background: #e3e3e3;
    transform: scale(1.05);
  }
`;

const NavFooter = styled.div`
  width: 100%;
  height: 80px;
  background-color: #f95959;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const ToggleButton = styled.button`
  width: 100%;
  height: 50px;
  background-color: #e3e3e3;
  color: #233142;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
  display: flex;
  flex-direction: ${({ expanded }) => (expanded ? "row" : "column")};
  align-items: center;
  justify-content: ${({ expanded }) => (expanded ? "flex-start" : "center")};
  padding-left: ${({ expanded }) => (expanded ? "20px" : "0")};
`;

const rotateAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(180deg);
  }
`;

const ArrowIcon = styled.img`
  width: 50px;
  height: 50px;
  margin-right: 10px;
  animation: ${({ expanded }) =>
    expanded ? rotateAnimation : "none"} 0.3s linear forwards;
`;

const VerticalText = styled.span`
  writing-mode: vertical-lr;
  font-size: 28px;
  text-align: center;
  white-space: nowrap;
  color: #e3e3e3;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(180deg);
  z-index: 1;
  display: ${({ expanded }) => (expanded ? "none" : "block")};
`;
