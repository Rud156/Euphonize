import pafy
from flask import Flask, render_template, jsonify, request
from youtube_list import youtube_search
from cover_art_getter import cover_art

pafy.set_api_key('AIzaSyCsrKjMf7_mHYrT6rIJ-oaA6KL5IYg389A')
app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/GetVideo', methods=['POST'])
def get_video():
    json_value = request.json

    audio_title = json_value['title']
    audio_artist = json_value['artist']
    request_string = audio_title + " " + audio_artist
    videos = youtube_search(request_string)
    images, success = cover_art(request_string)

    video = pafy.new(videos[0])
    audio_stream = video.getbestaudio()
    print video.thumb
    if success:
        image_url = images[0]['image_url']
    else:
        image_url = video.thumb
    data_set = {
        'success': True,
        'url': audio_stream.url,
        'name': video.title,
        'image': image_url
    }
    return jsonify(data_set)


if __name__ == '__main__':
    app.secret_key = 'sonu5'
    app.run(debug=True, threaded=True)
