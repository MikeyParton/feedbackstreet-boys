import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import {
  takeScreenShot,
  useMouse,
  boxDimensions,
} from './utils';

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
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
`;

const Crosshairs = styled.div`
  height: 100%;
  position: absolute;
  width: 100%;
  z-index: 999999999999;

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
  width: 100%;
  height: 100%;
  max-width: 600px;
  background-image: url('${({ src }) => src}');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`;

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

const Selection = () => {
  const [selectionCorner, setSelectionCorner] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [image, setImage] = useState(null);
  const [show, setShow] = useState(false);
  const { x, y } = useMouse();

  const {
    left,
    top,
    rightBorder,
    bottomBorder,
  } = boxDimensions({ x, y }, selectionCorner);

  const borderWidth = `${top}px ${rightBorder}px ${bottomBorder}px ${left}px`;

  const handleMouseDown = (event) => {
    setSelectionCorner({ x: event.clientX, y: event.clientY });
    setDragging(true);
  };

  const handleMouseUp = async (event) => {
    const box = boxDimensions(selectionCorner, { x: event.clientX, y: event.clientY });
    const screenShot = await takeScreenShot(box);
    setDragging(false);
    setShow(true);
    setImage(screenShot);
  };

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
      <Dialog
        open={show}
        onClose={() => setShow(false)}
        TransitionComponent={Transition}
        keepMounted
      >
        <DialogTitle>
          Leave Feedback
        </DialogTitle>
        <DialogContent>
          <Box width="500px" height="300px">
            <Preview src={image} />
          </Box>
        </DialogContent>
      </Dialog>
      {!show && (
        dragging
          ? <SelectionOverlay style={{ borderWidth }} />
          : (
            <Overlay>
              <Crosshairs style={{ left: x, top: y }} />
            </Overlay>
          )
      )}
    </>
  );
};

const App = () => {
  const [active, setActive] = useState(false);

  return (
    <Container>
      {active && <Selection />}
      <Box position="fixed" left="20px" bottom="20px">
        <Button
          variant="contained"
          color="primary"
          onClick={() => setActive((prev) => !prev)}
        >
          {active ? 'Cancel' : 'Leave Feedback'}
        </Button>
      </Box>
    </Container>
  );
};

export default App;
