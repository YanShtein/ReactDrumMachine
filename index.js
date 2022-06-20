import { render } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import './index.css';

const bankArr = [
  {
    keytrigger: 'Q',
    padid: 'Heater-1',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3'
  },
  {
    keytrigger: 'W',
    padid: 'Heater-2',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3'
  },
  {
    keytrigger: 'E',
    padid: 'Heater-3',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3'
  },
  {
    keytrigger: 'A',
    padid: 'Clap',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3'
  },
  {
    keytrigger: 'S',
    padid: 'Snare',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3'
  },
  {
    keytrigger: 'D',
    padid: 'Open-Hat',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3'
  },
  {
    keytrigger: 'Z',
    padid: 'Beat',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3'
  },
  {
    keytrigger: 'X',
    padid: 'Closed-Hat',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3'
  },
  {
    keytrigger: 'C',
    padid: 'Kick',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3'
  }
];

class Referencer extends React.Component {
  constructor(props) {
    super(props);

    this.playSound = this.playSound.bind(this);
  };

  playSound() {
    // in console.log(Promise {<pending>} -> than -> [[PromiseState]]: "fulfilled")
    if (this.props.power) {
      const sound = document.getElementById(this.props.KeyTrigger);
      sound.play();
      this.props.updateDisplayName(this.props.PadId);
    };
  };

  render() {
      return (
        <div 
          className='drum-pad'
          id={this.props.PadId} 
          onClick={this.playSound}>
          <small><b>{this.props.KeyTrigger}</b> {this.props.PadId}</small>
          <audio 
            src={this.props.Url} 
            className='clip' 
            id={this.props.KeyTrigger}></audio>
        </div>
      );
  };
};

class PadBank extends React.Component {
  render() {
    let padBank = this.props.currentBank.map(item => {
      return (
        <Referencer 
          key={item.padid} 
          Url={item.url} PadId={item.padid} 
          KeyTrigger={item.keytrigger} 
          updateDisplayName={this.props.updateDisplayName}
          power={this.props.power}/>
        );
      });
    return (
      <div className='pad-bank'>{padBank}</div>
    );
  };
};

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      power: true,
      currentBank: bankArr,
      padName: 'Select Pad',
      // HTMLMediaElement.volume -> the volume value should be between 
      // 0 muted up to 1 the loudest. need to match with float like 0.8
      vol: 0.8,
    }

    this.DisplayName = this.DisplayName.bind(this);
    this.PowerControl = this.PowerControl.bind(this);
    this.changeVolume = this.changeVolume.bind(this);
  }

  PowerControl() {
    this.setState({
      power: !this.state.power,
      padName: '',
    });
  };

  DisplayName(name) {
    if (this.state.power) {
      this.setState({
        padName: name.replace(/-/g, ' ')
      });
    }
  };

  changeVolume(event) {
    if (this.state.power) {
      this.setState({
        vol: event.target.value,
      });
    };
  };

  render() {
    // https://stackoverflow.com/questions/7056925/how-does-array-prototype-slice-call-work
    let urls = [].slice.call(document.getElementsByClassName('clip'));
    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/volume
    // HTMLMediaElement.volume -> the volume value should be between 
    // 0 muted up to 1 the loudest. need to match with float like 0.8
      urls.forEach(i => {
      i.volume = this.state.vol
    });
    return (
      <div className='container' id="drum-machine">
        <div className='drum-container'>
          <div className='logo'>
            YDRUM▶
          </div>
          <div className='volume' id='volume'>
            <input 
              type='range' 
              value={this.state.vol}
              min='0' max='1' step='0.01'
              onChange={this.changeVolume}>
            </input>
          </div>
          <div className='display' id="display">
            <div className='inner-display'>
              <small className='vol'>{Math.round(this.state.vol * 100) + '%'}</small>
              <small className='name'>{this.state.padName}</small>
            </div>
          </div>
          <div className='power' id='power' onClick={this.PowerControl}>
            <div className={this.state.power ? 'on' : 'off'}> ⏻
            </div>
          </div>
          {/* currentBack needs to be refernced from <*PadBank* let padBank = this.props.currentBank>  */}
          <PadBank 
            currentBank={this.state.currentBank} 
            updateDisplayName={this.DisplayName}
            power={this.state.power}
            volume={this.state.vol}
          />
        </div>
      </div>
    );
  };
};


ReactDOM.createRoot(document.getElementById('root')).render(<App />);
// ReactDOM.render(<App />, document.getElementById('root'));