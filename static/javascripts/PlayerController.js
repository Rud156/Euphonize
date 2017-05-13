function PlayerController() {
    var self = this;
    var playList = ko.observableArray();

    self.addToPlaylist = function () {

    };

    self.returnPlayListString = function () {
        // var start = "<ul class="ce">"
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