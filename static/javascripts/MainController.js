/// <reference path='./../JS/knockoutJS.d.ts' />
/// <reference path='./../JS/jquery.d.ts' />
/// <reference path='./../JS/SammyJS.d.ts' />


// Generic Holder Class for Album and Artist
function AlbumArtistHolder(dataObject) {
    this.image = dataObject.image;
    this.artistName = dataObject.artist_name;
    this.albumName = dataObject.album_name ? dataObject.album_name : null;
}


function mainController() {
    var self = this;

    self.topArtists = ko.observableArray();
    self.topAlbums = ko.observableArray();

    self.getTopArtists = function () {
        var randomNumber = Math.round(Math.random());
        var url = randomNumber === 0 ? '/top_artists?type=user_cu' : '/top_artists?type=chart';
        $.ajax({
            dataType: 'json',
            url: url,
            success: function (data) {
                if (data.success) {
                    self.topArtists.removeAll();
                    var artistArray = [];
                    data.artists = data.artists.splice(0, 10);
                    data.artists.forEach(function (element) {
                        artistArray.push(new AlbumArtistHolder(element));
                    });
                    self.topArtists(artistArray);
                }
                else
                    window.alert(data.message);
            },
            error: function (error) {
                console.log(error);
                window.alert('Error Occurred');
            }
        });
    };

    self.getTopAlbums = function () {
        $.ajax({
            dataType: 'json',
            url: 'top_albums',
            success: function (data) {
                if (data.success) {
                    self.topAlbums.removeAll();
                    var albumArray = [];
                    data.albums = data.albums.splice(0, 10);

                    data.albums.forEach(function (element) {
                        albumArray.push(new AlbumArtistHolder(element));
                    });
                    self.topAlbums(albumArray);
                }
                else
                    window.alert(data.message);
            },
            error: function (error) {
                console.log(error);
                window.alert('Error Occurred');
            }
        });
    };

    self.topEmergingTracks = function () {
        // TODO: Implement this here...
    };

    self.topTrendingTracks = function () {
        // TODO: Implement this here...
    };

    self.initialCalls = function () {
        self.getTopArtists();
        self.getTopAlbums();
    };

    self.initialCalls();
}

ko.applyBindings(new mainController());