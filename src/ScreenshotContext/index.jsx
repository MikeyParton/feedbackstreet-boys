import React, {
  useState, useContext, useEffect, createContext, useCallback,
} from 'react';
import { SCREENSHOT_READY, SCREENSHOT_REQUESTED } from '../constants';

const ScreenshotContext = createContext();

const ScreenshotProvider = ({
  children,
}) => {
  const [currentImage, setCurrentImage] = useState(null);
  const [dimensions, setDimensions] = useState(null);

  const screenshotReady = useCallback((message) => {
    const croppedCanvas = document.createElement('canvas');
    croppedCanvas.width = dimensions.width;
    croppedCanvas.height = dimensions.height;
    const croppedCanvasContext = croppedCanvas.getContext('2d');

    const imageElement = new Image();
    imageElement.onload = () => {
      croppedCanvasContext.drawImage(
        imageElement,
        dimensions.left,
        dimensions.top,
        croppedCanvas.width,
        croppedCanvas.height,
        0,
        0,
        croppedCanvas.width,
        croppedCanvas.height,
      );
      setCurrentImage(croppedCanvas.toDataURL());
    };

    imageElement.src = message.dataURI;
  }, [dimensions]);

  const requestScreenshot = (dimensionsInput) => {
    // Accounts for retina displays & device zoom
    const scale = window.devicePixelRatio;
    setCurrentImage(null);
    setDimensions({
      height: dimensionsInput.height * scale,
      width: dimensionsInput.width * scale,
      left: dimensionsInput.left * scale,
      top: dimensionsInput.top * scale,
    });

    chrome.runtime.sendMessage({ type: SCREENSHOT_REQUESTED });
  };

  const onMessage = useCallback((message) => {
    if (message.type === SCREENSHOT_READY) {
      screenshotReady(message);
    }
  }, [screenshotReady]);

  useEffect(() => {
    chrome.runtime.onMessage.addListener(onMessage);

    return () => {
      chrome.runtime.onMessage.removeListener(onMessage);
    };
  }, [onMessage, dimensions]);

  return (
    <ScreenshotContext.Provider value={{
      requestScreenshot,
      currentImage,
    }}
    >
      {children}
    </ScreenshotContext.Provider>
  );
};

export const useScreenshot = () => useContext(ScreenshotContext);

export default ScreenshotProvider;
