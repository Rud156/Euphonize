import pafy
from flask import Flask, render_template, jsonify, request

# pafy.set_api_key('AIzaSyCsrKjMf7_mHYrT6rIJ-oaA6KL5IYg389A')
app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/GetVideo', methods=['POST'])
def GetVideo():
    jsonValue = request.json
    video = pafy.new(jsonValue['url'])
    audioStream = video.getbestaudio()
    # print audioStream.url
    dataSet = {
        'success': True,
        'url': audioStream.url,
        'name': video.title,
        'image': video.thumb
    }
    return jsonify(dataSet)


if __name__ == '__main__':
    app.secret_key = 'sonu5'
    app.run(debug=True, threaded=True)
