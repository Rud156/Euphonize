import base64
import json
import re

import requests
from lxml import html

API_KEY = '7ede02c397c8cf99bf26e1f8cb9681fa'
HEADER = {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:51.0) Gecko/20100101 Firefox/51.0'
}


def cover_art(search_term):
    print('Getting cover art for ' + search_term)
    search_term = re.sub(' +', '+', search_term)

    try:
        page = requests.get('https://www.discogs.com/search/?q=' +
                            search_term + '&type=all', headers=HEADER)
    except (requests.ConnectionError, requests.ConnectTimeout) as exception_value:
        print('Error Occurred ' + str(exception_value))
        return None, False

    tree = html.fromstring(page.text)
    image_src = tree.xpath(
        '//div[@id="search_results"]/div/a/span[2]/img/@data-src')
    song_title = tree.xpath('//div[@id="search_results"]/div/h4/a/text()')
    song_artist = tree.xpath(
        '//div[@id="search_results"]/div/h5/span/a/text()')

    if len(image_src) is 0:
        return None, False

    all_results = []
    for i in range(0, len(image_src)):
        data_set = {
            'image_url': image_src[i],
            'song_title': song_title[i],
            'artist_name': song_artist[i]
        }
        all_results.append(data_set)

    return all_results, True


def last_fm_cover_art(track_name, artist_name):
    print(f'Getting cover art for {track_name} {artist_name}')

    track = track_name
    track = track.replace(' ', '%20')
    artist = artist_name
    artist = artist.replace(' ', '%20')

    image = None
    request_success = True

    try:
        last_fm_track_url = f'http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=' \
                            f'{API_KEY}&artist=' + artist + '&track=' + track + '&format=json'
        print(last_fm_track_url)
        response = requests.get(last_fm_track_url)
        response = json.loads(response.text)
        image = response['track']['album']['image'][3]['#text']
    except (KeyError, requests.ConnectionError, requests.ConnectTimeout) as exception_value:
        print('Error Occurred ' + str(exception_value))
        request_success = False

    if not request_success:
        try:
            last_fm_artist_url = f'http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&' \
                                 f'artist={artist_name}&api_key={API_KEY}&format=json'
            print(last_fm_artist_url)
            response = requests.get(last_fm_artist_url)
            response = json.loads(response.text)
            image = response['artist']['image'][3]['#text']
            request_success = True
        except (KeyError, requests.ConnectionError, requests.ConnectTimeout) as exception_value:
            print('Error Occurred: ' + str(exception_value))
            request_success = False

    if not request_success:
        return None, False
    return image, True


def itunes_album_art(search_term):
    print('Getting cover art for ' + search_term)
    track_parts = search_term.split(' - ')

    track = track_parts[0]
    track = track.replace(' ', '+')
    artist = track_parts[1]
    artist = artist.replace(' ', '+')

    try:
        response = requests.get(
            'http://ax.itunes.apple.com/WebObjects/MZStoreServices.woa/wa/wsSearch?term=' + track + '+' + artist)
        response = json.loads(response.text)
    except Exception as exception_value:
        print('Error Occurred ' + str(exception_value))
        return None, False

    try:
        image = response['results'][0]['artworkUrl30']
        image = image.replace('30x30bb.jpg', '400x400bb.jpg')
    except (KeyError, IndexError) as exception_value:
        print('Error Occurred: ' + str(exception_value))
        return None, False

    return image, True


if __name__ == '__main__':
    QUERY = input('Enter a search term: ')
    RESULTS, SUCCESS = itunes_album_art(QUERY)
    if SUCCESS:
        print('Got Results')
        print(RESULTS)
    else:
        print('Error Occurred')
