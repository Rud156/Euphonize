function PlayerController() {
    var self = this;
    self.playList = ko.observableArray();

    self.addToPlaylist = function (artistName, songName) {
        var queueElement = { trackName: songName, artistName: artistName };
        self.playList.push(queueElement);
    };

    self.returnPlayListString = function () {
        var completeString = '<div class="center  now-text">Now Playing</div>' +
            '<div class="tab" >' +
            '<div class="left">      ' +
            '<i class="material-icons queue-icon" style="cursor:pointer" onclick="shufflePlayList(this)">shuffle</i>' +
            '<i class="material-icons queue-icon" style="cursor:pointer" onclick="activateRepeat(this)">repeat</i>' +
            '</div>' +
            '<div class="clear right">' +
            '<i class="material-icons queue-icon" style="cursor:pointer" onclick="clearPlaylist(this)">clear_all</i>' +
            '</div>' +
            '</div>' +
            '<ul class="center">';
        for (var i = 0; i < self.playList().length; i++) {
            var liElement = '<li style="cursor:pointer" onclick="playQueue(this)" >' + self.playList()[i].trackName + ' - ' + self.playList()[i].artistName + '</li>';
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
    document.getElementById('searchInput').value = element.innerHTML;
    sendData();
}

function shufflePlayList(element) {
    var array = playerController.playList();
    if (array.length === 0 || array.length === 1)
        return;
    var currentIndex = array.length;
    var temporaryValue;
    var randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    playerController.playList(array);
}

window.repeat = false;
function activateRepeat(element) {
    window.repeat = !window.repeat;
}

function clearPlaylist(element) {
    playerController.playList.removeAll();
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