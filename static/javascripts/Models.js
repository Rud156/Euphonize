var modelUtility = new UtilityFunctions();

// Generic Holder Class for Album and Artist and Track
function AlbumArtistHolder(dataObject) {
    this.image = dataObject.image;

    this.artistName = dataObject.artist_name;
    this.albumName = dataObject.album_name ? dataObject.album_name : null;
    this.trackName = dataObject.track_name ? dataObject.track_name : null;
}

function LoggedUser(userObject) {
    this.userName = modelUtility.stringToTitleCase(userObject.user_name);
}

function PageAlbumArtistHolder(dataObject) {
    this.summary = dataObject.summary;
    this.image = dataObject.image;

    this.albumName = dataObject.album_name ? dataObject.album_name : null;
    this.artistName = dataObject.artist_name;

    this.tracks = dataObject.tracks ? dataObject.tracks : null;
    this.similarArtists = dataObject.similar_artists ? dataObject.similar_artists : null;

}