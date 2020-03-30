const iframe = document.createElement('iframe');
iframe.src = chrome.extension.getURL('widget.html');
iframe.setAttribute('id', 'chromeExtensionReactApp');

const activeStyles = {
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

Object.assign(iframe.style, activeStyles);

document.body.appendChild(iframe);
