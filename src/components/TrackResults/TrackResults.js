import React from 'react';
import './TrackResults.css';
import TrackList from '../TrackList/TrackList';

class TrackResults extends React.Component {
  render() {
    return (
      <div className="SearchResults">
        <h2>Results</h2>
        <TrackList tracks = {this.props.tracks} colType = {'+'} trackOp = {this.props.trackOp}/>
      </div>
    );
  }
};

export default TrackResults;
