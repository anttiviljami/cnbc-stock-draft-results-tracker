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
      <section>
        <header>
          <figure>
            <h1>2018 CNBC Stock Draft Standings</h1>
          </figure>
          <blockquote>Standings are based on companies performance, not including dividends, from the stock's closing price on Apr. 26, 2018</blockquote>
        </header>
        { teams.length > 0 ? 
          ( teams.map((team, index) => <Team key={team.name} team={team} standing={index + 1} />) ) : 
          (
          <article>
            <pre>Loading...</pre>
          </article>
          )}
      </section>
    );
  }
}

export default App;
