from apiclient.discovery import build
from apiclient.errors import HttpError
from oauth2client.tools import argparser
import pafy

DEVELOPER_KEY = "AIzaSyCsrKjMf7_mHYrT6rIJ-oaA6KL5IYg389A"
YOUTUBE_API_SERVICE_NAME = "youtube"
YOUTUBE_API_VERSION = "v3"


def youtube_search(options):
  youtube = build(YOUTUBE_API_SERVICE_NAME, YOUTUBE_API_VERSION,
    developerKey=DEVELOPER_KEY)

  # Call the search.list method to retrieve results matching the specified
  # query term.
  search_response = youtube.search().list(
    q="Never Give",
    part="id,snippet"
  ).execute()

  videos = []
  channels = []
  playlists = []

  # Add each result to the appropriate list, and then display the lists of
  # matching videos, channels, and playlists.
  for search_result in search_response.get("items", []):
    if search_result["id"]["kind"] == "youtube#video":
      videos.append("%s" % (search_result["id"]["videoId"]))
    
  print videos[0],"/n"

  #Papy audio stream URL

  audio = pafy.new(videos[0])
  print audio.audiostreams[0].url


if __name__ == "__main__":
  argparser.add_argument("--q", help="Search term", default="Google")
  argparser.add_argument("--max-results", help="Max results", default=25)
  args = argparser.parse_args()

  try:
    youtube_search(args)
  except HttpError, e:
    print "An HTTP error %d occurred:\n%s" % (e.resp.status, e.content)
