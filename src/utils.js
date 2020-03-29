import { useState, useEffect } from 'react';

export const Z_INDEX = 1300;

export const takeScreenShot = async ({
  top,
  left,
  width,
  height,
}) => {
  const { scrollTop, scrollLeft } = document.documentElement;
  chrome.runtime.sendMessage({ message: 'takeScreenshot' });
};

export const useMouse = () => {
  const [mouse, setMouse] = useState({
    x: 0,
    y: 0,
  });

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

export const boxDimensions = (corner1, corner2) => {
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

export const dataUrlToBlob = async (url) => {
  const res = await fetch(url);
  const blob = await res.blob();
  return blob;
};

export const makeBlob = (dataURI) => {
  const byteString = atob(dataURI.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: 'png' });
};

export const wait = (time = 0) => new Promise((resolve) => {
  setTimeout(() => {
    resolve();
  }, time);
});

export const scrollTo = (top) => {
  window.scrollTo({ top, behavior: 'smooth' });
};
