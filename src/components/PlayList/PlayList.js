import React from 'react';
import './PlayList.css';
import TrackList from '../TrackList/TrackList';

class PlayList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: 'New Playlist'
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSaveList = this.handleSaveList.bind(this);
  }

  handleChange(e) {
    this.setState({
      value: e.target.value
    })
  }

  handleSaveList(e) {
    if(this.state.value)
      this.props.saveList(this.state.value);
    e.preventDefault();
  }

  render() {
    return (
      <div className="Playlist">
        <input type = "text" value={this.state.value} onChange = {this.handleChange} />
        <TrackList tracks = {this.props.tracks} colType = {'-'} trackOp = {this.props.trackOp}/>
        <a className="Playlist-save" onClick = {this.handleSaveList}>SAVE TO SPOTIFY</a>
      </div>
    );
  }
};

export default PlayList;
