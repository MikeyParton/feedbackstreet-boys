import React, { useState, useEffect, useRef } from 'react';
import styled, { createGlobalStyle } from 'styled-components';

const SELECTED_CLASS = 'feedbackstreetBoysSelected'

const GlobalStyle = createGlobalStyle`
  .${SELECTED_CLASS} {
    border: 2px solid blue;
  }
`;

const Container = styled.div`
  position: fixed;
  z-index: 999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999;
  left: 20px;
  bottom: 20px;
`

const Button = styled.button`
  padding: 8px 16px;
  background-color: blue;
  color: white;
  border-radius: 4px;
  cursor: pointer;
`;

const App = () => {
  const [active, setActive] = useState(false);
  const selected = useRef();
  const handleClick = (event) => {
    if (selected.current) {
      selected.current.classList.remove(SELECTED_CLASS);
    }
    selected.current = event.target;
    selected.current.classList.add(SELECTED_CLASS);
  };
  
  const cleanup = () => {
    document.removeEventListener('click', handleClick);
    if (selected.current) {
      selected.current.classList.remove(SELECTED_CLASS);
    }
  }

  useEffect(() => {
    if (active) {
      document.addEventListener('click', handleClick);
    } else {
      cleanup();
    }
    return () => {
      cleanup();
    }
  }, [active]);

  return (
    <Container>
      <GlobalStyle />
      <Button onClick={() => setActive(prev => !prev)}>
        {active ? 'Off' : 'On'}
      </Button>
    </Container>
  );
};

export default App;