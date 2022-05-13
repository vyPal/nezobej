import React from 'react';
import TopNavBar from './TopBar/TopNavBar';
import './Lekce.css';
import { withNavigate } from './withNavigate';
import { withParams } from './withParams';
import { Sparkline } from 'react-chartlet';
import api from './api';

import LockIcon from '@mui/icons-material/Lock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import LinearProgress from '@mui/material/LinearProgress';

let pocetlekci = [6, 7, 7, 7, 7, 8, 9, 9, 11, 8];

class Kurz extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      on: parseInt(sessionStorage.getItem('onlekce')) || 0,
      onKurz: parseInt(sessionStorage.getItem('onkurz')) || 0,
      onChar: 0,
      loggedin: sessionStorage.getItem('loggedin') || false,
      prefs: sessionStorage.getItem('prefs') || {},
      text: '',
      mistakes: 0,
      wrong: [],
      started: 0,
      lastat: 0,
      speeds: [],
      done: false,
      end: 0
    };
    this.Lekce = this.Lekce.bind(this);
    this.Letter = this.Letter.bind(this);
    this.BtnClick = this.BtnClick.bind(this);
    this.RenderText = this.RenderText.bind(this);
    this.handleKey = this.handleKey.bind(this);
    this.RenderStats = this.RenderStats.bind(this);
  }

  componentDidMount() {
    if(!this.state.loggedin) {
      api.getAccount().then(() => {
        this.setState({loggedin: true});
        sessionStorage.setItem('loggedin', true);
      }, () => {
        this.setState({loggedin: false});
        sessionStorage.setItem('loggedin', false);
      });
    }else {
      let prefs = {};
      api.getPrefs().then(res => {
        prefs = res;
      }, () => {
        prefs = {};
      }).then(() => {
        if(prefs != this.state.prefs) {
          this.setState({prefs: prefs});
          sessionStorage.setItem('prefs', JSON.stringify(prefs));
        }
        if(this.state.on == 0 && prefs.onLekce) {
          this.setState({on: prefs.onLekce});
          sessionStorage.setItem('onlekce', prefs.onLekce);
        }
        if(this.state.onKurz == 0 && prefs.onKurz) {
          this.setState({onKurz: prefs.onKurz});
          sessionStorage.setItem('onkurz', prefs.onKurz);
        }
      });
      let { id, idlekce } = this.props.params;
      api.provider().database.getDocument('kurz-'+id, 'lekce-'+idlekce).then((res) => {
        this.setState({text: res.text, onChar: 0, mistakes: 0, wrong: []});
      }, () => {
        this.props.navigate('/kurz/'+id);
      });
    }
    /*
      api.getAccount().then((res) => {
        this.setState({loggedin: true});
        api.getPrefs().then((res) => {
          console.log(res);
            this.setState({prefs: res});
            if(res.onKurz) {
              this.setState({onKurz: res.onKurz});
            }else {
              let prefs = this.state.prefs;
              prefs.onKurz = 0;
              api.updatePrefs(prefs);
            }
            if(res.onLekce) {
                this.setState({on: res.onLekce});
            }else {
              let prefs = this.state.prefs;
              prefs.onLekce = 0;
              api.updatePrefs(prefs);
            }
            let { id, idlekce } = this.props.params;
            api.provider().database.getDocument('kurz-'+id, 'lekce-'+idlekce).then((res) => {
              this.setState({text: res.text, onChar: 0, mistakes: 0, wrong: []});
            }, (err) => {
              this.props.navigate('/kurz')
            });
            console.log(this.state.prefs)
        }, (err) => {
            console.log("Error getting user preferences: "+err);
        });
      }, (err) => {
        this.setState({loggedin: false});
      })
      */
    window.addEventListener('keypress', this.handleKey);
  }

  componentWillUnmount() {
    window.removeEventListener('keypress', this.handleKey);
  }

  BtnClick(addr) {
    this.props.navigate('/kurz/'+addr);
  }

  Lekce(props) {
    if(this.state.on==props.id) {
      return(
        <li>
          <PlayCircleIcon className="play" /><h2>{props.text}</h2><button className='play' onClick={() => {this.BtnClick(props.id);}}>ZAČÍT</button>
        </li>
      );
    }else if(this.state.on>props.id) {
      return(
        <li>
          <CheckCircleIcon className="check" /><h2>{props.text}</h2><button className='check' onClick={() => {this.BtnClick(props.id);}}>OPAKOVAT</button>
        </li>
      );
    }else {
      return(
        <li>
          <LockIcon className="lock" /><h2>{props.text}</h2>
        </li>
      );
    }
  }

  handleKey(event) {
    if(this.state.started == 0) {
      this.setState({started: Date.now()});
      this.setState({lastat: this.state.started});
    }
    if(event.key === this.state.text[this.state.onChar]) {
      if(this.state.lastat == 0) {
        this.setState({lastat: Date.now()});
      } else {
        let now = Date.now();
        let speeds = this.state.speeds;
        console.log(now);
        console.log(this.state.lastat);
        console.log(now-this.state.lastat);
        speeds.push(now-this.state.lastat);
        this.setState({speeds: speeds});
        this.setState({lastat: now});
      }

      this.setState({onChar: this.state.onChar+1});
      if(this.state.onChar == this.state.text.length-1) {

        let end = Date.now();
        this.setState({end: end});
        console.log('Started: '+this.state.started);
        console.log('Ended: '+end);
        console.log('Time in s: '+Math.floor((end-this.state.started)/1000));
        console.log(this.state.text.length);
        console.log('CPM: '+Math.floor(this.state.text.length/(((end-this.state.started)/1000)/60)));

        let { id, idlekce } = this.props.params;
        console.log(this.state.prefs.onLekce);
        console.log(idlekce);
        if(this.state.prefs.onLekce == idlekce) {
          if(this.state.prefs.onKurz == id && this.state.prefs.onLekce >= pocetlekci[id]-1) {
            let prefs = this.state.prefs;
            prefs.onLekce = 0;
            prefs.onKurz = this.state.onKurz+1;
            console.log('1');
            console.log(prefs);
            api.updatePrefs(prefs).then(res => {
              console.log(res);
            }, err => console.log(err));
            this.setState({on: 0, onKurz: this.state.onKurz+1});
            sessionStorage.setItem('onlekce', 0);
            sessionStorage.setItem('onkurz', this.state.onKurz);
          }else {
            let prefs = this.state.prefs;
            prefs.onLekce = this.state.on+1;
            console.log('2');
            console.log(prefs);
            api.updatePrefs(prefs).then(res => {
              console.log(res);
            }, err => console.log(err));
            this.setState({on: this.state.on+1});
            console.log(prefs.onLekce);
            sessionStorage.setItem('onlekce', prefs.onLekce);
          }
        }
        /*
        setTimeout(() => {
          this.props.navigate('/kurz/'+id);
        }, 2000);
        */
        this.setState({done: true});
      }
    }else {
      if(this.state.wrong.indexOf(this.state.onChar) == -1) {
        this.setState({wrong: this.state.wrong.concat(this.state.onChar), mistakes: this.state.mistakes+1});
      }
    }
  }

  Letter(props) {
    if(this.state.onChar == props.id) {
      if(this.state.wrong.indexOf(props.id) == -1) {
        if(props.letter == ' ') {
          return(<p className="typing space">{props.letter}</p>);
        }else {
          return(<p className="typing">{props.letter}</p>);
        }
      }else {
        if(props.letter == ' ') {
          return(<p className="typing-wrong space">{props.letter}</p>);
        }else {
          return(<p className="typing-wrong">{props.letter}</p>);
        }
      }
    }else if(this.state.onChar > props.id) {
      if(this.state.wrong.indexOf(props.id) == -1) {
        if(props.letter == ' ') {
          return(<p className="typed space">{props.letter}</p>);
        }else {
          return(<p className="typed">{props.letter}</p>);
        }
      }else {
        if(props.letter == ' ') {
          return(<p className="typed-wrong space">{props.letter}</p>);
        }else {
          return(<p className="typed-wrong">{props.letter}</p>);
        }
      }
    }else {
      if(props.letter == ' ') {
        return(<p className="nottyped space">{props.letter}</p>);
      }else {
        return(<p className="nottyped">{props.letter}</p>);
      }
    }
  }

  RenderText() {
    let progress = this.state.onChar/this.state.text.length*100;
    return (
      <div className="text-area" onKeyPress={this.handleKey}>
        <LinearProgress variant="determinate" value={progress}/>
        {this.state.text.split('').map((val, index) => <this.Letter id={index} letter={val} key={index} />)}
      </div>
    );
  }

  RenderStats() {
    console.log(JSON.stringify(this.state.speeds))
    return (
      <div className="stats">
        <h4>Rychlost CPM: {Math.floor(this.state.text.length/(((this.state.end-this.state.started)/1000)/60))}</h4>
        <h4>Rychlost WPM: {Math.floor(this.state.text.split(' ').length/(((this.state.end-this.state.started)/1000)/60))}</h4>
        <h3>Graf rychlosti:</h3>
        <Sparkline
          data={this.state.speeds}
          height="100px"
          width="730px"
        />
      </div>
    );
  }

  render() {
    setTimeout(() => {
      if(!this.state.loggedin) {
        this.props.navigate('/login?err=required');
        return (
          <div>
            <TopNavBar />
          </div>
        );
      }
    }, 500);
    return(
      <div>
        <TopNavBar />
        <this.RenderText />
        {this.state.done && <this.RenderStats />}
      </div>
    );
  }
}

export default withNavigate(withParams(Kurz));

const round10 = (value, exp) => decimalAdjust('round', value, exp);

function decimalAdjust(type, value, exp) {
  // If the exp is undefined or zero...
  if (typeof exp === 'undefined' || +exp === 0) {
    return Math[type](value);
  }
  value = +value;
  exp = +exp;
  // If the value is not a number or the exp is not an integer...
  if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
    return NaN;
  }
  // Shift
  value = value.toString().split('e');
  value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
  // Shift back
  value = value.toString().split('e');
  return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
}