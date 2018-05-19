import React, { Component } from 'react';

export default class Team extends Component {
  render() {
    const { team } = this.props;
    return (
      <div className="team">
        <h2>{ team.title }</h2>
      </div>
    );
  }
}