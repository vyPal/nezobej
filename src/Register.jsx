import React from 'react';
import './Register.css';
import { Link } from 'react-router-dom';

import TopNavBar from './TopBar/TopNavBar';
import CircularProgress from '@mui/material/CircularProgress';
import CheckIcon from '@mui/icons-material/Check';

import api from './api';

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      name: '',
      btnLoading: false,
      success: false
    };
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.register = this.register.bind(this);
    this.Buttons = this.Buttons.bind(this);
  }

  handleEmailChange(e) {
    this.setState({email: e.target.value});
  }

  handlePasswordChange(e) {
    this.setState({password: e.target.value});
  }

  handleNameChange(e) {
    this.setState({name: e.target.value});
  }

  register(e) {
    e.preventDefault();
    this.setState({btnLoading: true});
    api.createAccount(this.state.email, this.state.password, this.state.name).then(() => {
      this.setState({btnLoading: false});
      this.setState({success: true});
      api.provider().account.createVerification('http://192.168.1.164:3000/verifytest').then((res) => {
        console.log(res);
      }, (err) => {
        console.log(err);
      });
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
      else if(err.includes('Password must be at least 8 characters')) {
        alert('Heslo musí mít minimálně 8 znaků');
      }
      else {
        console.log(err);
      }
    });
  }

  Buttons() {
    if(this.state.success) {
      return(<button className='loading'><CheckIcon size={20} /></button>);
    }else if(this.state.btnLoading) {
      return(<button className='loading'><CircularProgress size={20} /></button>);
    }else {
      return(<button type="sumbit" onClick={this.register}>Zaregistrovat se</button>);
    }
  }

  render() {
    return (
      <div className='App'>
        <TopNavBar />
        <div className="registerCont">
          <input type="text" placeholder='Uživatelské jméno' value={this.state.name} onChange={this.handleNameChange} />
          <input type="email" placeholder='Email' value={this.state.email} onChange={this.handleEmailChange} />
          <input type="password" placeholder='Heslo' value={this.state.password} onChange={this.handlePasswordChange} />
          <this.Buttons />
          <p>Již máte účet? <Link to="/login">Přihlašte se!</Link></p>
        </div>
      </div>
    );
  }
}

export default Register;
