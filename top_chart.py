from lxml import html
import requests
import json

header = {'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:51.0) Gecko/20100101 Firefox/51.0'}

def top_chart():
	print "Getting top songs...."
	page = requests.get("http://www.billboard.com/charts/hot-100")
	tree = html.fromstring(page.content)

	song_title = tree.xpath("//div/h2[@class = 'chart-row__song']/text()")
	song_Artist = tree.xpath("//div/a[@class = 'chart-row__artist']/text()")
	
	for i in range(len(song_Artist)):
		song_Artist[i] = song_Artist[i].strip()

	results_top_chart = dict(zip(song_title , song_Artist))
	return results_top_chart

def emerge_chart():
	print "Getting top songs...."
	page = requests.get("http://realtime.billboard.com/tracks/?chart=3&chartName=Emerging&limit=100&offset=0")
	page = json.loads(page.content)

	song_title = []
	song_Artist = []
	res_page = page['results']
	for i in range(len(res_page)):
		song_title.append(res_page[i]['track_name'])
		song_Artist.append(res_page[i]['artist_name'])
	
	results_emerge_chart = dict(zip(song_title , song_Artist))
	return results_emerge_chart

def trending_chart():
	print "Getting trending songs..."
	page = requests.get("http://realtime.billboard.com/tracks/?chart=2&chartName=jim@billboard.com&limit=20&offset=0")
	page = json.loads(page.content)

	song_title = []
	song_Artist = []
	res_page = page['results']
	for i in range(len(res_page)):
		song_title.append(res_page[i]['track_name'])
		song_Artist.append(res_page[i]['artist_name'])
	results_trending_chart = dict(zip(song_title , song_Artist))
	return results_trending_chart

def top_artist():
	print "Getting top artist... "
	page = requests.get("http://www.billboard.com/charts/artist-100")
	tree = html.fromstring(page.content)

	song_Artist = tree.xpath("//div/h2[@class = 'chart-row__song']/text()")
	#Artist_img = tree.xpath("//div[@class = 'chart-row__image']/@style , 'background-image:url("'), '")'")
	
	for i in range(len(song_Artist)):
		song_Artist[i] = song_Artist[i].strip()

	results_top_chart = dict(zip(song_Artist , Artist_img))
	return results_top_chart
if __name__ == '__main__':
	
	# Run funciton here
	x = top_artist()
	print x