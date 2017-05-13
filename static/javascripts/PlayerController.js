function PlayerController() {
    var self = this;
    var playList = ko.observableArray();

    self.addToPlaylist = function () {

    };

    self.returnPlayListString = function () {
        var completeString = '<ul class="center white white-text" data-bind="foreach: playList">';
        // for (var i = 0; i < playList().length; i++) {
        //     var liElement = '<li class="center" data-bind="">' + playList()[i].trackName + ' - ' + playList()[i].artistName + '</li>';
        //     completeString += liElement;
        // }
        completeString += '<li data-bind="text: trackName + \' - \' + artistName, click: playSongFromPlaylist"></li>';
        completeString += '</ul>';
        return completeString;
    };

    self.playSongFromPlaylist = function (songObject) {
        document.getElementById('searchInput').value = songObject.trackName + ' - ' + songObject.artistName;
        sendData();
    };
}

var playerController = new PlayerController();
ko.applyBindings(playerController, document.getElementById('playerHolder'));

var drop = new Drop({
    target: document.querySelector('#playListOpener'),
    content: playerController.returnPlayListString,
    position: 'top center',
    openOn: 'hover',
    classes: 'drop-theme-arrows'
});