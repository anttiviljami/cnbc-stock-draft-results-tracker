import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

import Team from './components/Team';

import ReactGA from 'react-ga';

class App extends Component {
  constructor() {
    super();
    this.state = {
      stocks: [],
      teams: [],
    }
  }

  async componentDidMount() {
    const updateStocksAndTeams = (res) => {
      const { stocks, teams } = res.data;
      return this.setState({ stocks, teams });
    }
    const unableToFetchData = (err) => {
      console.error('Unable to fetch data', err);
    }
    await axios.get('/api/stale').then(updateStocksAndTeams).catch(unableToFetchData);
    await axios.get('/api').then(updateStocksAndTeams).catch(unableToFetchData);
  }

  render() {
    const { teams } = this.state;
    return (
      <section>
        <header>
          <figure>
            <h1><span role="img" aria-label="stock">📈</span> 2018 CNBC Stock Draft Live Results</h1>
            <blockquote>
              <strong>What is this?</strong> &mdash; This is a fan-made, non-official live tracker website for the CNBC 2018 Stock Draft.
              More info about the Stock Draft and participating teams available on the
              <a href="https://www.cnbc.com/video/2018/04/26/how-the-cnbc-stock-draft-works.html"
                target="_blank"
                rel="noopener noreferrer"> CNBC website</a>.
            </blockquote>
          </figure>
        </header>
        { teams.length > 0 ? 
          ( teams.map((team, index) => <Team key={team.name} team={team} standing={index + 1} />) ) : 
          (
          <article>
            <pre>Loading...</pre>
          </article>
          )}
        <footer>
          <blockquote>Standings are based on companies performance, not including dividends, from the stock's closing price on Apr. 26, 2018</blockquote>
          <p>
            <span>Stock data from <a href="https://www.alphavantage.co"
              target="_blank"
              rel="noopener noreferrer">Alpha Vantage API</a></span>
            <span style={{ float: 'right' }}>
              <a href="https://github.com/anttiviljami/cnbc-stock-draft-results-tracker"
                target="_blank"
                rel="noopener noreferrer">Project GitHub page</a>,
              Created by&nbsp;
              <a href="https://twitter.com/anttiviljami"
                target="_blank"
                rel="noopener noreferrer">@anttiviljami</a>
            </span>
          </p>
        </footer>
      </section>
    );
  }
}

ReactGA.initialize('UA-119562917-1');
ReactGA.pageview(window.location.pathname + window.location.search);

export default App;
