import re

AUDIO_TITLE = re.compile(r"[\w+.,'-] - [\w+.,'-]")
ALBUM_NAME = ARTIST_NAME = TRACK_NAME = re.compile(r"^[a-zA-Z0-9 ,.'-]+$")
MEDIA_DATA_TYPE = re.compile(r'(user_cu|billboard)')
ARTIST_DATA_TYPE = re.compile(r'(tracks|albums)')
POPULAR_DATA_TYPE = re.compile(r'(tags|albums|tracks)')
TAG_NAME = re.compile(r'\w+')
ARTIST_INFO = re.compile(r'(info|similar_artists)')
