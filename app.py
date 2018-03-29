import uuid
import pafy
from pymongo import MongoClient, errors
from flask import Flask, jsonify, request
from flask_cors import CORS

import constants
import last_fm
import top_chart
from cover_art_getter import last_fm_cover_art
from search import get_search_result
from youtube_list import youtube_search

# MONGO_URI = 'mongodb://localhost:27017'
MONGO_URI = 'mongodb://rud156:1234@ds227469.mlab.com:27469/euphonize'

pafy.set_api_key('AIzaSyCsrKjMf7_mHYrT6rIJ-oaA6KL5IYg389A')
APP = Flask(__name__)
CLIENT = MongoClient(MONGO_URI)
DB = CLIENT.euphonize
PLAYLIST = DB.playlist
CORS(APP)


@APP.route('/')
def index():
    """
    Index Route
    """
    return jsonify({'success': True, 'message': 'Hello World'})


@APP.route('/search', methods=['GET'])
def search():
    """
    Get track search results
    """
    search_query = request.args.get('search_query')
    result = get_search_result(search_query)
    if result is None:
        return jsonify({'success': False, 'message': 'Unable to get the data'})
    else:
        return jsonify({'success': True, 'result': result})


@APP.route('/audio', methods=['GET'])
def get_video():
    """
    Get MP3 link from track and artist names
    """
    track_name = request.args.get('track')
    artist_name = request.args.get('artist')

    # Check validity of audio title format
    if track_name is None or artist_name is None:
        return jsonify({'success': False, 'message': 'No parameters supplied'})

    audio_title = track_name + ' - ' + artist_name

    if not constants.ARTIST_NAME.match(artist_name) or not constants.TRACK_NAME.match(track_name):
        return jsonify({'success': False, 'message': 'Incorrect input string'})

    request_youtube = audio_title + ' lyrics'
    print('Request String Created: ' + request_youtube)
    videos = youtube_search({'q': request_youtube, 'max_results': 20})
    image, success = last_fm_cover_art(track_name, artist_name)

    video = pafy.new(videos[0])
    audio_stream = video.getbestaudio()
    if success:
        image_url = image
    else:
        image_url = video.thumb

    data_set = {
        'success': True,
        'url': audio_stream.url,
        'track_name': track_name,
        'artist_name': artist_name,
        'image': image_url
    }
    return jsonify({'success': True, 'track': data_set})


@APP.route('/get_playlist', methods=['GET'])
def get_playlist():
    playlist_id = request.args.get('playlist_id')

    try:
        data = PLAYLIST.find_one({'playlist_id': playlist_id})
        if data is None:
            return jsonify({
                'success': False,
                'message': 'The playlist you requested does not exist'
            })

        return jsonify({'success': True, 'playlist': data['playlist']})
    except errors.PyMongoError as exception:
        print(exception)
        return jsonify({
            'success': False,
            'message': 'An error occurred when retrieving the playlist. Please try again'
        })


@APP.route('/generate_playlist_link', methods=['POST'])
def generate_playlist_link():
    playlist_content = request.get_json()
    unique_string = hex(int(uuid.uuid4().time_low))[2:]

    try:
        PLAYLIST.insert_one({
            'playlist_id': unique_string,
            'playlist': playlist_content
        })
        return jsonify({
            'success': True,
            'playlist_id': unique_string
        })
    except errors.PyMongoError as exception:
        print(exception)
        return jsonify({
            'success': False,
            'message': 'An error occurred when saving the playlist. Please try again'
        })


@APP.route('/update_playlist', methods=['PUT'])
def update_playlist():
    playlist_id = request.args.get('playlist_id')
    playlist_content = request.get_json()

    try:
        PLAYLIST.update_one({'playlist_id': playlist_id}, {
            '$set': {
                'playlist': playlist_content
            }
        })
        return jsonify({'success': True, 'message': 'Playlist updated successfully'})
    except errors.PyMongoError as exception:
        print(exception)
        return jsonify({
            'success': False,
            'message': 'An error occurred when updating the playlist. Please try again'
        })


