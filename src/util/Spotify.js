const clientId = '3e955c730c754c148008574645441cb3';
const secret = '0d8efddbd5894a6d960530db76ae347b';
const redirectUri = "http://freejamming.surge.sh/";

let accessToken;
let expiryTime;
let userId;

export const Spotify = {

  getAccessToken() {
    if(accessToken) {
      return new Promise(resolve => resolve(accessToken));
    } else {
      let url = window.location.href;
      let regx = /access_token=([^&]*)/;
      let result = regx.exec(url);
      if(result === null) { // No access token
        // Authorize code
        window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=playlist-modify-public`;
        return new Promise(reject => console.log('No token'));
      } else {
        accessToken = result[1];
        console.log(accessToken);
        regx = /expires_in=([^&]*)/;
        result = regx.exec(url);
        expiryTime = result[1];

        //Set token expiry
        window.setTimeout(() => accessToken = '', expiryTime * 1000);
        window.history.pushState('Access Token', null, '/');
        return new Promise(resolve => resolve(accessToken));
      }
    }
  },

  getUserId() {
    if(userId) {
      return new Promise(resolve => resolve(userId));
    } else {
      return Spotify.getAccessToken().then(() => {
        return fetch(`https://api.spotify.com/v1/me`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }).then(response => response.json())
          .then(jsonResponse => {
            console.log(jsonResponse);
            userId = jsonResponse.id;
            console.log(userId);
            return userId;
          });
      });
    }
},

  createPlayList(playListName) {
    return Spotify.getUserId().then(() => {
        return fetch(`https://cors-anywhere.herokuapp.com/https://api.spotify.com/v1/users/${userId}/playlists`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            contentType: `application/json`
          },
          body: JSON.stringify({name: playListName})
        }

      ).then(response => response.json()).then(jsonResponse => {
        console.log(jsonResponse);
        return jsonResponse.id;
      });
    });
},

addTracksToPlayList(playListId, uriTracks) {
  console.log(JSON.stringify({uris: uriTracks}));
  return Spotify.getUserId().then(() => {
      return fetch(`https://cors-anywhere.herokuapp.com/https://api.spotify.com/v1/users/${userId}/playlists/${playListId}/tracks`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          contentType: `application/json`
        },
        body: JSON.stringify({uris: uriTracks})
      }

    ).then(response => response.json()).then(jsonResponse => {
      console.log(jsonResponse);
      return jsonResponse.snapshot_id;
    });
  });
},

  search(keyword) {
    console.log('keyword=' + keyword);
    return Spotify.getAccessToken().then(()=> {
      return fetch(`https://api.spotify.com/v1/search?type=TRACK&q=${keyword}`,
      {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
      }).then(response => response.json()).then(jsonResponse => {
        console.log(jsonResponse);
        if(jsonResponse.tracks.items) {
          return jsonResponse.tracks.items.map(item =>  {
            return {
            id: item.id,
            name: item.name,
            artist: item.artists[0].name,
            album: item.album.name,
            uri: item.uri
          }});
        }
      });
    });
  }
};
