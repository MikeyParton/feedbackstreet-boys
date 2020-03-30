import { SCREENSHOT_REQUESTED, SCREENSHOT_READY } from './constants';

chrome.runtime.onMessage.addListener((request) => {
  if (request && request.type === SCREENSHOT_REQUESTED) {
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
  }
});
