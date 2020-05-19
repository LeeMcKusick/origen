import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Backstory from './Backstory';
import CharacterForm from './CharacterForm.js';

import logo from '../logo.svg';
import '../styles/App.css';

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
              <Navbar.Brand>Made by Lee Skellington-McKusick &nbsp; <a href='https://ko-fi.com/B0B31QB1X' target='_blank'><img height='36' style={{border: '0px', height:'36px'}} src='https://cdn.ko-fi.com/cdn/kofi3.png?v=2' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a></Navbar.Brand>
            </Row>
          </Container>
        </Navbar>
      </div>
    );
  }
}

export default App;
