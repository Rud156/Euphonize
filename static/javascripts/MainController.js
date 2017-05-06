/// <reference path='./../JS/knockoutJS.d.ts' />
/// <reference path='./../JS/jquery.d.ts' />
/// <reference path='./../JS/SammyJS.d.ts' />


// Initializations
function init(trending) {
    if (trending)
        $('.flowy_trending').slick({
            infinite: true,
            sildesToShow: 3,
            slidesToScroll: 1,
            variableWidth: true
        });
    else
        $('.flowy_emerging').slick({
            infinite: true,
            sildesToShow: 3,
            slidesToScroll: 1,
            variableWidth: true
        });
}
var utitlity = new UtitlityFunctions();


function mainController() {
    var self = this;

    self.topArtists = ko.observableArray();
    self.topAlbums = ko.observableArray();
    self.topTrendingTracks = ko.observableArray();
    self.topEmergingTracks = ko.observableArray();

    // self.currentArtistAlbum = 

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
                    init(false);
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
                    init(true);
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
        self.getTopArtists();
        self.getTopAlbums();
        self.getTopEmergingTracks();
        self.getTopTrendingTracks();
    };

    self.playSong = function (songData) {
        document.getElementById('searchInput').value = songData.trackName + ' - ' + songData.artistName;
        sendData();
    };

    self.initialCalls();
}

ko.applyBindings(new mainController());