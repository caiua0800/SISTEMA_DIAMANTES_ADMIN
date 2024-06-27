import React from "react";
import styled, { keyframes } from "styled-components";

export default function Loading({ load }) {
  return (
    <LoadingWrapper className={load ? "loading" : "d-none"}>
      <CLoader></CLoader>
    </LoadingWrapper>
  );
}

const LoadingWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.753);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;

  &.d-none {
    display: none;
  }
`;

const rotatingAnimation = keyframes`
  to {
    transform: rotate(1turn);
  }
`;

const CLoader = styled.div`
  animation: ${rotatingAnimation} 1s infinite;
  border: 6px solid #e5e5e5;
  border-radius: 50%;
  border-top-color: #51d4db;
  height: 50px;
  width: 50px;
`;
