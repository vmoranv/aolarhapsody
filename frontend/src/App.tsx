import React from 'react';
import { HashRouter } from 'react-router-dom';
import Router from './router';
import { StagewiseToolbar } from '@stagewise/toolbar-react';
import ReactPlugin from '@stagewise-plugins/react';

const App = () => {
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(HashRouter, null, React.createElement(Router)),
    React.createElement(StagewiseToolbar, {
      config: {
        plugins: [ReactPlugin()],
      },
    })
  );
};

export default App;
