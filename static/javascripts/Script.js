/// <reference path="./../JS/jquery.d.ts" />
/// <reference path="./../JS/underscore.d.ts" />
/// <reference path="./../JS/jqueryUI.d.ts" />

// Main Audio Element
var audio = document.getElementById('audioElement');
var searchReusltsArray = []; // Results Array from Last.Fm

// Control Buttons
var playPauseBtn = document.getElementById('PPBtn');
var nextAudio = document.getElementById('forward');
var prevAudio = document.getElementById('backward');
var audioSlider = document.getElementsByClassName('seekSlider');

// Time Display
var curTime = document.getElementsByClassName('currentTime');
var lefTime = document.getElementsByClassName('leftTime');

// Loaders
var loaders = document.getElementsByClassName('loading-progress');

// Variables for queue playing
window.currentPlayingIndex = 0;
window.playList = [];
window.repeat = false;

// Search Elements
var searchBox = document.getElementById('searchInput');
searchBox.addEventListener('keydown', function (keyDownValue) {
    if (keyDownValue.keyCode === 13)
        sendData();
});
var submitBtn = document.getElementById('submitBtn');
submitBtn.addEventListener('click', sendData);

// Download Button
var downloadBtn = document.getElementById('downloadBtn');

// Delayed function for Last.Fm request
var getTracksFromLastFm = _.debounce(function () {
    var data = searchBox.value;
    if (data.trim() === "")
        return;
    data = data.replace(/ /g, "%20");
    var url = "http://ws.audioscrobbler.com/2.0/?method=track.search&track=" + data +
        "&api_key=7ede02c397c8cf99bf26e1f8cb9681fa&format=json";
    $.ajax({
        type: 'GET',
        contentType: 'application/json',
        url: url,
        success: function (data) {
            searchReusltsArray.length = 0;
            for (var i = 0; i < data.results.trackmatches.track.length; i++)
                searchReusltsArray.push(data.results.trackmatches.track[i].name + " - " +
                    data.results.trackmatches.track[i].artist);
        },
        error: function () {
            console.log("Error Occurred");
        }
    });
}, 250);

// AutoCompletion From Results of Last.Fm
$("#searchInput").autocomplete({
    source: searchReusltsArray
});

// Continued Search Elements...
var isPlaying = false;
searchBox.addEventListener("keyup", getTracksFromLastFm);

// Audio Elements
var audioImage = document.getElementById('songImage');
audioImage.addEventListener('error', function (event) {
    var image = event.target;
    image.src = './../static/Images/brokenalbumart.png';
});

var audioName = document.getElementsByClassName('songName');
function formatTime(time) {
    var tempTime = time;
    var minutes = parseInt((tempTime / 60).toString());
    var seconds = parseInt((tempTime % 60).toString());
    var stringMinutes = minutes < 10 ? "0" + minutes : minutes.toString();
    var stringSeconds = seconds < 10 ? "0" + seconds : seconds.toString();
    var formattedTime = stringMinutes + ":" + stringSeconds;
    return formattedTime;
}

audio.addEventListener('timeupdate', function () {
    var value = (100 / audio.duration) * audio.currentTime;
    var i;
    for (i = 0; i < audioSlider.length; i++)
        audioSlider[i].value = value.toString();
    for (i = 0; i < curTime.length; i++) {
        curTime[i].innerHTML = formatTime(audio.currentTime);
        lefTime[i].innerHTML = formatTime(audio.duration - audio.currentTime);
    }

    if (parseInt(audio.currentTime) === parseInt(audio.duration)) {
        playPauseBtn.innerHTML = 'play_arrow';
        audio.pause();
        isPlaying = false;
        audio.currentTime = 0;
        playNextSong();
    }
});

function playNextSong() {
    var endingPlayIndex = window.playList.length;

    if (window.repeat) {
        if (window.currentPlayingIndex < endingPlayIndex - 1)
            window.currentPlayingIndex++;
        else
            window.currentPlayingIndex = 0;
        document.getElementById('searchInput').value = window.playList[window.currentPlayingIndex].trackName + ' - ' + window.playList[window.currentPlayingIndex].artistName;
        sendData();
    }
    else {
        if (window.currentPlayingIndex < endingPlayIndex - 1) {
            window.currentPlayingIndex++;
            document.getElementById('searchInput').value = window.playList[window.currentPlayingIndex].trackName + ' - ' + window.playList[window.currentPlayingIndex].artistName;
            sendData();
        }
        else
            window.currentPlayingIndex = 0;
    }
    playPauseBtn.innerHTML = 'play_arrow';
    audio.pause();
    isPlaying = false;
}

playPauseBtn.addEventListener('click', function () {
    if (isPlaying) {
        playPauseBtn.innerHTML = 'play_arrow';
        audio.pause();
        isPlaying = false;
    }
    else {
        playPauseBtn.innerHTML = 'pause';
        audio.play();
        isPlaying = true;
    }
});

audioSlider[0].addEventListener('change', function () {
    var time = audio.duration * (parseFloat(audioSlider[0].value) / 100);
    audio.currentTime = time;
});
audioSlider[1].addEventListener('change', function () {
    var time = audio.duration * (parseFloat(audioSlider[1].value) / 100);
    audio.currentTime = time;
});

audioSlider[0].addEventListener('mousedown', function () {
    if (isPlaying)
        audio.pause();
});
audioSlider[1].addEventListener('mousedown', function () {
    if (isPlaying)
        audio.pause();
});

audioSlider[0].addEventListener('mouseup', function () {
    if (isPlaying)
        audio.play();
});
audioSlider[1].addEventListener('mouseup', function () {
    if (isPlaying)
        audio.play();
});

nextAudio.addEventListener('click', function () {
    var endingPlayIndex = window.playList.length;

    if (window.currentPlayingIndex < endingPlayIndex - 1)
        window.currentPlayingIndex++;
    else
        window.currentPlayingIndex = 0;

    console.log(window.currentPlayingIndex);
    document.getElementById('searchInput').value = window.playList[window.currentPlayingIndex].trackName + ' - ' + window.playList[window.currentPlayingIndex].artistName;
    sendData();
});

prevAudio.addEventListener('click', function () {
    var endingPlayIndex = window.playList.length;

    if (window.currentPlayingIndex > 0)
        window.currentPlayingIndex--;
    else
        window.currentPlayingIndex = endingPlayIndex - 1;
    document.getElementById('searchInput').value = window.playList[window.currentPlayingIndex].trackName + ' - ' + window.playList[window.currentPlayingIndex].artistName;
    sendData();
});

function sendData() {
    var data = { 'title': searchBox.value };
    var i;
    for (i = 0; i < loaders.length; i++)
        loaders[i].style.display = 'block';
    for (i = 0; i < audioSlider.length; i++)
        audioSlider[i].style.display = 'none';

    $.ajax({
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        url: '/get_video',
        success: function (data) {
            if (data.success) {
                for (i = 0; i < loaders.length; i++)
                    loaders[i].style.display = 'none';
                for (i = 0; i < audioSlider.length; i++)
                    audioSlider[i].style.display = 'block';

                audio.src = data.music.url;
                audio.play();
                isPlaying = true;
                audioImage.src = data.music.image;
                audioImage.style.display = 'block';

                for (var i = 0; i < audioName.length; i++)
                    audioName[i].innerHTML = data.music.name;

                playPauseBtn.innerHTML = 'pause';
            }
            else {
                console.log("Error Occurred");
                window.alert("Error Occurred");
            }
        },
        error: function () {
            console.log("Error Occurred");
            window.alert("Error Occurred");
        }
    });
}
