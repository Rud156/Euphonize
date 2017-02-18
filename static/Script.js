/// <reference path="./jquery.d.ts" />
// Main Audio Element
var audio = document.getElementById('audioElement');
// Control Buttons
var playPauseBtn = document.getElementById('PPBtn');
var nextAudio = document.getElementById('foward');
var prevAudio = document.getElementById('backward');
var muteBtn = document.getElementById('muteBtn');
var volumeSlider = document.getElementById('volumeSlider');
var audioSlider = document.getElementById('seekSlider');
// Time Display
var curTime = document.getElementById('currentTime');
var lefTime = document.getElementById('leftTime');
var prevVolume;
// Search Elements
var submitBtn = document.getElementById('submitBtn');
submitBtn.addEventListener('click', sendData);
var isPlaying = false;
// Video Elements
var videoImage = document.getElementById('VideoImage');
var videoName = document.getElementById('VideoName');
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
    var titleBox = document.getElementById('titleSearch');
    var artistBox = document.getElementById('artistSearch');
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
