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
      </div>
    );
  }
}

export default App;
