import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

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
      background: { name: "acolyte", label: "Acolyte", textLabel: "an Acolyte" },
      subrace: {name: '', label: ''},
      charisma: {"name": "10", "label": "10", "modifier": 0},
      age: 20
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
          <h5>a D&amp;D backstory generator</h5>
          <div class="donate">
            <p>Like this app?</p>
            <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
              <input type="hidden" name="cmd" value="_donations" />
              <input type="hidden" name="business" value="97GPQ8JDZVZMJ" />
              <input type="hidden" name="currency_code" value="USD" />
              <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" />
              <img alt="" border="0" src="https://www.paypal.com/en_US/i/scr/pixel.gif" width="1" height="1" />
            </form>
          </div>
        </header>
        <CharacterForm 
          race={this.state.race}
          class={this.state.class}
          background={this.state.background}
          subrace={this.state.subrace}
          charisma={this.state.charisma}
          age={this.state.age}
          callback={this.charFormCallback}></CharacterForm>
          
        <Backstory
        race={this.state.race}
        class={this.state.class}
        background={this.state.background}
        charisma={this.state.charisma}
        age={this.state.age}></Backstory>

        <Navbar fixed="bottom" bg="dark" variant='dark'>
          <Container>
            <Row>
            <Navbar.Brand><a href="https://github.com/LeeMcKusick/origen">View on Github</a></Navbar.Brand>
            </Row>  
            <Row>
            <Navbar.Brand>Made by Lee Skellington-McKusick</Navbar.Brand>
            </Row>
          </Container>
        </Navbar>
      </div>
    );
  }
}

export default App;
