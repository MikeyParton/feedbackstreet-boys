import React, { useState, useEffect } from 'react';
import qs from 'query-string';
import Axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import IssueModal from '../IssueModal';
import {
  Overlay,
  SelectionOverlay,
  Crosshairs,
  Instructions,
} from './styled';
import {
  useMouse,
  boxDimensions,
  dataUrlToBlob,
  wait,
} from '../utils';
import { useScreenshot } from '../ScreenshotContext';

const Selection = ({ onClose, onSave }) => {
  const [selectionCorner, setSelectionCorner] = useState({ x: 0, y: 0 });
  const [otherSelectionCorner, setOtherSelectionCorner] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [show, setShow] = useState(false);
  const { x, y } = useMouse();
  const { requestScreenshot, currentImage } = useScreenshot();

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
    const file = await dataUrlToBlob(currentImage);
    const data = new FormData();
    const box = boxDimensions(selectionCorner, otherSelectionCorner);

    data.append('image', file);

    // first store the image
    const response = await Axios.post('http://localhost:3001/images', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    // Add scroll param to url
    const { search, origin, pathname } = window.location;
    const params = qs.parse(search);
    const { scrollTop } = document.documentElement;

    if (scrollTop > 0) {
      params.feedbackstreet_boys_scroll = scrollTop + box.top;
    }

    const url = `${origin}${pathname}?${qs.stringify(params)}`;

    // Then send the feedback
    await Axios.post('http://localhost:3001/feedback', {
      user: values.user,
      url,
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
    const box = boxDimensions(selectionCorner, otherCorner);
    // Little helper to test longer loading times
    await wait(1000);
    requestScreenshot(box);
    setDragging(false);
    setShow(true);
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
      <IssueModal
        show={show}
        handleClose={handleClose}
        handleSave={handleSave}
      />
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

export default Selection;
