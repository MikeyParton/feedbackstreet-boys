import React, { useEffect, useCallback } from 'react';
import qs from 'query-string';
import styled from 'styled-components';
import Selection from './components/Selection';
import { scrollTo } from '../utils';
import ScreenshotProvider from './context/ScreenshotContext';
import { WIDGET_HIDE } from '../constants';

const Container = styled.div`
  *, *:before, *:after {
    box-sizing: border-box;
  }
`;

const ButtonContainer = styled.div`
  position: fixed;
  left: 24px;
  bottom: 24px;
  z-index: 5001;
`;

const App = () => {
  useEffect(() => {
    const { feedbackstreet_boys_scroll } = qs.parse(window.location.search);
    if (feedbackstreet_boys_scroll) {
      scrollTo(feedbackstreet_boys_scroll);
    }
  }, []);

  const onCancel = useCallback(() => {
    chrome.runtime.sendMessage({ type: WIDGET_HIDE });
  }, []);

  const onSave = useCallback(() => {}, []);

  return (
    <ScreenshotProvider>
      <Container>
        <ButtonContainer>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </ButtonContainer>
        <Selection
          onSave={onSave}
          onClose={onCancel}
        />
      </Container>
    </ScreenshotProvider>
  );
};

export default App;
