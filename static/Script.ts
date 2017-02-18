/// <reference path="./jquery.d.ts" />

// Main Audio Element
var audio = <HTMLAudioElement>document.getElementById('audioElement');

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
var submitBtn = document.getElementById('submitBtn');
submitBtn.addEventListener('click', sendData);
var isPlaying = false;

// Video Elements
var videoImage = <HTMLImageElement>document.getElementById('VideoImage');
videoImage.addEventListener('error', function(event){
    event.target.src = '../static/brokenalbumart.png';
});
var videoName = document.getElementById('VideoName');

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
        playPauseBtn.className = 'fa fa-play';
        audio.pause();
        isPlaying = false;
    }
    else {
        playPauseBtn.className = 'fa fa-pause';
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
        muteBtn.className = 'fa fa-volume-up';
        audio.volume = prevVolume;
        volumeSlider.value = prevVolume.toString();
    }
    else {
        audio.muted = true;
        muteBtn.className = 'fa fa-volume-off';
        prevVolume = parseFloat(volumeSlider.value);
        volumeSlider.value = "0";
    }
});

volumeSlider.addEventListener('change', function () {
    audio.volume = parseFloat(volumeSlider.value);
    if (audio.muted) {
        audio.muted = false;
        muteBtn.className = 'fa fa-volume-up';
    }
});

nextAudio.addEventListener('click', function () {
    // TODO: Change Audio
});

prevAudio.addEventListener('click', function () {
    // TODO: Change Audio
});

function sendData() {
    var titleBox = <HTMLInputElement>document.getElementById('titleSearch');
    var artistBox = <HTMLInputElement>document.getElementById('artistSearch');
    var data = { 'title': titleBox.value, 'artist': artistBox.value };
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
                videoImage.src = data.image;
                videoImage.style.display = 'block';
                videoName.innerHTML = data.name;
                playPauseBtn.className = 'fa fa-pause';
            }
            else
                console.log("Error Occured");
        },
        error: function () {
            console.log("Error Occured");
        }
    });
}