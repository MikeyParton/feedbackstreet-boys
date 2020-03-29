import React, { useEffect } from 'react';
import styled from 'styled-components';
import { SCREENSHOT_REQUESTED, SCREENSHOT_READY } from './constants';

const Container = styled.div`
  width: 200px;
`;

const Button = styled.button`
`;

const Popup = () => {
  useEffect(() => {
    chrome.runtime.onMessage.addListener((request) => {
      if (request && request.type === SCREENSHOT_REQUESTED) {
        chrome.tabs.captureVisibleTab(
          null,
          { format: 'png', quality: 100 },
          (dataURI) => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
              chrome.tabs.sendMessage(tabs[0].id, {
                type: SCREENSHOT_READY,
                dataURI,
              });
            });
          },
        );
      }
    });
  }, []);

  return (
    <Container>
      <h1>This is the popup</h1>
      <Button>Start</Button>
    </Container>
  );
};

export default Popup;
