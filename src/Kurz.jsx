import React from 'react';
import TopNavBar from './TopBar/TopNavBar';
import './Kurz.css';
import { withNavigate } from './withNavigate';
import api from './api';

import LockIcon from '@mui/icons-material/Lock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';

let stred = ['f, j, k, d', 'g, h', 's, l', 'a, ů', 'Závěrečná lekce'];
let horni = ['t, z', 'r, u', 'e, i', 'q, w, o, p', 'Závěrečná lekce'];
let spodni = ['v, m', 'b, n', 'c, čárka', 'x, tečka', 'y, spojník', 'Závěrečná lekce'];
let diakritika = ['ř, ž, ý', 'č, á', 'š, í', 'ě, é', 'y, ú', 'ď, ť, ň, ó', 'Závěrečná lekce'];
let velkapismena = ['Pravý shift', 'Levý shift', 'S diakritikou'];
let interpunkce = ['Otazník', 'Výkřičník'];
let cisla = ['Pravý shift', 'Levý shift'];
let rozlouceni = ['Jednou řež', 'Zpátky do školy'];

class Kurz extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      on: parseInt(sessionStorage.getItem('onkurz')) || 0,
      loggedin: sessionStorage.getItem('loggedin') || false,
      prefs: sessionStorage.getItem('prefs') || {}
    };
    this.Lekce = this.Lekce.bind(this);
    this.BtnClick = this.BtnClick.bind(this);
  }

  componentDidMount() {
    if(!this.state.loggedin) {
      api.getAccount().then(() => {
        this.setState({loggedin: true});
        sessionStorage.setItem('loggedin', true);
        let prefs = {};
        api.getPrefs().then(res => {
          prefs = res;
          if(!prefs.onKurz) {
            prefs.onKurz = 0;
          }
          if(!prefs.onLekce) {
            prefs.onLekce = 0;
          }
          api.updatePrefs(prefs);
        }, () => {
          if(!prefs.onKurz) {
            prefs.onKurz = 0;
          }
          if(!prefs.onLekce) {
            prefs.onLekce = 0;
          }
          api.updatePrefs(prefs);
        }).then(() => {
          if(prefs == {}) {
            prefs = {onKurz: 0, onLekce: 0};
          }
          console.log(prefs);
          if(prefs != this.state.prefs) {
            this.setState({prefs: prefs});
            sessionStorage.setItem('prefs', JSON.stringify(prefs));
          }
          if(this.state.onKurz == 0 && prefs.onKurz) {
            this.setState({onKurz: prefs.onKurz});
            sessionStorage.setItem('onkurz', prefs.onKurz);
          }
        });
      }, () => {
        this.setState({loggedin: false});
        sessionStorage.setItem('loggedin', false);
      });
    }else {
      let prefs = {};
      api.getPrefs().then(res => {
        prefs = res;
        if(!prefs.onKurz) {
          prefs.onKurz = 0;
        }
        if(!prefs.onLekce) {
          prefs.onLekce = 0;
        }
        api.updatePrefs(prefs);
      }, () => {
        if(!prefs.onKurz) {
          prefs.onKurz = 0;
        }
        if(!prefs.onLekce) {
          prefs.onLekce = 0;
        }
        api.updatePrefs(prefs);
      }).then(() => {
        if(prefs == {}) {
          prefs = {onKurz: 0, onLekce: 0};
        }
        console.log(prefs);
        if(prefs != this.state.prefs) {
          this.setState({prefs: prefs});
          sessionStorage.setItem('prefs', JSON.stringify(prefs));
        }
        if(this.state.onKurz == 0 && prefs.onKurz) {
          this.setState({onKurz: prefs.onKurz});
          sessionStorage.setItem('onkurz', prefs.onKurz);
        }
      });
    }
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

  render() {
    if(!this.state.loggedin) {
      this.props.navigate('/login?err=required');
      return (
        <div>
          <TopNavBar />
        </div>
      );
    }
    return(
      <div>
        <TopNavBar />
        <ul className="kurz-stats">
          <li>
            <h3>Dokončeno</h3>
            <h1>0 %</h1>
            <h4>Můžeme začít?</h4>
          </li>
          <li>
            <h3>Rychlost</h3>
            <h1>0 CPM</h1>
            <h4>Na kolik to tak vidíš?</h4>
          </li>
          <li>
            <h3>Přesnost</h3>
            <h1>0 %</h1>
            <h4>Dáš to bez chyby?</h4>
          </li>
        </ul>
        <ul className="rady">
          <li>
            <h1>Střední řada</h1>
            <ul className="rada-stred">
              {stred.map((val, index) => <this.Lekce id={index} text={val} key={index} />)}
            </ul>
          </li>
          <li>
            <h1>Horní řada</h1>
            <ul className="rada-stred">
              {horni.map((val, index) => <this.Lekce id={index+stred.length} text={val} key={index} />)}
            </ul>
          </li>
          <li>
            <h1>Spodní řada</h1>
            <ul className="rada-stred">
              {spodni.map((val, index) => <this.Lekce id={index+stred.length+horni.length} text={val} key={index} />)}
            </ul>
          </li>
          <li>
            <h1>Diakritika</h1>
            <ul className="rada-stred">
              {diakritika.map((val, index) => <this.Lekce id={index+stred.length+horni.length+spodni.length} text={val} key={index} />)}
            </ul>
          </li>
          <li>
            <h1>Velká písmena</h1>
            <ul className="rada-stred">
              {velkapismena.map((val, index) => <this.Lekce id={index+stred.length+horni.length+spodni.length+diakritika.length} text={val} key={index} />)}
            </ul>
          </li>
          <li>
            <h1>Interpunkce</h1>
            <ul className="rada-stred">
              {interpunkce.map((val, index) => <this.Lekce id={index+stred.length+horni.length+spodni.length+diakritika.length+velkapismena.length} text={val} key={index} />)}
            </ul>
          </li>
          <li>
            <h1>Čísla</h1>
            <ul className="rada-stred">
              {cisla.map((val, index) => <this.Lekce id={index+stred.length+horni.length+spodni.length+diakritika.length+velkapismena.length+interpunkce.length} text={val} key={index} />)}
            </ul>
          </li>
          <li>
            <h1>Závěrečné rozloučení</h1>
            <ul className="rada-stred">
              {rozlouceni.map((val, index) => <this.Lekce id={index+stred.length+horni.length+spodni.length+diakritika.length+velkapismena.length+interpunkce.length+cisla.length} text={val} key={index} />)}
            </ul>
          </li>
        </ul>
      </div>
    );
  }
}

export default withNavigate(Kurz);