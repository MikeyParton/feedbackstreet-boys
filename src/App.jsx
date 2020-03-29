import React, { useState, useEffect } from 'react';
import qs from 'query-string';
import Frame, { FrameContextConsumer } from 'react-frame-component';
import styled, { StyleSheetManager } from 'styled-components';
import Snackbar from '@material-ui/core/Snackbar';
import Selection from './Selection';
import { scrollTo } from './utils';
import ScreenshotProvider from './ScreenshotContext';

const frameStyles = {
  height: '100vh',
  width: '100vw',
  position: 'fixed',
  top: 0,
  left: 0,
  border: 'none',
  zIndex: 10000000000000000000,
};

const Container = styled.div`
  *, *:before, *:after {
    box-sizing: border-box;
  }
`;

const ButtonContainer = styled.div`
  position: fixed;
  left: 24px;
  bottom: 24px;
  z-index: 1300;
`;

const App = () => {
  const [active, setActive] = useState(false);
  const [snack, setSnack] = useState(null);
  const closeSnack = () => {
    setSnack(null);
  };

  useEffect(() => {
    const { feedbackstreet_boys_scroll } = qs.parse(window.location.search);
    if (feedbackstreet_boys_scroll) {
      scrollTo(feedbackstreet_boys_scroll);
    }
  }, []);

  const onSave = () => {
    setSnack('Feedback Sent!');
    setActive(false);
    setTimeout(() => {
      setSnack(null);
    }, 2000);
  };


  return (
    <ScreenshotProvider>
      <Frame style={frameStyles}>
        <FrameContextConsumer>
          {(frameContext) => (
            <StyleSheetManager target={frameContext.document.head}>

              <Container>
                {active && <Selection onSave={onSave} onClose={() => setActive(false)} />}
                <ButtonContainer>
                  <button type="button" onClick={() => setActive((prev) => !prev)}>
                    {active ? 'Cancel' : 'Leave Feedbacks'}
                  </button>
                </ButtonContainer>
                <Snackbar
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  open={Boolean(snack)}
                  onClose={closeSnack}
                  message={<span>{snack}</span>}
                />
              </Container>
            </StyleSheetManager>
          )}
        </FrameContextConsumer>
      </Frame>
    </ScreenshotProvider>
  );
};

export default App;
