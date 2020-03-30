import React, { useState, useEffect } from 'react';
import qs from 'query-string';
import styled from 'styled-components';
import Snackbar from '@material-ui/core/Snackbar';
import Selection from './Selection';
import { scrollTo } from './utils';
import ScreenshotProvider from './ScreenshotContext';

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
    </ScreenshotProvider>
  );
};

export default App;
