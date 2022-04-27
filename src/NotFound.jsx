import React from 'react';
import './App.css';

import TopNavBar from './TopBar/TopNavBar';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  render() {
    return (
      <div className='App'>
        <TopNavBar />
        <div>
          <h1 className='msg404'>Omlouváme se, ale tahle stránka nebyla nalezena</h1>
        </div>
      </div>
    );
  }
}

export default App;
