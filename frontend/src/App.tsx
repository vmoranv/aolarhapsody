import React from 'react';
import { HashRouter } from 'react-router-dom';
import Router from './router';

const App = () => {
  return (
    <React.Fragment>
      <HashRouter>
        <Router />
      </HashRouter>
    </React.Fragment>
  );
};

export default App;
