import pafy
from flask import Flask, render_template, jsonify, request
from youtube_list import youtube_search
from cover_art_getter import itunes_album_art, last_fm_cover_art
import LastFM_Top
import top_chart

pafy.set_api_key('AIzaSyCsrKjMf7_mHYrT6rIJ-oaA6KL5IYg389A')
app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/get_video', methods=['POST'])
def get_video():
    json_value = request.json

    audio_title = json_value['title']

    # Check validity of audio title format
    check_title = audio_title.split(' - ')
    if len(check_title) is not 2:
        return jsonify({'success': False, 'message': 'Incorrect input string'})

    request_youtube = audio_title + " lyrics"
    videos = youtube_search(request_youtube)
    image, success = itunes_album_art(audio_title)

    video = pafy.new(videos[0])
    audio_stream = video.getbestaudio()
    if success:
        image_url = image
    else:
        image, success = last_fm_cover_art(audio_title)
        if success:
            image_url = image
        else:
            image_url = video.thumb
            
    title = audio_title.split(' - ')
    title[0], title[1] = title[1], title[0]
    title = "<br />".join(title)

    data_set = {
        'success': True,
        'url': audio_stream.url,
        'name': title,
        'image': image_url
    }
    return jsonify({'success': True, 'music': data_set})


@app.route('/top_artists', methods=['GET'])
def get_top_artists():
    data = request.args.get('type')

    # Check for validity of incoming data
    if data is None:
        return jsonify({'success': False, 'message': 'Invalid parameters supplied'})

    if data == 'user_cu':
        artists = LastFM_Top.top_artists()
        return jsonify({'success': True, 'artists': artists})
    else:
        artists = top_chart.top_artist()
        return jsonify({'success': True, 'artists': artists})


@app.route('/top_tracks', methods=['GET'])
def get_top_tracks():
    data = request.args.get('type')

    # Check for validity of incoming data
    if data is None:
        return jsonify({'success': False, 'message': 'Invalid parameters supplied'})

    if data == 'user_cu':
        tracks = LastFM_Top.top_tracks()
        return jsonify({'success': True, 'tracks': tracks})
    else:
        tracks = top_chart.top_chart()
        return jsonify({'success': True, 'tracks': tracks})


@app.route('/top_emerging_tracks', methods=['GET'])
def top_emerging_tracks():
    data = top_chart.emerge_chart()
    return jsonify({'success': True, 'emerge_chart': data})


@app.route('/top_trending', methods=['GET'])
def top_trending():
    data = top_chart.trending_chart()
    return jsonify({'success': True, 'trending': data})


@app.route('/top_albums', methods=['GET'])
def get_top_albums():
    albums = LastFM_Top.top_albums()
    return jsonify({'success': True, 'albums': albums})


@app.route('/artist_top', methods=['GET'])
def artist_top():
    artist = request.args.get('name')
    data = request.args.get('type')

    # Check for validity of incoming data
    if data is None or artist is None:
        return jsonify({'success': False, 'message': 'Invalid parameters supplied'})

    if data == 'tracks':
        return jsonify({'success': True, 'artist_tracks': LastFM_Top.get_artist_top_albums(artist)})


@app.route('/popular_genre', methods=['GET'])
def popular_genre():
    data = request.args.get('type')

    # Check for validity of incoming data
    if data is None:
        return jsonify({'success': False, 'message': 'Invalid parameters supplied'})

    if data == 'tags':
        return jsonify({'success': True, 'popular_genre': LastFM_Top.top_tags()})
    elif data == 'albums':
        tag_name = request.args.get('tag_name')

        # Check validity of incoming data
        if tag_name is None:
            return jsonify({'success': False, 'message': 'Invalid parameters supplied'})

        return jsonify({'success': True, 'albums': LastFM_Top.get_albums_for_tags(tag_name, 100)})
    else:
        tag_name = request.args.get('tag_name')

        # Check validity of incoming data
        if tag_name is None:
            return jsonify({'success': False, 'message': 'Invalid parameters supplied'})

        return jsonify({'success': True, 'tracks': LastFM_Top.get_tracks_for_tags(tag_name)})


@app.route('/artist', methods=['GET'])
def get_artist():
    artist_name = request.args.get('artist_name')

    # Check validity of incoming data
    if artist_name is None:
        return jsonify({'success':  False, 'message': 'Invalid parameters supplied'})

    data = LastFM_Top.get_artist_info(artist_name)
    if data is None:
        return jsonify({'success': False, 'message': 'Incorrect artist name'})
    else:
        return jsonify({'success': True, 'artist_data': data})


@app.route('/album_info', methods=['GET'])
def get_album_info():
    album_name = request.args.get('album_name')
    artist_name = request.args.get('artist_name')

    # Check validity of incoming data
    if artist_name is None or album_name is None:
        return jsonify({'success': False, 'message': 'Invalid parameters supplied'})

    data = LastFM_Top.get_album_info(album_name, artist_name)
    if data is None:
        return jsonify({'success': False, 'message': 'Incorrect artist name or album name'})
    else:
        return jsonify({'success': True, 'album_data': data})


if __name__ == '__main__':
    app.secret_key = 'someSecret'
    app.run(debug=True, threaded=True)
