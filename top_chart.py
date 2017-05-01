from lxml import html
import requests
import json

header = {'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:51.0) Gecko/20100101 Firefox/51.0'}


def top_chart():
    print "Getting top songs...."
    page = requests.get("http://www.billboard.com/charts/hot-100")
    tree = html.fromstring(page.content)

    song_title = tree.xpath("//div/h2[@class = 'chart-row__song']/text()")
    song_artist = tree.xpath("//div/a[@class = 'chart-row__artist']/text()")
    results = []
    for i in range(len(song_artist)):
        data_set = {
            'track_name': song_title[i].strip().title(),
            'artist_name': song_artist[i].strip().title()
        }
        results.append(data_set)
    return results


def emerge_chart():
    print "Getting top songs...."
    page = requests.get("http://realtime.billboard.com/tracks/?chart=3&chartName=Emerging&limit=100&offset=0")
    page = json.loads(page.content)
    results = []
    res_page = page['results']
    for i in range(len(res_page)):
        data_set = {
            'track_name': res_page[i]['track_name'],
            'artist_name': res_page[i]['artist_name'],
            'image': res_page[i]['artist_image']
        }
        results.append(data_set)
    return results


def trending_chart():
    print "Getting trending songs..."
    page = requests.get("http://realtime.billboard.com/tracks/?chart=2&chartName=jim@billboard.com&limit=20&offset=0")
    page = json.loads(page.content)
    res_page = page['results']
    results = []
    for i in range(len(res_page)):
        data_set = {
            'track_name': res_page[i]['track_name'],
            'artist_name': res_page[i]['artist_name'],
            'image': res_page[i]['artist_image']
        }
        results.append(data_set)
    return results


def top_artist():
    print "Getting top artist... "
    page = requests.get("http://www.billboard.com/charts/artist-100")
    tree = html.fromstring(page.content)
    artist_name = tree.xpath("//div/h2[@class = 'chart-row__song']/text()")
    artist_image = tree.xpath("//div[@class = 'chart-row__image']/@style")

    top = []
    for i in xrange(0, len(artist_image)):
        current_image = artist_image[i][artist_image[i].find("http://"): artist_image[i].find(")")]
        current_name = artist_name[i].strip()
        data_set = {
            'artist_name': current_name,
            'image': current_image
        }
        top.append(data_set)
    return top

if __name__ == '__main__':
    data = emerge_chart()
    print data
