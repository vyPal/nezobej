import React from 'react';
import { useParams } from 'react-router-dom';
import TopNavBar from './TopBar/TopNavBar'
import './Sbirka.css'
import { withNavigate } from './withNavigate';
import { withParams } from './withParams';
import api from './api';

import LockIcon from '@mui/icons-material/Lock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

let lekce = ["f, j, k, d", "g, h", "s, l", "a, ů", "Závěrečná lekce", "t, z", "r, u", "e, i", "q, w, o, p", "Závěrečná lekce", "v, m", "b, n", "c, čárka", "x, tečka", "y, spojník", "Závěrečná lekce", "ř, ž, ý", "č, á", "š, í", "ě, é", "y, ú", "ď, ť, ň, ó", "Závěrečná lekce", "Pravý shift", "Levý shift", "S diakritikou", "Otazník", "Výkřičník", "Pravý shift", "Levý shift", "Jednou řež", "Zpátky do školy"];
let pocetlekci = [6, 7, 7, 7, 7, 8, 9, 9, 11, 8];

class Sbirka extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            onKurz: parseInt(sessionStorage.getItem('onkurz')) || 0,
            on: parseInt(sessionStorage.getItem('onlekce')) || 0,
            loggedin: sessionStorage.getItem('loggedin') || false,
            prefs: sessionStorage.getItem('prefs') || {}
        }
        this.Lekce = this.Lekce.bind(this);
        this.BtnClick = this.BtnClick.bind(this);
        this.JmenoLekce = this.JmenoLekce.bind(this);
    }

    componentDidMount() {
        if(!this.state.loggedin) {
            api.getAccount().then(res => {
              this.setState({loggedin: true});
              sessionStorage.setItem('loggedin', true);
            }, err => {
              this.setState({loggedin: false});
              sessionStorage.setItem('loggedin', false);
            });
          }else {
            let prefs = {};
            api.getPrefs().then(res => {
              prefs = res;
            }, err => {
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
          }
    }

    BtnClick(addr) {
        this.props.navigate(""+addr);
    }

    Lekce(props) {
        let { id } = this.props.params;
        if(this.state.onKurz>id) {
            return(
                <li>
                    <h2>{props.text}</h2><CheckCircleIcon className="check" /><button className='check' onClick={() => {this.BtnClick(props.id)}}>OPAKOVAT</button>
                </li>
            )
        }
        if(this.state.on==props.id) {
            return(
                <li>
                    <h2>{props.text}</h2><PlayCircleIcon className="play" /><button className='play' onClick={() => {this.BtnClick(props.id)}}>ZAČÍT</button>
                </li>
            )
        }else if(this.state.on>props.id) {
            return(
                <li>
                    <h2>{props.text}</h2><CheckCircleIcon className="check" /><button className='check' onClick={() => {this.BtnClick(props.id)}}>OPAKOVAT</button>
                </li>
            )
        }else {
            return(
                <li>
                    <h2>{props.text}</h2><LockIcon className="lock" />
                </li>
            )
        }
    }

    JmenoLekce() {
        let { id } = this.props.params;
        if(lekce[id] == "Závěrečná lekce") {
            return (<p onClick={() => {this.BtnClick("/kurz")}}>Závěrečná lekce</p>);
        } else {
            return (<p onClick={() => {this.BtnClick("/kurz")}}>Lekce {lekce[id]}</p>);
        }
    }

    render() {
        setTimeout(() => {
            if(!this.state.loggedin) {
                this.props.navigate("/login?err=required");
                return (
                    <div>
                        <TopNavBar />
                    </div>
                );
            }
          }, 500);
        let { id } = this.props.params;
        return(
            <div>
                <TopNavBar />
                <h2 className='lekce-jmeno'><ArrowBackIcon onClick={() => {this.BtnClick("/kurz")}} /><this.JmenoLekce /></h2>
                <ul className="lekce">
                    {[...Array(pocetlekci[id])].map((e, i) => <this.Lekce id={i} key={i} text={"Lekce "+(i+1)}/>)}
                </ul>
            </div>
        )
    }
}

export default withNavigate(withParams(Sbirka));