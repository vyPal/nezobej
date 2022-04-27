import React from "react";
import { Link } from "react-router-dom";
import './TopNavBar.css';

import LockTwoToneIcon from '@mui/icons-material/LockTwoTone';
import Tooltip from '@mui/material/Tooltip';
import api from '../api';

class TopNavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedin: false
    }
    this.UserInfo = this.UserInfo.bind(this);
  }

  componentDidMount() {
    api.getAccount().then((res) => {
      this.setState({loggedin: true});
    }, (err) => {
      this.setState({loggedin: false});
    })
  }

  UserInfo() {
    if(!this.state.loggedin) {
      return(
        <li className="right">
          <Link to="/login" className="login">Přihlásit se</Link>
        </li>
      );
    } else {
      return(
        <li className="right">
          <img src={api.provider().avatars.getInitials()} /><Link to="/logout" className="logout">Odhlásit se</Link>
        </li>
      );
    }
  }

  render() {
    return (
      <div className="top-navbar">
        <ul>
            <li><Link to="/" className="nostyle"><h1 className="name">Ne<img className="logo" src="/logo64.png" alt="logo"/>obej</h1></Link></li>
            <li>
              <Link to="/kurz">Kurz</Link>
            </li>
            <li>
              <Tooltip title={<p style={{fontSize: 12}}>Omlouváme se, ale tato funkce je zatím pouze ve vývoji</p>}>
                <Link to="/">Trénink <LockTwoToneIcon sx={{fontSize: 16}}/></Link>
              </Tooltip>
            </li>
            <li>
              <Tooltip title={<p style={{fontSize: 12}}>Omlouváme se, ale tato funkce je zatím pouze ve vývoji</p>}>
                <Link to="/">Jak psát<LockTwoToneIcon sx={{fontSize: 16}}/></Link>
              </Tooltip>
            </li>
            <li>
              <Tooltip title={<p style={{fontSize: 12}}>Omlouváme se, ale tato funkce je zatím pouze ve vývoji</p>}>
                <Link to="/">Test psaní <LockTwoToneIcon sx={{fontSize: 16}}/></Link>
              </Tooltip>
            </li>
            <li>
              <Tooltip title={<p style={{fontSize: 12}}>Omlouváme se, ale tato funkce je zatím pouze ve vývoji</p>}>
                <Link to="/">Školy <LockTwoToneIcon sx={{fontSize: 16}}/></Link>
              </Tooltip>
            </li>
            <this.UserInfo />
        </ul>
      </div>
    );
  }
}

export default TopNavBar;