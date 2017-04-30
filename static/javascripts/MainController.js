/// <reference path="./../JS/knockoutJS.d.ts" />
/// <reference path="./../JS/jquery.d.ts" />
/// <reference path="./../JS/SammyJS.d.ts" />


// Generic Holder Class for Album and Artist
function AlbumArtistHolder(dataObject) {
    this.image = dataObject.image;
    this.artistName = dataObject.artist_name;
    this.albumName = dataObject.album_name ? dataObject.album_name : null;
}


function mainController() {
    // TODO: Implement this here...
}

ko.applyBindings(new mainController());