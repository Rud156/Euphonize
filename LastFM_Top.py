import requests
import json

API_KEY = '7ede02c397c8cf99bf26e1f8cb9681fa'


def top_tracks():
    data = requests.get('http://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks' +
                        '&api_key=' + API_KEY + '&format=json')
    data = json.loads(data.content)
    all_tracks = data['tracks']['track']
    tracks = []
    for i in xrange(0, len(all_tracks)):
        data_set = {
            'track_name': all_tracks[i]['name'],
            'artist_name': all_tracks[i]['artist']['name'],
            'image': all_tracks[i]['image'][3]['#text']
        }
        tracks.append(data_set)
    return tracks


def top_artists():
    data = requests.get('http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&'
                        + 'api_key=' + API_KEY + '&format=json&limit=100')
    data = json.loads(data.content)
    all_artists = data['artists']['artist']
    artists = []
    for i in xrange(0, len(all_artists)):
        data_set = {
            'artist_name': all_artists[i]['name'],
            'image': all_artists[i]['image'][3]['#text']
        }
        artists.append(data_set)
    return artists


def top_tags():
    data = requests.get('http://ws.audioscrobbler.com/2.0/?method=chart.gettoptags' +
                        '&api_key=' + API_KEY + '&format=json&limit=20')
    data = json.loads(data.content)
    all_tags = data['tags']['tag']
    tags = []
    for i in xrange(0, len(all_tags)):
        tags.append(all_tags[i]['name'])
    return tags


def top_albums():
    all_tags = top_tags()
    all_tags = all_tags[:10]
    albums = []
    temp_albums = []

    for i in xrange(0, len(all_tags)):
        temp_albums.append(get_albums_for_tags(all_tags[i], 5))

    for i in xrange(0, len(temp_albums[0])):
        for j in xrange(0, len(temp_albums)):
            albums.append(temp_albums[j][i])
    return albums


def get_artist_top_tracks(artist_name):
    artist_name = artist_name.replace(" ", "%20")
    data = requests.get('http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=' + artist_name +
                        '&api_key=' + API_KEY + '&format=json&limit=100')
    data = json.loads(data.content)
    all_tracks = data['toptracks']['track']
    tracks = []
    for i in xrange(0, len(all_tracks)):
        data_set = {
            'track_name': all_tracks[i]['name'],
            'artist_name': all_tracks[i]['artist']['name'],
            'image': all_tracks[i]['image'][3]['#text']
        }
        print data_set
        tracks.append(data_set)
    return tracks


def get_artist_top_albums(artist_name):
    artist_name = artist_name.replace(" ", "%20")
    data = requests.get('http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=' + artist_name +
                        '&api_key=' + API_KEY + '&format=json&limit=100')
    data = json.loads(data.content)
    all_albums = data['topalbums']['album']
    albums = []
    for i in xrange(0, len(all_albums)):
        data_set = {
            'album_name': all_albums[i]['name'],
            'artist_name': all_albums[i]['artist']['name'],
            'image': all_albums[i]['image'][3]['#text']
        }
        albums.append(data_set)
    return albums


def get_albums_for_tags(tag_name, limit):
    data = requests.get('http://ws.audioscrobbler.com/2.0/?method=tag.gettopalbums&tag=' + tag_name +
                        '&api_key=' + API_KEY + '&format=json&limit=' + str(limit))
    data = json.loads(data.content)
    all_albums = data['albums']['album']
    albums = []
    for i in xrange(0, len(all_albums)):
        data_set = {
            'album_name': all_albums[i]['name'],
            'artist_name': all_albums[i]['artist']['name'],
            'image': all_albums[i]['image'][3]['#text']
        }
        albums.append(data_set)
    return albums


def get_tracks_for_tags(tag_name):
    data = requests.get('http://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag=' + tag_name +
                        '&api_key=' + API_KEY + '&format=json&limit=100')
    data = json.loads(data.content)
    all_tracks = data['tracks']['track']
    tracks = []
    for i in xrange(0, len(all_tracks)):
        data_set = {
            'track_name': all_tracks[i]['name'],
            'artist_name': all_tracks[i]['artist']['name'],
            'image': all_tracks[i]['image'][3]['#text']
        }
        tracks.append(data_set)
    return tracks


def get_album_info(album_name, artist_name):
    album_name = album_name.replace(' ', '%20')
    artist_name = artist_name.replace(' ', '%20')
    data = requests.get('http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=' + API_KEY + '&artist='
                        + artist_name + '&album=' + album_name + '&format=json')
    data = json.loads(data.content)

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
    artist_name = artist_name.replace(' ', '%20')
    data = requests.get('http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=' + artist_name +
                        '&api_key=' + API_KEY + '&format=json')
    data = json.loads(data.content)
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


if __name__ == '__main__':
    info = top_tags()
    print info
