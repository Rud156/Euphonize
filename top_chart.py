import json
import time
from lxml import html
import requests

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
header = {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:51.0) Gecko/20100101 Firefox/51.0'
}


def top_chart():
    page = ''
    while page == '':
        try:
            print('Getting emerging artists....')
            page = requests.get('http://www.billboard.com/charts/hot-100')
            tree = html.fromstring(page.text)

            song_title = tree.xpath(
                '//div/h2[@class="chart-row__song"]/text()')
            song_artist = tree.xpath(
                '//div/a[@class="chart-row__artist"]/text()')

            results = []
            for i in range(len(song_artist)):
                data_set = {
                    'track_name': song_title[i].strip().title(),
                    'artist_name': song_artist[i].strip().title()
                }
                results.append(data_set)
            return results

        except requests.exceptions.ConnectionError:
            print('Connection refused by website , sleeping for 5 secs..')
            for i in range(5):
                print('zzz zz z... .. .')
                time.sleep(1)
            print('Enough sleep, resending request')
            continue


def trending_chart():
    page = ''
    while page == '':
        try:
            print('Getting trending songs...')
            page = requests.get(
                'http://www.billboard.com/charts/radio-songs')
            tree = html.fromstring(page.text)

            song_title = tree.xpath(
                '//div/h2[@class="chart-row__song"]/text()')
            song_artist = tree.xpath(
                '//div/a[@class="chart-row__artist"]/text()')
            artist_image = tree.xpath(
                '//div[@class="chart-row__image"]/@style')

            results = []
            for i in range(len(song_artist)):
                data_set = {
                    'track_name': song_title[i].strip().title(),
                    'artist_name': song_artist[i].strip().title(),
                    'artist_image':  artist_image[i].strip().replace(')', '')
                    .replace('background-image: url(', '') if i < len(artist_image) else None
                }
                results.append(data_set)
            return results

        except requests.exceptions.ConnectionError:
            print('Connection refused by website , sleeping for 5 secs..')
            for i in range(5):
                print('zzz zz z... .. .')
                time.sleep(1)
            print('Enough sleep, resending request')
            continue


def emerging_artist():
    page = ''
    while page == '':
        try:
            print('Getting trending songs...')
            page = requests.get(
                'http://www.billboard.com/charts/emerging-artists')
            tree = html.fromstring(page.text)

            song_artist = tree.xpath(
                '//div/a[@class="chart-row__artist"]/text()')
            artist_image = tree.xpath(
                '//div[@class="chart-row__image"]/@style')

            results = []
            for i in range(len(song_artist)):
                data_set = {
                    'artist_name': song_artist[i].strip().title(),
                    'artist_image':  artist_image[i].strip().replace(')', '')
                    .replace('background-image: url(', '') if i < len(artist_image) else None
                }
                results.append(data_set)
            return results

        except requests.exceptions.ConnectionError:
            print('Connection refused by website , sleeping for 5 secs..')
            for i in range(5):
                print('zzz zz z... .. .')
                time.sleep(1)
            print('Enough sleep, resending request')
            continue


def top_artist():
    page = ''
    while page == '':
        try:
            print('Getting top artist... ')
            page = requests.get('http://www.billboard.com/charts/artist-100')
            tree = html.fromstring(page.text)
            artist_name = tree.xpath(
                '//div[@class="chart-row__title"]/a/text()')
            artist_image = tree.xpath(
                '//div[@class="chart-row__image"]/@style')

            top = []
            for i in range(0, len(artist_image)):
                current_image = artist_image[i][artist_image[i].find(
                    'http://'): artist_image[i].find(')')]
                current_name = artist_name[i].strip()
                data_set = {
                    'artist_name': current_name,
                    'image': current_image
                }
                top.append(data_set)
            return top

        except requests.exceptions.ConnectionError:
            print('Connection refused by website , sleeping for 5 secs..')
            print('zzz zz z... .. .')
            time.sleep(5)
            print('Enough sleep, resending request')
            continue


if __name__ == '__main__':
    DATA = trending_chart()
    print(DATA)
