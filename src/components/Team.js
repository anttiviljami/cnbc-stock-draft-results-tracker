import React, { Component } from 'react';

import PercentNumber from './PercentNumber'

export default class Team extends Component {
  render() {
    const { team, standing } = this.props;
    return (
      <article>
        <h2>#{standing}: { team.name }</h2>
        <header>
          <h3>
            <span>Total performance: </span><PercentNumber value={team.performance} /><br/>
            <span>Draft order: #{ team.order }</span>
          </h3>
        </header>
        <table>
          <thead>
            <tr>
              <th>Pick</th>
              <th>Company</th>
              <th>Symbol</th>
              <th>Start</th>
              <th>Current</th>
              <th>Performance</th>
            </tr>
          </thead>
          <tbody>
          { team.picks.map((pick, index) => 
            (<tr key={pick.symbol}>
              <td>#{ index + 1 }</td>
              <td>{ pick.company }</td>
              <td><a href={pick.link} target="_blank" rel="noopener noreferrer">{ pick.symbol }</a></td>
              <td>{ pick.start.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }</td>
              <td>{ pick.current.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }</td>
              <td><PercentNumber value={pick.performance} /></td>
            </tr>)
          )}
          </tbody>
        </table>
      </article>
    );
  }
}