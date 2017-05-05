from lxml import html
import requests
import re
import json

header = {'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:51.0) Gecko/20100101 Firefox/51.0'}


def cover_art(search_term):
    print "Getting cover art for " + search_term
    search_term = re.sub(' +', '+', search_term)

    try:
        page = requests.get('https://www.discogs.com/search/?q=' + search_term + '&type=all', headers=header)
    except (requests.ConnectionError, requests.ConnectTimeout) as e:
        print "Error Occurred " + str(e)
        return None, False

    tree = html.fromstring(page.content)
    image_src = tree.xpath('//div[@id="search_results"]/div/a/span[2]/img/@data-src')
    song_title = tree.xpath('//div[@id="search_results"]/div/h4/a/text()')
    song_artist = tree.xpath('//div[@id="search_results"]/div/h5/span/a/text()')
    if len(image_src) == 0:
        return None, False
    all_results = []
    for i in xrange(0, len(image_src)):
        data_set = {
            'image_url': image_src[i],
            'song_title': song_title[i],
            'artist_name': song_artist[i]
        }
        all_results.append(data_set)

    return all_results, True


def last_fm_cover_art(search_term):
    print "Getting cover art for " + search_term
    track_parts = search_term.split(" - ")

    track = track_parts[0]
    track = track.replace(" ", "%20")
    artist = track_parts[1]
    artist = artist.replace(" ", "%20")

    try:
        response = requests.get("http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=\
        7ede02c397c8cf99bf26e1f8cb9681fa&artist=" + artist + "&track=" + track + "&format=json")
        response = json.loads(response.content)
    except Exception as e:
        print "Error Occurred " + str(e)
        return None, False
    try:
        image = response["track"]["album"]["image"][3]["#text"]
    except KeyError as e:
        print "Error Occurred: " + str(e)
        return None, False
    return image, True


def itunes_album_art(search_term):
    print "Getting cover art for " + search_term
    track_parts = search_term.split(" - ")

    track = track_parts[0]
    track = track.replace(" ", "+")
    artist = track_parts[1]
    artist = artist.replace(" ", "+")

    try:
        response = requests.get("http://itunes.apple.com/WebObjects/MZStoreServices.woa/wa/wsSearch?term="+track+"+"+artist)
        response = json.loads(response.content)
    except Exception as e:
        print "Error Occurred " + str(e)
        return None, False
    try:
        image = response["results"][0]["artworkUrl30"]
        image = image.replace("30x30bb.jpg" , "400x400bb.jpg")
    except (KeyError, IndexError) as e:
        print "Error Occurred: " + str(e)
        return None, False
    return image, True


if __name__ == '__main__':
    query = raw_input('Enter a search term: ')
    results, success = itunes_album_art(query)
    if success:
        print "Got Results"
        print results
    else:
        print "Error Occurred"
