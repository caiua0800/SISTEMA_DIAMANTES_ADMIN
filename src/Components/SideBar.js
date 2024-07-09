import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux'; // Importe useDispatch para despachar actions
import { logoutUser } from '../redux/actions'; // Importe a action de logout

export default function SideBar({ NAV_LINKS }) {
  const [expanded, setExpanded] = useState(false);
  const dispatch = useDispatch(); // Obtenha a função dispatch do Redux

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  const handleLogout = () => {
    dispatch(logoutUser()); // Dispara a action de logout
  };

  return (
    <SideBarAbsolute>
      <ToggleButton expanded={expanded} onClick={toggleSidebar}>
        <ArrowIcon
          src="https://firebasestorage.googleapis.com/v0/b/white-lable-528b0.appspot.com/o/assets%2Fmenu-icon-blue.png?alt=media&token=7450779f-3169-436f-9076-fa5a36540c67"
          expanded={expanded}
        />
        {expanded ? "" : <VerticalText>SideBar</VerticalText>}
      </ToggleButton>
      <SideBarContainer expanded={expanded}>

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
            <NavFooter onClick={handleLogout}>LOGOUT</NavFooter> {/* Adiciona o onClick para chamar handleLogout */}
          </>
        )}
      </SideBarContainer>
    </SideBarAbsolute>
  );
}

const SideBarAbsolute = styled.div`
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
`;

const SideBarContainer = styled.div`
  background-color: #001D3D;
  width: ${({ expanded }) => (expanded ? "350px" : "0px")};
  height: calc(100vh - 50px);
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  overflow: hidden;
  transition: width 0.3s ease;
  position: relative;

  box-shadow: 2px 0px 2px rgba(0,0,0,0.6);
`;

const LogoContainer = styled.div`
  width: 100%;
  background: rgba(0, 8, 20, 0.5);
  height: 80px;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
  align-items: center;
`;

const LogoText = styled.span`
  color: #e3e3e3;
  font-size: 24px;
  box-sizing: border-box;
`;

const NavItemsWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
`;

const NavItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  align-items: center;
  box-sizing: border-box;
`;

const NavItem = styled.div`
  width: 100%;
  height: 50px;
  background: #FFC300;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s, transform 0.3s;
  cursor: pointer;
  box-sizing: border-box;

  a {
    text-decoration: none;
    color: rgba(0,0,0,0.6);
    font-weight: 600;
    width: 100%;
    font-size: 18px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

      &:hover {
        color: rgba(255,255,255,1);
      }
  }

  &:hover {
    background: #001D3D;
    color: rgba(255,255,255,1);
    transform: scale(1.05);
  }
`;

const NavFooter = styled.div`
  width: 100%;
  height: 80px;
  background-color: rgba(0, 8, 20, 0.5);;
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 22px;
  justify-content: center;
  box-sizing: border-box;
  cursor: pointer;
  transition: .3s;

  &:hover{
    color: rgba(255, 255, 255, 1);

  }
`;

const ToggleButton = styled.button`
  width: 100%;
  height: 50px;
  background-color: ${({ expanded }) => (expanded ? "rgba(0, 8, 20, 1);" : "transparent")};
  // box-shadow: 2px 0px 2px rgba(0,0,0,0.6);
  color: #233142;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
  display: flex;
  flex-direction: ${({ expanded }) => (expanded ? "row" : "column")};
  align-items: center;
  justify-content: ${({ expanded }) => (expanded ? "center" : "center")};
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
  color: rgba(0,0,0,0);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(180deg);
  z-index: 1;
  display: ${({ expanded }) => (expanded ? "none" : "block")};
`;
