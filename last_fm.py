import json
import urllib.error
import urllib.parse
import urllib.request

import requests

API_KEY = '7ede02c397c8cf99bf26e1f8cb9681fa'


def get_api_contents(url):
    try:
        data = requests.get(url)
        return json.loads(data.text)
    except (requests.ConnectTimeout, requests.ConnectionError) as error_message:
        print(error_message)
        return None


def top_tracks():
    url = 'http://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks' + \
          '&api_key=' + API_KEY + '&format=json'
    data = get_api_contents(url)
    if data is None:
        return None

    all_tracks = data['tracks']['track']
    tracks = []
    for i in range(0, len(all_tracks)):
        data_set = {
            'track_name': all_tracks[i]['name'],
            'artist_name': all_tracks[i]['artist']['name'],
            'image': all_tracks[i]['image'][3]['#text']
        }
        tracks.append(data_set)
    return tracks


def top_artists():
    url = 'http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&' + \
          'api_key=' + API_KEY + '&format=json&limit=30'
    data = get_api_contents(url)
    if data is None:
        return None

    all_artists = data['artists']['artist']
    artists = []
    for i in range(0, len(all_artists)):
        data_set = {
            'artist_name': all_artists[i]['name'],
            'image': all_artists[i]['image'][3]['#text']
        }
        artists.append(data_set)
    return artists


def top_tags():
    url = 'http://ws.audioscrobbler.com/2.0/?method=chart.gettoptags' + \
          '&api_key=' + API_KEY + '&format=json&limit=20'
    data = get_api_contents(url)
    if data is None:
        return None

    all_tags = data['tags']['tag']
    tags = []
    for i in range(0, len(all_tags)):
        tags.append(all_tags[i]['name'])
    return tags


def top_albums():
    all_tags = top_tags()
    all_tags = all_tags[:10]
    albums = []
    temp_albums = []

    for i in range(0, len(all_tags)):
        tag_albums = get_albums_for_tags(all_tags[i], 5)
        for j in range(0, len(tag_albums)):
            temp_albums.append({
                'score': i + j,
                'album': tag_albums[j]
            })

    temp_albums.sort(key=lambda a: a['score'])
    for i in range(0, len(temp_albums)):
        if i >= 20:
            break

        albums.append(temp_albums[i]['album'])

    return albums


def get_artist_top_tracks(artist_name):
    artist_name = urllib.parse.quote_plus(artist_name)

    url = 'http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=' + artist_name + \
          '&api_key=' + API_KEY + '&format=json&limit=100'
    data = get_api_contents(url)
    if data is None:
        return None

    all_tracks = data['toptracks']['track']
    tracks = []
    for i in range(0, len(all_tracks)):
        tracks.append(all_tracks[i]['name'])
    return tracks


def get_artist_top_albums(artist_name):
    artist_name = urllib.parse.quote_plus(artist_name)

    url = 'http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=' + artist_name + \
          '&api_key=' + API_KEY + '&format=json&limit=100'
    data = get_api_contents(url)
    if data is None:
        return None

    all_albums = data['topalbums']['album']
    albums = []
    for i in range(0, len(all_albums)):
        data_set = {
            'album_name': all_albums[i]['name'],
            'artist_name': all_albums[i]['artist']['name'],
            'image': all_albums[i]['image'][3]['#text']
        }
        albums.append(data_set)
    return albums


def get_artist_similar_artists(artist_name):
    artist_name = urllib.parse.quote_plus(artist_name)

    url = 'http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=' + artist_name + \
          '&api_key=7ede02c397c8cf99bf26e1f8cb9681fa&format=json'
    data = get_api_contents(url)
    if data is None:
        return None

    artists = []
    try:
        all_artists = data['similarartists']['artist']
        for artist in all_artists:
            data_set = {
                'artist_name': artist['name'],
                'image': artist['image'][3]['#text']
            }
            artists.append(data_set)
        return artists

    except KeyError:
        return None


def get_albums_for_tags(tag_name, limit):
    url = 'http://ws.audioscrobbler.com/2.0/?method=tag.gettopalbums&tag=' + tag_name + \
          '&api_key=' + API_KEY + '&format=json&limit=' + str(limit)
    data = get_api_contents(url)
    if data is None:
        return None

    all_albums = data['albums']['album']
    albums = []
    for i in range(0, len(all_albums)):
        data_set = {
            'album_name': all_albums[i]['name'],
            'artist_name': all_albums[i]['artist']['name'],
            'image': all_albums[i]['image'][3]['#text']
        }
        albums.append(data_set)
    return albums


def get_tracks_for_tags(tag_name):
    url = 'http://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag=' + tag_name + \
          '&api_key=' + API_KEY + '&format=json&limit=25'
    data = get_api_contents(url)
    if data is None:
        return None

    all_tracks = data['tracks']['track']
    tracks = []
    for i in range(0, len(all_tracks)):
        data_set = {
            'track_name': all_tracks[i]['name'],
            'artist_name': all_tracks[i]['artist']['name'],
            'image': all_tracks[i]['image'][3]['#text']
        }
        tracks.append(data_set)
    return tracks


def get_album_info(album_name, artist_name):
    album_name = urllib.parse.quote_plus(album_name)
    artist_name = urllib.parse.quote_plus(artist_name)

    url = 'http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=' + API_KEY + '&artist=' + \
          artist_name + '&album=' + album_name + '&format=json'
    data = get_api_contents(url)
    if data is None:
        return None

    try:
        data_set = {
            'album_name': data['album']['name'],
            'artist_name': data['album']['artist'],
            'image': data['album']['image'][3]['#text'],
            'summary': data['album']['wiki']['summary']
        }

        tracks = []
        for track in data['album']['tracks']['track']:
            tracks.append(track['name'])
        if len(tracks) == 0:
            return None

        data_set['tracks'] = tracks
        return data_set
    except KeyError:
        return None


def get_artist_info(artist_name):
    artist_name = urllib.parse.quote_plus(artist_name)

    url = 'http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=' + artist_name + \
          '&api_key=' + API_KEY + '&format=json'
    data = get_api_contents(url)
    if data is None:
        return None

    try:
        data_set = {
            'artist_name': data['artist']['name'],
            'image': data['artist']['image'][3]['#text'],
            'summary': data['artist']['bio']['summary']
        }

        similar_artists = []
        for similar in data['artist']['similar']['artist']:
            current_artist = {
                'artist_name': similar['name'],
                'image': similar['image'][3]['#text']
            }
            similar_artists.append(current_artist)

        if len(similar_artists) == 0:
            return None

        data_set['similar_artists'] = similar_artists
        return data_set
    except KeyError:
        return None


def get_track_info(track_name, artist_name):
    track_name = urllib.parse.quote_plus(track_name)
    artist_name = urllib.parse.quote_plus(artist_name)

    url = f'http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key={API_KEY}&artist={artist_name}' \
          f'&track={track_name}&format=json'
    data = get_api_contents(url)
    if data is None:
        return None

    try:
        data_set = {
            'track_name': data['track']['name'],
            'album_name': data['track']['album']['title'],
            'artist_name': data['track']['artist']['name'],
            'image': data['track']['album']['image'][3]['#text'],
            'summary': data['track']['wiki']['summary'] if 'wiki' in data['track'] else 'No Summary Available',
            'published': data['track']['wiki']['published'] if 'wiki' in data['track'] else 'No Publish Date Available'
        }
        return data_set
    except KeyError:
        return None


if __name__ == '__main__':
    INFO = top_artists()
    print(INFO)
