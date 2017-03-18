import requests
import json


def top_tracks():
    data = requests.get('http://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks' +
                        '&api_key=7ede02c397c8cf99bf26e1f8cb9681fa&format=json')
    data = json.loads(data.content)
    all_tracks = data['tracks']['track']
    tracks = []
    for i in xrange(0, len(all_tracks)):
        data_set = {
            'name': all_tracks[i]['name'],
            'artist': all_tracks[i]['artist']['name'],
            'image': all_tracks[i]['image'][2]['#text']
        }
        tracks.append(data_set)
    return tracks


def top_artists():
    data = requests.get('http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&'
                        + 'api_key=7ede02c397c8cf99bf26e1f8cb9681fa&format=json&limit=100')
    data = json.loads(data.content)
    all_artists = data['artists']['artist']
    artists = []
    for i in xrange(0, len(all_artists)):
        data_set = {
            'name': all_artists[i]['name'],
            'image': all_artists[i]['image'][2]['#text']
        }
        artists.append(data_set)
    return artists


def top_tags():
    data = requests.get('http://ws.audioscrobbler.com/2.0/?method=chart.gettoptags' +
                        '&api_key=7ede02c397c8cf99bf26e1f8cb9681fa&format=json&limit=20')
    data = json.loads(data.content)
    all_tags = data['tags']['tag']
    tags = []
    for i in xrange(0, len(all_tags)):
        tags.append(all_tags[i]['name'])
    return tags


def top_albums():
    all_tags = top_tags()
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
                        '&api_key=7ede02c397c8cf99bf26e1f8cb9681fa&format=json&limit=100')
    data = json.loads(data.content)
    all_tracks = data['toptracks']['track']
    tracks = []
    for i in xrange(0, len(all_tracks)):
        data_set = {
            'name': all_tracks[i]['name'],
            'artist': all_tracks[i]['artist']['name'],
            'image': all_tracks[i]['image'][2]['#text']
        }
        print data_set
        tracks.append(data_set)
    return tracks


def get_artist_top_albums(artist_name):
    artist_name = artist_name.replace(" ", "%20")
    data = requests.get('http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=' + artist_name +
                        '&api_key=7ede02c397c8cf99bf26e1f8cb9681fa&format=json&limit=100')
    data = json.loads(data.content)
    all_albums = data['topalbums']['album']
    albums = []
    for i in xrange(0, len(all_albums)):
        data_set = {
            'name': all_albums[i]['name'],
            'artist': all_albums[i]['artist']['name'],
            'image': all_albums[i]['image'][2]['#text']
        }
        albums.append(data_set)
    return albums


def get_albums_for_tags(tag_name, limit):
    data = requests.get('http://ws.audioscrobbler.com/2.0/?method=tag.gettopalbums&tag=' + tag_name +
                        '&api_key=7ede02c397c8cf99bf26e1f8cb9681fa&format=json&limit=' + str(limit))
    data = json.loads(data.content)
    all_albums = data['albums']['album']
    albums = []
    for i in xrange(0, len(all_albums)):
        data_set = {
            'name': all_albums[i]['name'],
            'artist': all_albums[i]['artist']['name'],
            'image': all_albums[i]['image'][2]['#text']
        }
        albums.append(data_set)
    return albums


def get_tracks_for_tags(tag_name):
    data = requests.get('http://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag=' + tag_name +
                        '&api_key=7ede02c397c8cf99bf26e1f8cb9681fa&format=json&limit=100')
    data = json.loads(data.content)
    all_tracks = data['tracks']['track']
    tracks = []
    for i in xrange(0, len(all_tracks)):
        data_set = {
            'name': all_tracks[i]['name'],
            'artist': all_tracks[i]['artist']['name'],
            'image': all_tracks[i]['image'][2]['#text']
        }
        tracks.append(data_set)
    return tracks


if __name__ == '__main__':
    info = get_albums_for_tags('pop', 100)
    print info