@APP.route('/top_artists', methods=['GET'])
def get_top_artists():
    """
    Get Top Artists
    """
    data = request.args.get('type')

    # Check for validity of incoming data
    if data is None:
        return jsonify({'success': False, 'message': 'No parameters supplied'})
    if not constants.MEDIA_DATA_TYPE.match(data):
        return jsonify({'success': False, 'message': 'Invalid parameters supplied'})

    if data == 'user_cu':
        artists = last_fm.top_artists()
        if artists is None:
            return jsonify({'success': False, 'message': 'Unable to fetch data. Please try again later'})
        return jsonify({'success': True, 'artists': artists})
    else:
        artists = top_chart.top_artist()
        if artists is None:
            return jsonify({'success': False, 'message': 'Unable to fetch data. Please try again later'})
        return jsonify({'success': True, 'artists': artists})


@APP.route('/top_tracks', methods=['GET'])
def get_top_tracks():
    """
    Get Top Tracks
    """
    data = request.args.get('type')

    # Check for validity of incoming data
    if data is None:
        return jsonify({'success': False, 'message': 'No parameters supplied'})
    if not constants.MEDIA_DATA_TYPE.match(data):
        return jsonify({'success': False, 'message': 'Invalid parameters supplied'})

    if data == 'user_cu':
        tracks = last_fm.top_tracks()
        if tracks is None:
            return jsonify({'success': False, 'message': 'Unable to fetch data. Please try again later'})
        return jsonify({'success': True, 'tracks': tracks})
    else:
        tracks = top_chart.top_chart()
        if tracks is None:
            return jsonify({'success': False, 'message': 'Unable to fetch data. Please try again later'})
        return jsonify({'success': True, 'tracks': tracks})


@APP.route('/top_trending', methods=['GET'])
def top_trending():
    """
    Get Top Trending Tracks
    """
    data = top_chart.trending_chart()
    if data is None:
        return jsonify({'success': False, 'message': 'Unable to fetch data. Please try again later'})
    return jsonify({'success': True, 'tracks': data})


@APP.route('/top_albums', methods=['GET'])
def get_top_albums():
    """
    Get Top Albums
    """
    albums = last_fm.top_albums()
    if albums is None:
        return jsonify({'success': False, 'message': 'Unable to fetch data. Please try again later'})
    return jsonify({'success': True, 'albums': albums})


@APP.route('/emerging_artists', methods=['GET'])
def get_emerging_artists():
    """
    Get Emerging Artists
    """
    data = top_chart.emerging_artist()
    if data is None:
        return jsonify({'success': False, 'message': 'Unable to fetch data. Please try again later'})
    return jsonify({'success': True, 'artists': data})


@APP.route('/artist_top', methods=['GET'])
def artist_top():
    """
    Get artist top content
    """
    artist = request.args.get('name')
    data = request.args.get('type')

    # Check for validity of incoming data
    if data is None or artist is None:
        return jsonify({'success': False, 'message': 'No parameters supplied'})
    if not constants.ARTIST_NAME.match(artist) or not constants.ARTIST_DATA_TYPE.match(data):
        return jsonify({'success': False, 'message': 'Invalid parameters supplied'})

    if data == 'tracks':
        return jsonify({'success': True, 'artist_tracks': last_fm.get_artist_top_tracks(artist)})
    else:
        return jsonify({'success': True, 'artist_albums': last_fm.get_artist_top_albums(artist)})


