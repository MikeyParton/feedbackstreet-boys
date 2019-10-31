import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import html2canvas from 'html2canvas';

const takeScreenShot = async ({
  top,
  left,
  width,
  height,
}) => {
  const canvas = await html2canvas(document.querySelector('body'));
  const croppedCanvas = document.createElement('canvas');
  croppedCanvas.width = width * 2;
  croppedCanvas.height = height * 2;
  const croppedCanvasContext = croppedCanvas.getContext('2d');

  croppedCanvasContext.drawImage(
    canvas,
    left * 2,
    top * 2,
    croppedCanvas.width,
    croppedCanvas.height,
    0,
    0,
    croppedCanvas.width,
    croppedCanvas.height,
  );
  return croppedCanvas.toDataURL();
};

const Container = styled.div`
  position: fixed;
  z-index: 999999999999;
  left: 20px;
  bottom: 20px;

  *, *:before, *:after {
    box-sizing: border-box;
  }
`;

const Button = styled.button`
  padding: 8px 16px;
  background-color: blue;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  bottom: 20px;
  left: 20px;
  position: fixed;
  z-index: 99999999999999;
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

const Modal = styled.div`
  top: 0;
  left: 0;
  position: fixed;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999999999999;
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

const useMouse = () => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event) => {
    setMouse({ x: event.clientX, y: event.clientY });
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return mouse;
};

const boxDimensions = (corner1, corner2) => {
  const { clientWidth, clientHeight } = document.documentElement;

  const left = Math.min(corner1.x, corner2.x);
  const right = Math.max(corner1.x, corner2.x);

  const top = Math.min(corner1.y, corner2.y);
  const bottom = Math.max(corner1.y, corner2.y);

  const width = right - left;
  const height = bottom - top;

  const rightBorder = clientWidth - left - width;
  const bottomBorder = clientHeight - top - height;

  return {
    left,
    top,
    right,
    bottom,
    width,
    height,
    rightBorder,
    bottomBorder,
  };
};

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

  if (show) {
    return (
      <>
        <Overlay />
        <Modal onClick={() => setShow(false)}>
          <Preview src={image} />
        </Modal>
      </>
    );
  }

  return (
    <>
      {dragging
        ? <SelectionOverlay style={{ borderWidth }} />
        : (
          <Overlay>
            <Crosshairs style={{ left: x, top: y }} />
          </Overlay>
        )}
    </>
  );
};

const App = () => {
  const [active, setActive] = useState(false);

  return (
    <Container>
      {active && <Selection />}
      <Button onClick={() => setActive((prev) => !prev)}>
        {active ? 'Turn Off' : 'Turn On'}
      </Button>
    </Container>
  );
};

export default App;
