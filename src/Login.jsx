import React from 'react';
import './Login.css';
import { withNavigate } from './withNavigate';

import TopNavBar from './TopBar/TopNavBar';
import CircularProgress from '@mui/material/CircularProgress';
import CheckIcon from '@mui/icons-material/Check';
import { Link } from 'react-router-dom';

import api from './api';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      btnLoading: false,
      success: false
    };
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.login = this.login.bind(this);
    this.Buttons = this.Buttons.bind(this);
  }

  componentDidMount() {
    if(!this.state.success && !this.state.btnLoading) {
      api.getAccount().then(() => {
        this.setState({success: true});
        this.props.navigate('/kurz');
      });
    }
  }

  handleEmailChange(e) {
    this.setState({email: e.target.value});
  }

  handlePasswordChange(e) {
    this.setState({password: e.target.value});
  }

  login(e) {
    e.preventDefault();
    api.createSession(this.state.email, this.state.password).then(() => {
      this.props.navigate('/kurz');
      this.setState({btnLoading: false});
      this.setState({success: true});
    }, (err) => {
      if(err=='AppwriteException: Param "email" is not optional.') {
        alert('Prosím vyplňte pole email');
        this.setState({btnLoading: false});
      }
      else if(err =='AppwriteException: Invalid email: Value must be a valid email address') {
        alert('Prosím zadejte platnou emailovou adresu');
        this.setState({btnLoading: false});
      }
      else if(err=='AppwriteException: Param "password" is not optional.') {
        alert('Prosím zadejte heslo');
        this.setState({btnLoading: false});
      }
      else if(err=='AppwriteException: Invalid credentials') {
        alert('Email a heslo se neshodují');
        this.setState({btnLoading: false});
      }
    });
  }

  Buttons() {
    if(this.state.success) {
      return(<button className='loading'><CheckIcon size={20} /></button>);
    }else if(this.state.btnLoading) {
      return(<button className='loading'><CircularProgress size={20} /></button>);
    }else {
      return(<button type="sumbit" onClick={this.login}>Přihlásit se</button>);
    }
  }

  render() {
    return (
      <div className='App'>
        <TopNavBar />
        <div className="loginCont">
          <input type="email" placeholder='Email' value={this.state.email} onChange={this.handleEmailChange} />
          <input type="password" placeholder='Heslo' value={this.state.password} onChange={this.handlePasswordChange} />
          <this.Buttons />
          <p>Nemáte účet? <Link to="/register">Zaregistrujte se!</Link></p>
        </div>
      </div>
    );
  }
}

export default withNavigate(Login);
