import React from 'react';
import './Track.css';

class Track extends React.Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    let track = {
      id: this.props.track.id,
      name: this.props.track.name,
      artist: this.props.track.artist,
      album: this.props.track.album,
      uri: this.props.track.uri
    };
    this.props.trackOp(track);
    event.preventDefault();
  }

  render() {
    return (
      <div className="Track">
        <div className="Track-information">
          <h3>{this.props.track.name}</h3>
          <p>{this.props.track.artist} | {this.props.track.album}</p>
        </div>
        <a className="Track-action" onClick = {this.handleClick}>{this.props.colType}</a>
      </div>
    );
  }
}

export default Track;
