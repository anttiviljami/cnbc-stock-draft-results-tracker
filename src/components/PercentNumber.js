import React, { Component } from 'react';

export default class PercentNUmber extends Component {
  render() {
    const { value } = this.props;
    const performancePercent = Math.abs((value * 100).toFixed(2));
    const sign = value > 0 ? '+' : '-';
    return (
      <span className={`number ${ value > 0 ? 'positive' : 'negative' }`}>
        {sign}{performancePercent}%
      </span>
    );
  }
}