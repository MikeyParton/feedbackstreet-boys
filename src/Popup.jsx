import React from 'react';
import styled from 'styled-components';
import { WIDGET_SHOW } from './constants';

const Container = styled.div`
  width: 200px;
`;

const Button = styled.button`
`;

const Popup = () => {
  const show = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: WIDGET_SHOW,
      });
    });
    window.close();
  };

  return (
    <Container>
      <h1>This is the popup</h1>
      <Button onClick={show}>Start</Button>
    </Container>
  );
};

export default Popup;
