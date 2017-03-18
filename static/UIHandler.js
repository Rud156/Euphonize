/// <reference path="./jquery.d.ts" />
/// <reference path="./knockoutJS.d.ts" />


function MainUIHandler() {
    var self = this;
    self.topChartsData = ko.observable();

    self.getTopTracks = function () {
        $.get('http://localhost:5000/top_tracks', { type: 'user_cu' }, function (data) {
            self.topChartsData(data);
        });
    };

    self.playMedia = function(track){
        console.log(track);
    };

    self.getTopTracks();
}

ko.applyBindings(new MainUIHandler());