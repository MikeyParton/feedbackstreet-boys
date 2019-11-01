import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Formik } from 'formik';
import styled from 'styled-components';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Snackbar from '@material-ui/core/Snackbar';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Typography } from '@material-ui/core';
import {
  takeScreenShot,
  useMouse,
  boxDimensions,
  dataUrlToBlob,
  wait,
} from './utils';

const Z_INDEX = 1300;

const Container = styled.div`
  *, *:before, *:after {
    box-sizing: border-box;
  }
`;

const SelectionOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-style: solid;
  background-color: inherit;
  border-color: rgba(0, 0, 0, 0.5);
  z-index: ${Z_INDEX};
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: ${Z_INDEX};
`;

const Crosshairs = styled.div`
  height: 100%;
  position: absolute;
  width: 100%;

  &::before, &::after {
    content: "";
    height: 100%;
    width: 100%;
    position: absolute;
    border: none !important;
    border-image:  !important;
  }

  &::before {
    left: -100%;
    top: -100%;
    border-right: 1px solid rgba(255, 255, 255, 0.3) !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.3) !important;
  }

  &::after {
    left: 0px;
    top: 0px;
    border-top: 1px solid rgba(255, 255, 255, 0.3) !important;
    border-left: 1px solid rgba(255, 255, 255, 0.3) !important;
  }
`;

const Preview = styled.div`
  flex-grow: 1;
  width: 100%;
  height: 300px;
  max-width: 600px;
  background-image: url('${({ src }) => src}');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-color: gainsboro;
  border-radius: 4px;
`;

const Instructions = styled(Typography)`
  && {
    position: fixed;
    top: 24px;
    left: 0;
    right: 0;
    text-align: center;
    color: white;
  }
`;

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

const Selection = ({ onClose, onSave }) => {
  const [selectionCorner, setSelectionCorner] = useState({ x: 0, y: 0 });
  const [otherSelectionCorner, setOtherSelectionCorner] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [show, setShow] = useState(false);
  const { x, y } = useMouse();

  const {
    left,
    top,
    rightBorder,
    bottomBorder,
  } = boxDimensions(otherSelectionCorner || { x, y }, selectionCorner);

  const borderWidth = `${top}px ${rightBorder}px ${bottomBorder}px ${left}px`;

  const handleClose = () => {
    setShow(false);
  };

  const handleSave = async (values) => {
    const file = await dataUrlToBlob(imagePreview);
    const data = new FormData();
    data.append('image', file);

    // first store the image
    const response = await Axios.post('http://localhost:3001/images', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    // Then send the feedback
    await Axios.post('http://localhost:3001/feedback', {
      user: values.user,
      url: window.location.href,
      comment: values.comment,
      image: response.data,
    });

    onSave();
  };

  const handleMouseDown = (event) => {
    if (event.button === 0) {
      setOtherSelectionCorner(null);
      setSelectionCorner({ x: event.clientX, y: event.clientY });
      setDragging(true);
    }
  };

  const handleMouseUp = async (event) => {
    const otherCorner = ({ x: event.clientX, y: event.clientY });
    setOtherSelectionCorner(otherCorner);
    // Little helper to test longer loading times
    // await wait(3000);
    const box = boxDimensions(selectionCorner, otherCorner);
    const screenShot = await takeScreenShot(box);
    setDragging(false);
    setShow(true);
    setImagePreview(screenShot);
  };

  const handleKeyDown = (event) => {
    if (event.key !== 'Escape' || show) return;

    if (dragging) {
      setDragging(false);
      return;
    }

    onClose();
  };

  useEffect(() => {
    document.removeEventListener('keydown', handleKeyDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [dragging, show]);

  useEffect(() => {
    if (dragging) {
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging]);

  useEffect(() => {
    if (!show) {
      document.addEventListener('mousedown', handleMouseDown);
    } else {
      document.removeEventListener('mousedown', handleMouseDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [show]);

  return (
    <>
      <Formik
        onSubmit={handleSave}
        initialValues={{
          user: '@michael',
          imagePreview,
          comment: '',
        }}
      >
        {({
          values, handleChange, submitForm, isSubmitting,
        }) => (
          <Dialog
            open={show}
            onClose={handleClose}
            TransitionComponent={Transition}
            keepMounted
          >
            <DialogTitle>
              Leave Feedback
            </DialogTitle>
            <DialogContent>
              <Box width="500px">
                <Preview src={imagePreview} />
                <Box mt={2}>
                  <>
                    <TextField
                      autoFocus
                      id="comment"
                      name="comment"
                      label="Comments"
                      margin="dense"
                      variant="outlined"
                      placeholder="Explain the issue..."
                      multiline
                      rows="4"
                      fullWidth
                      value={values.comment}
                      onChange={handleChange}
                    />
                  </>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              {isSubmitting
                ? <CircularProgress size={24} />
                : (
                  <>
                    <Button
                      onClick={handleClose}
                      variant="contained"
                      color="secondary"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={submitForm}
                      variant="contained"
                      color="primary"
                    >
                      Create
                    </Button>
                  </>
                )}
            </DialogActions>
          </Dialog>
        )}
      </Formik>
      {!show && (
        dragging
          ? (
            <SelectionOverlay
              style={{ borderWidth }}
            >
              {otherSelectionCorner && (
              <Instructions fullWidth color="white">
                Taking screenshot ... &nbsp;
                <CircularProgress size={18} color="white" />
              </Instructions>
              )}
            </SelectionOverlay>
          )
          : (
            <Overlay>
              <Instructions fullWidth color="white">
                Drag a box over a section of the screen to take a screenshot of the issue
              </Instructions>
              <Crosshairs style={{ left: x, top: y }} />
            </Overlay>
          )
      )}
    </>
  );
};

const App = () => {
  const [active, setActive] = useState(false);
  const [snack, setSnack] = useState(null);
  const closeSnack = () => {
    setSnack(null);
  };

  const onSave = () => {
    setSnack('Feedback Sent!');
    setActive(false);
    setTimeout(() => {
      setSnack(null);
    }, 2000);
  };


  return (
    <Container>
      {active && <Selection onSave={onSave} onClose={() => setActive(false)} />}
      <Box position="fixed" left="24px" bottom="24px" zIndex={Z_INDEX}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setActive((prev) => !prev)}
        >
          {active ? 'Cancel' : 'Leave Feedback'}
        </Button>
      </Box>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={Boolean(snack)}
        onClose={closeSnack}
        message={<span>{snack}</span>}
      />
    </Container>
  );
};

export default App;
