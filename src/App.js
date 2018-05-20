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
    try {
      const { data } = await axios.get('/api');
      const { stocks, teams } = data;
      this.setState({ stocks, teams });
    } catch (err) {
      console.warn('Unable to fetch data', err);
    }
  }

  render() {
    const { teams } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-titlePerformance">2018 CNBC Stock Draft Standings</h1>
          <p>Standings are based on companies performance, not including dividends, from the stock's closing price on Apr. 26, 2018</p>
        </header>
        { teams.length > 0 ? (
          <div className="teams">
            { 
              teams.map(team => <Team key={team.name} team={team} />)
            }
          </div>
        ) : (
          <pre>Loading...</pre>
        )}
      </div>
    );
  }
}

export default App;
