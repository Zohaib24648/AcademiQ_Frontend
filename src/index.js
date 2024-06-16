// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from "../src/App";
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './store';




ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
);

reportWebVitals();
