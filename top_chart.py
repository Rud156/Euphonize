import time

import requests
from lxml import html

from constants import TRACK_IMAGE_PLACEHOLDER, ARTIST_IMAGE_PLACEHOLDER

'''

**Broken Pipe error when refreshed continuosly**

Error due to Unix SIGPIPE signal , happens when utilites receive enough
data , so the head blocks further connections

Can be seen using
import sys
using sys.stdout.write instead of print statement

Fix : Switch from flask server ,to production ready server
OR : Temp fix - flush the sigpipe repeatedly

But shouldn't be an issue when hosted on cloud engines.

'''
HEADER = {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:51.0) Gecko/20100101 Firefox/51.0'
}
MAX_RETRIES = 5


def get_page(url, message, xpaths):
    page = ''
    counter = 0
    while page == '':
        try:
            print(message)
            page = requests.get(url)
            tree = html.fromstring(page.text)

            result_array = []
            for path in xpaths:
                result_array.append(tree.xpath(path))

            return result_array

        except (requests.ConnectionError, requests.ConnectTimeout) as error_message:
            print(error_message)
            if counter > MAX_RETRIES:
                return []
            counter += 1
            print('Connection refused by website , sleeping for 5 secs..')
            for i in range(5):
                print('zzz zz z... .. .')
                time.sleep(1)
            print('Enough sleep, resending request')
            continue


def top_chart():
    url = 'http://www.billboard.com/charts/hot-100'
    xpaths = ['//div/h2[@class="chart-row__song"]/text()',
              '//div/a[@class="chart-row__artist"]/text()']
    xpath_content = get_page(url, 'Getting Top 100 Tracks', xpaths)

    try:
        results = []
        song_title = xpath_content[0]
        song_artist = xpath_content[1]

        for i in range(len(song_artist)):
            data_set = {
                'track_name': song_title[i].strip().title(),
                'artist_name': song_artist[i].strip().title(),
                'image': TRACK_IMAGE_PLACEHOLDER
            }
            results.append(data_set)
        return results

    except IndexError:
        return None


def trending_chart():
    url = 'http://www.billboard.com/charts/radio-songs'
    xpaths = ['//div/h2[@class="chart-row__song"]/text()', '//div/a[@class="chart-row__artist"]/text()',
              '//div[@class="chart-row__image"]/@style']
    xpath_content = get_page(url, 'Getting Trending Songs', xpaths)

    try:
        song_title = xpath_content[0]
        song_artist = xpath_content[1]
        artist_image = xpath_content[2]

        results = []
        for i in range(len(song_artist)):
            data_set = {
                'track_name': song_title[i].strip().title(),
                'artist_name': song_artist[i].strip().title(),
                'artist_image': artist_image[i].strip()[22: artist_image[i].find(')')] if i < len(
                    artist_image) else ARTIST_IMAGE_PLACEHOLDER
            }
            results.append(data_set)
        return results

    except IndexError:
        return None


def emerging_artist():
    url = 'http://www.billboard.com/charts/emerging-artists'
    xpaths = ['//div/a[@class="chart-row__artist"]/text()',
              '//div[@class="chart-row__image"]/@style']
    xpath_content = get_page(url, 'Getting Emerging Artists', xpaths)

    try:
        song_artist = xpath_content[0]
        artist_image = xpath_content[1]

        results = []
        for i in range(len(song_artist)):
            data_set = {
                'artist_name': song_artist[i].strip().title(),
                'artist_image': artist_image[i].strip()[22: artist_image[i].find(')')] if i < len(
                    artist_image) else ARTIST_IMAGE_PLACEHOLDER
            }
            results.append(data_set)
        return results

    except IndexError:
        return None


def top_artist():
    url = 'http://www.billboard.com/charts/artist-100'
    xpaths = ['//div[@class="chart-row__title"]/a/text()',
              '//div[@class="chart-row__image"]/@style']
    xpath_content = get_page(url, 'Getting Top Artists', xpaths)

    try:
        artist_name = xpath_content[0]
        artist_image = xpath_content[1]

        results = []
        for i in range(0, len(artist_image)):
            current_image = artist_image[i][22: artist_image[i].find(')')]
            current_name = artist_name[i].strip()
            data_set = {
                'artist_name': current_name,
                'image': current_image
            }
            results.append(data_set)
        return results

    except IndexError:
        return None


if __name__ == '__main__':
    DATA = trending_chart()
    print(DATA)
