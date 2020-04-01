import { WIDGET_SHOW, WIDGET_HIDE } from './constants';

const ID = 'feedbackstreetBoys';
const baseStyles = {
  border: 0,
  height: '100vh',
  width: '100vw',
  position: 'fixed',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  zIndex: 100000000,
};

const activeStyles = {
  ...baseStyles,
  display: 'block',
};

const inactiveStyles = {
  ...baseStyles,
  display: 'none',
};

function setup() {
  const iframe = document.createElement('iframe');
  iframe.src = chrome.extension.getURL('Widget/index.html');
  iframe.setAttribute('id', ID);
  document.body.appendChild(iframe);
  return iframe;
}

function show() {
  const iframe = document.getElementById(ID) || setup();
  Object.assign(iframe.style, activeStyles);
}

function hide() {
  const iframe = document.getElementById(ID);
  Object.assign(iframe.style, inactiveStyles);
}

const handlers = {
  [WIDGET_SHOW]: show,
  [WIDGET_HIDE]: hide,
};

chrome.runtime.onMessage.addListener((message) => {
  const handler = handlers[message.type];
  if (handler) {
    handler(message);
  }
});
