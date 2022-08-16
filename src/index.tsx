import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import ReactQueryTestingProvider from 'components/ReactQueryTestingProvider';

ReactDOM.render(
  <React.StrictMode>
    <ReactQueryTestingProvider>
      <App />
    </ReactQueryTestingProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