@APP.route('/popular_genre', methods=['GET'])
def popular_genre():
    """
    Data for popular content
    """
    data = request.args.get('type')

    # Check for validity of incoming data
    if data is None:
        return jsonify({'success': False, 'message': 'No parameters supplied'})
    if not constants.POPULAR_DATA_TYPE.match(data):
        return jsonify({'success': False, 'message': 'Invalid parameters supplied'})

    if data == 'tags':
        pop_genre = last_fm.top_tags()
        if pop_genre is None:
            return jsonify({'success': False, 'message': 'Unable to fetch the data'})
        return jsonify({'success': True, 'popular_genre': pop_genre})

    elif data == 'albums':
        tag_name = request.args.get('tag_name')

        # Check validity of incoming data
        if not constants.TAG_NAME.match(tag_name):
            return jsonify({'success': False, 'message': 'Invalid parameters supplied'})
        albums = last_fm.get_albums_for_tags(tag_name, 25)
        if albums is None:
            return jsonify({'success': False, 'message': 'Unable to fetch the data'})
        return jsonify({'success': True, 'albums': albums})

    else:
        tag_name = request.args.get('tag_name')

        # Check validity of incoming data
        if tag_name is None:
            return jsonify({'success': False, 'message': 'No parameters supplied'})
        if not constants.TAG_NAME.match(tag_name):
            return jsonify({'success': False, 'message': 'Invalid parameters supplied'})
        tracks = last_fm.get_tracks_for_tags(tag_name)
        if tracks is None:
            return jsonify({'success': False, 'message': 'Unable to fetch the data'})
        return jsonify({'success': True, 'tracks': tracks})


@APP.route('/artist', methods=['GET'])
def get_artist():
    """
    Get data related to artist
    """
    artist_name = request.args.get('artist_name')
    content = request.args.get('data_type')

    # Check validity of incoming data
    if artist_name is None or content is None:
        return jsonify({'success': False, 'message': 'No parameters supplied'})
    if not constants.ARTIST_NAME.match(artist_name) or not constants.ARTIST_INFO.match(content):
        return jsonify({'success': False, 'message': 'Invalid parameters supplied'})

    if content == 'info':
        data = last_fm.get_artist_info(artist_name)
        if data is None:
            return jsonify({'success': False,
                            'message': 'I\'m sorry but \
                            we do not have enough information about the artist you requested'})
        else:
            return jsonify({'success': True, 'artist_data': data})
    else:
        similar_artists = last_fm.get_artist_similar_artists(artist_name)
        if similar_artists is None:
            return jsonify({'success': False, 'message': 'Incorrect or invalid artist name supplied'})
        else:
            return jsonify({'success': True, 'similar_artists': similar_artists})


@APP.route('/track', methods=['GET'])
def get_track():
    """
    Get data related to track
    """
    track_name = request.args.get('track_name')
    artist_name = request.args.get('artist_name')
    content = request.args.get('data_type')

    # Check validity of incomming data
    if artist_name is None or track_name is None:
        return jsonify({'success': False, 'message': 'No parameters supplied'})
    if not constants.TRACK_NAME.match(track_name) or not constants.ARTIST_NAME.match(artist_name):
        return jsonify({'success': False, 'message': 'Invalid parameters supplied'})

    if content == 'info':
        data = last_fm.get_track_info(track_name, artist_name)
        if data is None:
            return jsonify({'success': False,
                            'message': 'I\'m sorry but we do not have enough information about the track you requested'})
        else:
            return jsonify({'success': True, 'track_data': data})
    else:
        data = last_fm.get_track_similar_tracks(track_name, artist_name)
        if data is None:
            return jsonify({'success': False,
                            'message': 'I\'m sorry but we do not have enough information about the track you requested'})
        else:
            return jsonify({'success': True, 'similar_tracks': data})


@APP.route('/album_info', methods=['GET'])
def get_album_info():
    """
    Get data related to album
    """
    album_name = request.args.get('album_name')
    artist_name = request.args.get('artist_name')

    # Check validity of incoming data
    if artist_name is None or album_name is None:
        return jsonify({'success': False, 'message': 'No parameters supplied'})
    if not constants.ALBUM_NAME.match(album_name) or not constants.ARTIST_NAME.match(artist_name):
        return jsonify({'success': False, 'message': 'Invalid parameters supplied'})

    data = last_fm.get_album_info(album_name, artist_name)
    if data is None:
        return jsonify({'success': False,
                        'message': 'I\'m sorry but we do not have enough information about the album you requested'})
    else:
        return jsonify({'success': True, 'album_data': data})


if __name__ == '__main__':
    APP.secret_key = 'someSecret'
    APP.run(debug=True, threaded=True)
