import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      keyword: ''
    };

    this.handleTrackChange = this.handleTrackChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  handleTrackChange(event) {
    this.setState ({
      keyword: event.target.value
    });
  }

  handleSearch(event) {
    if(this.state.keyword)
      this.props.searchTracks(this.state.keyword);
    event.preventDefault();
  }

  render() {
    return (
      <div className="SearchBar">
          <input placeholder="Enter A Song Title" onChange = {this.handleTrackChange} />
          <a onClick = {this.handleSearch}>SEARCH</a>
      </div>
    );
  }
}

export default SearchBar;
