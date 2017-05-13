function PlayerController() {
    var self = this;
    var playList = ko.observableArray();

    self.addToPlaylist = function (artistName ,songName) {
        var queueElement  = {trackName : songName , artistName : artistName };
        playList.push(queueElement);
        console.log('boobb', playList);


    };

    self.returnPlayListString = function () {

        var completeString = '<div class="center  now-text">Now Playing</div>' +
        '<div class="tab" >' +
            '<div class="left">      ' +
            '<i class="material-icons queue-icon" style="cursor:pointer">shuffle</i>' +
            '<i class="material-icons queue-icon" style="cursor:pointer">repeat</i>' +
            '</div>' +
            '<div class="clear right">' +
            '<i class="material-icons queue-icon" style="cursor:pointer">clear_all</i>' +
            '</div>' +
        '</div>' +
        '<ul class="center">';
        for (var i = 0; i < playList().length; i++) {
            var liElement = '<li style="cursor:pointer" onclick="playQueue(this)" >' + playList()[i].trackName + ' - ' + playList()[i].artistName + '</li>';
            completeString += liElement;
        }
        completeString += '</ul> ';
        return completeString;
    };

    self.playSongFromPlaylist = function (songObject) {
        document.getElementById('searchInput').value = songObject.trackName + ' - ' + songObject.artistName;
        sendData();
    };
}

function playQueue(element) {
    console.log(element.innerHTML);
     document.getElementById('searchInput').value = element.innerHTML;
        sendData();
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