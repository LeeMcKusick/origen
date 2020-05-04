import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import logo from '../logo.svg';
import '../styles/App.css';
import Backstory from './Backstory';
import CharacterForm from './CharacterForm.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      race: {name: "human", label: "Human"},
      class: { name: "barbarian", label: "Barbarian" },
      background: { name: "acolyte", label: "Acolyte"},
      subrace: {name: '', label: ''},
      charisma: {"name": "10", "label": "10", "modifier": 0}
    };
  }

  charFormCallback = (name, data) => {
    this.setState({
      [name]: data
    });
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Origen</h1>
        </header>
        <CharacterForm 
          race={this.state.race}
          class={this.state.class}
          background={this.state.background}
          subrace={this.state.subrace}
          callback={this.charFormCallback}></CharacterForm>
          
        <Backstory
        race={this.state.race}
        charisma={this.state.charisma}></Backstory>
      </div>
    );
  }
}

export default App;
