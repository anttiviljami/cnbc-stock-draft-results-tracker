import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

import Team from './components/Team';

class App extends Component {
  constructor() {
    super();
    this.state = {
      stocks: [],
      teams: [],
    }
  }

  async componentDidMount() {
    const { data } = await axios.get('/api');
    const { stocks, teams } = data;
    this.setState({ stocks, teams });
  }

  render() {
    const { teams } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">2018 Stock Draft Standings</h1>
        </header>
        <div className="teams">
          { 
            teams.map(team => <Team key={team.name} team={team} />)
          }
        </div>
      </div>
    );
  }
}

export default App;
