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
    request_youtube = audio_title + " lyrics"
    videos = youtube_search(request_youtube)
    images, success = cover_art(audio_title)

    video = pafy.new(videos[0])
    audio_stream = video.getbestaudio()
    if success:
        image_url = images[0]['image_url']
    else:
        image_url = video.thumb
    title = (video.title[: 35] + '...') if len(video.title) > 35 else video.title
    print title
    print image_url
    data_set = {
        'success': True,
        'url': audio_stream.url,
        'name': title,
        'image': image_url
    }
    return jsonify(data_set)


if __name__ == '__main__':
    app.secret_key = 'sonu5'
    app.run(debug=True, threaded=True)
