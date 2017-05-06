// Generic Holder Class for Album and Artist and Track
function AlbumArtistHolder(dataObject) {
    this.image = dataObject.image;

    this.artistName = dataObject.artist_name;
    this.albumName = dataObject.album_name ? dataObject.album_name : null;
    this.trackName = dataObject.track_name ? dataObject.track_name : null;
}

function LoggedUser(userObject) {
    this.userName = utitlity.stringToTitleCase(userObject.user_name);
}