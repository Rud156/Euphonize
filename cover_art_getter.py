from lxml import html
import requests
import re

header = {'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:51.0) Gecko/20100101 Firefox/51.0'}


def cover_art(search_term):
    print "Getting cover art for " + search_term
    search_term = re.sub(' +', '+', search_term)

    try:
        page = requests.get('https://www.discogs.com/search/?q=' + search_term + '&type=all', headers=header)
    except (requests.ConnectionError, requests.ConnectTimeout) as e:
        print "Error Occurred " + e
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


if __name__ == '__main__':
    query = raw_input('Enter a search term: ')
    results, success = cover_art(query)
    if success:
        print "Got Results"
    else:
        print "Error Occurred"
