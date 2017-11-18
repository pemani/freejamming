import React from 'react';
import './App.css';
import TrackResults from './components/TrackResults/TrackResults';
import SearchBar from './components/SearchBar/SearchBar';
import PlayList from './components/PlayList/PlayList';
import {Spotify} from './util/Spotify';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tracks: [],  // search results
      playListTracks: [],  // play list tracks
      playListIdMap: []   // Array of objects with playlist name and playlist id
    };

    this.searchTracks = this.searchTracks.bind(this);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.savePlayList = this.savePlayList.bind(this);
    this.addToPlayList = this.addToPlayList.bind(this);
  }

  searchTracks(keyword) {
    Spotify.search(keyword).then(tracks => {
      console.log(tracks);
      this.setState({
        tracks: tracks
      });
    });
  }

  // check if the track exists in the array of tracks
  checkTrackExists(tracks, trackItem) {
    return tracks.some(function(item) {
      return trackItem.id === item.id;
  });
  }

  addTrack(track) {
    if(!this.checkTrackExists(this.state.playListTracks, track)) {
      this.setState({
        playListTracks: this.state.playListTracks.concat(track)
      });
    }
  }

  removeTrack(track) {
    let index = this.state.playListTracks.indexOf(track);
    this.state.playListTracks.splice(index , 1);
    this.setState({
      playListTracks: this.state.playListTracks
    });
  }

  savePlayList(playListName) {
    if(this.state.playListTracks.length !== 0) {

      let playListTracks = this.state.playListTracks;
      this.setState({
        playListTracks: [] // Clear the tracks
      });
      // check playlist id exists
      let playListId;
      console.log(this.state.playListIdMap);
      let temp = this.state.playListIdMap.filter(item => item.name === playListName);

      if(temp.length > 0) { // if playlist already exists, add track to existing playlist
        playListId = temp[0].id;
        this.addToPlayList(playListId, playListTracks);
      } else {
        // Did not find such a playlist, create a new playList
        Spotify.createPlayList(playListName).then(id => {
          console.log('Playlist id' + id);
          let temp = {
            name: playListName,
            id: id
          }
          this.setState({
            playListIdMap: this.state.playListIdMap.concat(temp)
          });
          return id;
        }).then(id => this.addToPlayList(id, playListTracks));
      }

    }

  }

  addToPlayList(playListId, playListTracks){
    //Add tracks to playList
    let uriTracks = playListTracks.map(track => {
      return track.uri;
    });

    Spotify.addTracksToPlayList(playListId, uriTracks).then(snapshot=> {
      console.log('Snapshot' + snapshot);
      /*this.setState({
        playListTracks: [] // Clear the tracks
      });*/
    });
  }

  render() {
    return (
      <div className="App">
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <SearchBar searchTracks = {this.searchTracks}/>
        <div className = "App-playlist">
          <TrackResults tracks = {this.state.tracks} trackOp = {this.addTrack}/>
          <PlayList tracks = {this.state.playListTracks} trackOp = {this.removeTrack}
            saveList = {this.savePlayList}/>
        </div>
      </div>
    );
  }
}

export default App;
