import React from 'react';
import { withNavigate } from './withNavigate';

import TopNavBar from './TopBar/TopNavBar';

import api from './api';

class Logout extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    api.deleteCurrentSession().then(() => {
      this.props.navigate("/");
    }, () => {
      this.props.navigate("/");
    });
  }

  render() {
    return (
      <div className='App'>
        <TopNavBar />
      </div>
    );
  }
}

export default withNavigate(Logout);