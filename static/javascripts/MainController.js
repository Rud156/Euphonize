/// <reference path='./../JS/knockoutJS.d.ts' />
/// <reference path='./../JS/jquery.d.ts' />
/// <reference path="./Script.js" />

var utitlity = new UtilityFunctions();

ko.components.register('spinfuck', {
    template: '<div class="spinner">\
    <div class="rect1"></div>\
    <div class="rect2"></div>\
    <div class="rect3"></div>\
    <div class="rect4"></div>\
    <div class="rect5"></div>\
    </div>'
});


function MainController() {
    var self = this;

    self.topArtists = ko.observableArray();
    self.topAlbums = ko.observableArray();
    self.topTrendingTracks = ko.observableArray();
    self.topEmergingTracks = ko.observableArray();

    self.currentPageArtistAlbum = ko.observable();

    self.currentUser = ko.observable();

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
                    utitlity.showMessages(data.message);
            },
            error: function (error) {
                console.log(error);
                utitlity.displayError('Error Occurred');
            }
        });
    };

    self.getTopAlbums = function () {
        $.ajax({
            dataType: 'json',
            url: '/top_albums',
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
                    utitlity.showMessages(data.message);
            },
            error: function (error) {
                console.log(error);
                utitlity.displayError('Error Occurred');
            }
        });
    };

    self.getTopEmergingTracks = function () {
        $.ajax({
            dataType: 'json',
            url: '/top_emerging_tracks',
            success: function (data) {
                if (data.success) {
                    self.topEmergingTracks.removeAll();
                    var trackArray = [];
                    data.emerge_chart = data.emerge_chart.splice(0, 10);

                    data.emerge_chart.forEach(function (element) {
                        trackArray.push(new AlbumArtistHolder(element));
                    });
                    self.topEmergingTracks(trackArray);
                    initFlowy('flowy_emerging');
                }
                else
                    utitlity.showMessages(data.message);
            },
            error: function (error) {
                console.log(error);
                utitlity.displayError('Error Occurred');
            }
        });
    };

    self.getTopTrendingTracks = function () {
        $.ajax({
            dataType: 'json',
            url: '/top_trending',
            success: function (data) {
                if (data.success) {
                    self.topTrendingTracks.removeAll();
                    var trackArray = [];
                    data.trending = data.trending.splice(0, 10);

                    data.trending.forEach(function (element) {
                        trackArray.push(new AlbumArtistHolder(element));
                    });
                    self.topTrendingTracks(trackArray);
                    initFlowy('flowy_trending');
                }
                else
                    utitlity.showMessages(data.message);
            },
            error: function (error) {
                console.log(error);
                utitlity.displayError('Error Occurred');
            }
        });
    };

    self.initialCalls = function () {
        self.currentPageArtistAlbum(null);
        self.getTopArtists();
        self.getTopAlbums();
        self.getTopEmergingTracks();
        self.getTopTrendingTracks();
    };

    self.playSong = function (artistName, songName) {
        document.getElementById('searchInput').value = songName + ' - ' + artistName;
        sendData();
    };

    self.addQueue = function(artistName , songName){
                console.log(artistName ,songName);

        playerController.addToPlaylist(artistName ,songName);
        console.log(artistName ,songName);
    }

    self.getArtistInfo = function (artistObject) {
        console.log(artistObject);
        if (typeof (artistObject) === 'object')
            artistObject = artistObject.artistName ? artistObject.artistName : artistObject.artist_name;
        var artistName = encodeURIComponent(artistObject);
        console.log(artistName);

        location.hash = '/artists/' + artistName;
    };

    self.getAlbumInfo = function (albumObject, artistName) {
        if (typeof (albumObject) === 'object') {
            artistName = albumObject.artistName;
            albumObject = albumObject.albumName;
        }
        var albumName = encodeURIComponent(albumObject);
        artistName = encodeURIComponent(artistName);

        location.hash = '/albums/' + artistName + '/' + albumName;
    };
}

var mainController = new MainController();
ko.applyBindings(mainController, document.getElementById("contentHolder"));


var routes = {
    '/artists/:artistName': function (artistName) {
        $.ajax({
            dataType: 'json',
            url: '/artist?artist_name=' + artistName + '&data_type=info',
            success: function (data) {
                if (data.success) {
                    var artistData = new PageAlbumArtistHolder(data.artist_data);
                    mainController.currentPageArtistAlbum(artistData);
                    initFlowy('flowy_artists');

                    $.ajax({
                        dataType: 'json',
                        url: '/artist_top?name=' + artistData.artistName + '&type=tracks',
                        success: function (data) {
                            if (data.success) {
                                data.artist_tracks = data.artist_tracks.splice(0, 20);
                                artistData.tracks = data.artist_tracks;
                                mainController.currentPageArtistAlbum(artistData)

                                initFlowy('flowy_tracks');
                                initFlowy('flowy_artists');
                            }
                            else
                                utitlity.showMessages(data.message);
                        },
                        error: function (error) {
                            utitlity.displayError(error);
                        }
                    });

                }
                else
                    utitlity.showMessages(data.message);
            },
            error: function (error) {
                utitlity.displayError(error);
            }
        });
    },

    '/albums/:artistName/:albumName': function (artistName, albumName) {
        $.ajax({
            dataType: 'json',
            url: '/album_info?album_name=' + albumName + '&artist_name=' + artistName,
            success: function (data) {
                if (data.success) {
                    var pageAlbum = new PageAlbumArtistHolder(data.album_data);
                    mainController.currentPageArtistAlbum(pageAlbum);
                    initFlowy('flowy_tracks');

                    $.ajax({
                        dataType: 'json',
                        url: '/artist?artist_name=' + artistName + '&data_type=similar',
                        success: function (data) {
                            if (data.success) {
                                data.similar_artists = data.similar_artists.splice(0, 20);
                                pageAlbum.similarArtists = data.similar_artists;
                                mainController.currentPageArtistAlbum(pageAlbum);

                                initFlowy('flowy_tracks');
                                initFlowy('flowy_artists');
                            }
                            else
                                utitlity.showMessages(data.message);
                        },
                        error: function (error) {
                            utitlity.displayError(error);
                        }
                    });
                }
                else
                    utitlity.showMessages(data.message);
            },
            error: function (error) {
                utitlity.displayError(error);
            }
        });
    },

    '/': function () {
        mainController.initialCalls();
    }
};

var router = Router(routes);
router.init();

if (location.hash === '')
    location.hash = '#/';