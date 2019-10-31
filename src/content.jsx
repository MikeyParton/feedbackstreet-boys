import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const newDiv = document.createElement('div');
newDiv.setAttribute('id', 'chromeExtensionReactApp');
document.body.appendChild(newDiv);
ReactDOM.render(<App />, newDiv);
