import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoute from './Route/Routes';
import { RecoilRoot } from 'recoil';

function App() {
  return (
    <RecoilRoot>
      <Router>
        <AppRoute />
      </Router>
    </RecoilRoot>
  );
}

export default App;
