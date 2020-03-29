import React, { useState, useEffect } from 'react';
import qs from 'query-string';
import styled from 'styled-components';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Selection from './Selection';
import { Z_INDEX } from './constants';
import { scrollTo } from './utils';
import ScreenshotProvider from './ScreenshotContext';

const Container = styled.div`
  *, *:before, *:after {
    box-sizing: border-box;
  }
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
        <Box position="fixed" left="24px" bottom="24px" zIndex={Z_INDEX}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setActive((prev) => !prev)}
          >
            {active ? 'Cancel' : 'Leave Feedbacks'}
          </Button>
        </Box>
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
