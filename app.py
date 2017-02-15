import pafy
from flask import Flask, render_template, jsonify, request
from youtube_list import youtube_search

# pafy.set_api_key('AIzaSyCsrKjMf7_mHYrT6rIJ-oaA6KL5IYg389A')
# //div[@id="search_results"]/div/a/span[2]/img/@src
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

    video = pafy.new(videos[0])
    audio_stream = video.getbestaudio()
    data_set = {
        'success': True,
        'url': audio_stream.url,
        'name': video.title,
        'image': video.thumb
    }
    return jsonify(data_set)


if __name__ == '__main__':
    app.secret_key = 'sonu5'
    app.run(debug=True, threaded=True)
