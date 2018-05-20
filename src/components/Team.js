import React, { Component } from 'react';

export default class Team extends Component {
  render() {
    const { team } = this.props;
    return (
      <div className="team">
        <h2>{ team.name }</h2>
        <p>Performance: { team.performance }</p>
        { team.picks.map(pick => 
          (<pre key={pick.symbol}>
            { JSON.stringify(pick, null, 2) }
          </pre>)
        )}
      </div>
    );
  }
}