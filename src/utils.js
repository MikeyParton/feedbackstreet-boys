import { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';

export const takeScreenShot = async ({
  top,
  left,
  width,
  height,
}) => {
  const canvas = await html2canvas(document.querySelector('body'), { allowTaint: true });
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

export const useMouse = () => {
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
