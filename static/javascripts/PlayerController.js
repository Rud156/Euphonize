function PlayerController() {
    var self = this;
    self.playList = ko.observableArray();

    self.addToPlaylist = function (artistName, songName) {
        var queueElement = { trackName: songName, artistName: artistName };
        self.playList.push(queueElement);

        window.playList = self.playList.slice();
    };

    self.returnPlayListString = function () {
        var completeString = '<div class="center  now-text">Now Playing</div>' +
            '<div class="tab" >' +
            '<div class="left">' +
            '<i class="material-icons queue-icon" style="cursor:pointer" onclick="shufflePlayList(this)">shuffle</i>';
        if (window.repeat)
            completeString += '<i class="material-icons queue-icon" style="cursor:pointer; background: orange" onclick="activateRepeat(this)">repeat</i>';
        else
            completeString += '<i class="material-icons queue-icon" style="cursor:pointer" onclick="activateRepeat(this)">repeat</i>';

        completeString += '</div>' +
            '<div class="clear right">' +
            '<i class="material-icons queue-icon" style="cursor:pointer" onclick="clearPlaylist(this)">clear_all</i>' +
            '</div>' +
            '</div>' +
            '<ul class="center">';
        for (var i = 0; i < self.playList().length; i++) {
            var liElement = '';
            if (i === window.currentPlayingIndex)
                liElement = '<li style="cursor: pointer; background: orange" onclick="playQueue(this)" class="playQueueElements">' + self.playList()[i].trackName + ' - ' + self.playList()[i].artistName + '</li>';
            else
                liElement = '<li style="cursor: pointer;" onclick="playQueue(this)" class="playQueueElements">' + self.playList()[i].trackName + ' - ' + self.playList()[i].artistName + '</li>';
            completeString += liElement;
        }
        completeString += '</ul>';
        return completeString;
    };
}

function playQueue(element) {
    var playQueueElements = document.getElementsByClassName('playQueueElements');
    for (var i = 0; i < playQueueElements.length; i++) {
        if (i === window.currentPlayingIndex) {
            playQueueElements[i].style.background = '';
            break;
        }
    }

    var tempArray = element.innerHTML.split(' - ');
    var songObject = { trackName: tempArray[0].trim(), artistName: tempArray[1].trim() };
    window.playList.forEach(function (value, index) {
        if (value.trackName === songObject.trackName && value.artistName === songObject.artistName) {
            window.currentPlayingIndex = index;
            return;
        }
    });
    element.style.background = 'orange';

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
    window.playList = playerController.playList.slice();
}

function activateRepeat(element) {
    window.repeat = !window.repeat;
    if (window.repeat)
        element.style.background = 'orange';
    else
        element.style.background = '';
}

function clearPlaylist(element) {
    playerController.playList.removeAll();
    window.playList = playerController.playList.slice();
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