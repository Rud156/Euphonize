import re

AUDIO_TITLE = re.compile(r"[\w+.,'-] - [\w+.,'-]")
ALBUM_NAME = ARTIST_NAME = TRACK_NAME = re.compile(r"^.*$")
MEDIA_DATA_TYPE = re.compile(r'(user_cu|billboard)')
ARTIST_DATA_TYPE = re.compile(r'(tracks|albums)')
POPULAR_DATA_TYPE = re.compile(r'(tags|albums|tracks)')
TAG_NAME = re.compile(r'\w+')
ARTIST_INFO = re.compile(r'(info|similar_artists)')

TRACK_IMAGE_PLACEHOLDER = 'https://static.tumblr.com/uqie0nv/1vIn5g72i/default_album_art.png'
ARTIST_IMAGE_PLACEHOLDER = 'https://d3uscstcbhvk7k.cloudfront.net/static/images/slider-placeholder-2x.png'
