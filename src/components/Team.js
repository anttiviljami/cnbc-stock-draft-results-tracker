import React, { Component } from 'react';

export default class Team extends Component {
  render() {
    const { team } = this.props;
    return (
      <div className="team">
        <h2>{ team.name }</h2>
        { team.picks.map(pick => 
          (<pre key={pick.ticker}>
            { JSON.stringify(pick, null, 2) }
          </pre>)
        )}
      </div>
    );
  }
}