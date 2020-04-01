import { SCREENSHOT_REQUESTED, SCREENSHOT_READY, WIDGET_HIDE } from './constants';

const screenshotRequested = () => {
  chrome.tabs.captureVisibleTab(
    null,
    { format: 'png', quality: 100 },
    (dataURI) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: SCREENSHOT_READY,
          dataURI,
        });
      });
    },
  );
};

const forwardMessage = (message) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, message);
  });
};

const handlers = {
  [SCREENSHOT_REQUESTED]: screenshotRequested,
  [WIDGET_HIDE]: forwardMessage,
};

chrome.runtime.onMessage.addListener((message) => {
  const handler = handlers[message.type];
  if (handler) {
    handler(message);
  }
});
