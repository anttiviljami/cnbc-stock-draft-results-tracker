import React, { Component } from 'react';

export default class Team extends Component {
  renderPercentage(percentage) {
    const performancePercent = Math.abs((percentage * 100).toFixed(2));
    const sign = percentage > 0 ? '+' : '-';
    return `${sign}${performancePercent}%`;
  }

  render() {
    const { team } = this.props;
    const renderPercentage = this.renderPercentage;
    return (
      <div className="team">
        <h2>{ team.name }</h2>
        <p className="performance">
          <span className={`number ${team.performance > 0 ? 'positive' : 'negative'}`}>
            { renderPercentage(team.performance) }
          </span>
        </p>
        <ul>
        { team.picks.map(pick => 
          (<li key={pick.symbol}>
            <span>{`${ pick.company } (${ pick.symbol })`}</span>
            <span className={`number ${pick.performance > 0 ? 'positive' : 'negative'}`}>
              { renderPercentage(pick.performance) }
            </span>
          </li>)
        )}
        </ul>
      </div>
    );
  }
}