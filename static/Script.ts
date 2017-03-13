/// <reference path="./jquery.d.ts" />
/// <reference path="./underscore.d.ts" />
/// <reference path="./jqueryUI.d.ts" />



// Main Audio Element
var audio = <HTMLAudioElement>document.getElementById('audioElement');
var searchReusltsArray: Array<String> = []; // Results Array from Last.Fm

// Control Buttons
var playPauseBtn = document.getElementById('PPBtn');
var nextAudio = document.getElementById('foward');
var prevAudio = document.getElementById('backward');
var muteBtn = document.getElementById('muteBtn');
var volumeSlider = <HTMLInputElement>document.getElementById('volumeSlider');
var audioSlider = <HTMLInputElement>document.getElementById('seekSlider');

// Time Display
var curTime = document.getElementById('currentTime');
var lefTime = document.getElementById('leftTime');
var prevVolume: number;

// Search Elements
var searchBox = <HTMLInputElement>document.getElementById('searchBox');
var submitBtn = document.getElementById('submitBtn');
submitBtn.addEventListener('click', sendData);

// Delayed function for Last.Fm request
var getTracksFromLastFm = _.debounce(() => {
    searchReusltsArray.length = 0;
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
            for (var i = 0; i < data.results.trackmatches.track.length; i++)
                searchReusltsArray.push(data.results.trackmatches.track[i].name + " - "
                    + data.results.trackmatches.track[i].artist);
        },
        error: function () {
            console.log("Error Occurred");
        }
    });
}, 1000);

// AutoCompletion From Results of Last.Fm
$("#searchBox").autocomplete({
    source: searchReusltsArray
})

// Continued Search Elements...
var isPlaying = false;
searchBox.addEventListener("keyup", getTracksFromLastFm);

// Audio Elements
var audioImage = <HTMLImageElement>document.getElementById('songImage');
audioImage.addEventListener('error', function (event) {
    var image: HTMLImageElement = <HTMLImageElement>event.target;
    image.src = '../static/brokenalbumart.png';
});
var audioName = document.getElementById('songName');

function formatTime(time: number): string {
    let tempTime = time;
    let minutes: number = parseInt((tempTime / 60).toString());
    let seconds = parseInt((tempTime % 60).toString())

    let stringMinutes: string = minutes < 10 ? "0" + minutes : minutes.toString();
    let stringSeconds: string = seconds < 10 ? "0" + seconds : seconds.toString();

    let formattedTime = stringMinutes + ":" + stringSeconds;
    return formattedTime;
}

audio.addEventListener('timeupdate', function () {
    var value = (100 / audio.duration) * audio.currentTime;
    audioSlider.value = value.toString();

    curTime.innerHTML = formatTime(audio.currentTime);
    lefTime.innerHTML = formatTime(audio.duration - audio.currentTime);
});

playPauseBtn.addEventListener('click', function () {
    if (isPlaying) {
        playPauseBtn.className = 'im im-play';
        audio.pause();
        isPlaying = false;
    }
    else {
        playPauseBtn.className = 'im im-pause';
        audio.play();
        isPlaying = true;
    }
});

audioSlider.addEventListener('change', function () {
    var time = audio.duration * (parseFloat(audioSlider.value) / 100);
    audio.currentTime = time;
});

audioSlider.addEventListener('mousedown', function () {
    if (isPlaying)
        audio.pause();
});

audioSlider.addEventListener('mouseup', function () {
    if (isPlaying)
        audio.play();
});

muteBtn.addEventListener('click', function () {
    if (audio.muted) {
        audio.muted = false;
        muteBtn.className = 'im im-volume w3-padding';
        audio.volume = prevVolume;
        volumeSlider.value = prevVolume.toString();
    }
    else {
        audio.muted = true;
        muteBtn.className = 'im im-volume-off w3-padding';
        prevVolume = parseFloat(volumeSlider.value);
        volumeSlider.value = "0";
    }
});

volumeSlider.addEventListener('change', function () {
    audio.volume = parseFloat(volumeSlider.value);
    if (audio.muted) {
        audio.muted = false;
        muteBtn.className = 'im im-volume w3-padding';
    }
    if (parseFloat(volumeSlider.value) === 0) {
        audio.muted = true;
        muteBtn.className = 'im im-volume-off w3-padding';
    }
});

nextAudio.addEventListener('click', function () {
    // TODO: Change Audio
});

prevAudio.addEventListener('click', function () {
    // TODO: Change Audio
});

function sendData() {
    var data = { 'title': searchBox.value };
    $.ajax({
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        url: 'http://localhost:5000/GetVideo',
        success: function (data) {
            if (data.success) {
                audio.src = data.url;
                audio.play();
                isPlaying = true;
                audioImage.src = data.image;
                audioImage.style.display = 'block';
                audioName.innerHTML = data.name;
                playPauseBtn.className = 'im im-pause';
            }
            else {
                console.log("Error Occured");
                window.alert("Error Occured");
            }
        },
        error: function () {
            console.log("Error Occured");
            window.alert("Error Occured");
        }
    });
}

