import React from 'react';
import ReactDOM from 'react-dom';
import 'nes.css/css/nes.min.css';
import { BrowserRouter as Router } from 'react-router-dom';

import { App } from './components';

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root')
);
