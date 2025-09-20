// // Add this spy code at the very top of src/index.js
// const OriginalURL = window.URL;
// window.URL = function(...args) {
//   // The first argument to the URL constructor is the url string itself
//   const urlString = args[0];

//   // We are looking for an invalid URL. It's often undefined, null, or a relative path.
//   // This check will trigger on bad values.
//   if (typeof urlString !== 'string' || (!urlString.startsWith('http') && !urlString.startsWith('blob'))) {
//     console.error('--- URL SPY TRIGGERED ---');
//     console.error('Attempted to create a URL with this invalid input:', urlString);

//     // This line will pause your browser's debugger
//     debugger; 
//   }

//   // This calls the original, real URL constructor
//   return new OriginalURL(...args);
// };

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from 'react-redux';
import { store } from './app/store';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  // {/* </React.StrictMode> */}
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
