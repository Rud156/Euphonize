from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from oauth2client.tools import argparser

DEVELOPER_KEY = 'AIzaSyCsrKjMf7_mHYrT6rIJ-oaA6KL5IYg389A'
YOUTUBE_API_SERVICE_NAME = 'youtube'
YOUTUBE_API_VERSION = 'v3'


def youtube_search(options):
    youtube = build(YOUTUBE_API_SERVICE_NAME, YOUTUBE_API_VERSION,
                    developerKey=DEVELOPER_KEY)

    search_response = youtube.search().list(
        q=options['q'],
        part='id,snippet',
        maxResults=options['max_results']
    ).execute()

    videos = []

    # Add each result to the appropriate list, and then display the lists of
    # matching videos, channels, and playlists.
    for search_result in search_response.get('items', []):
        if search_result['id']['kind'] == 'youtube#video':
            videos.append(search_result['id']['videoId'])
    return videos


if __name__ == '__main__':
    argparser.add_argument('--q', help='Search term', default='Google')
    argparser.add_argument('--max-results', help='Max results', default=25)
    ARGUMENTS = argparser.parse_args()

    try:
        RESULTS = youtube_search(
            {'q': ARGUMENTS.q, 'max_results': ARGUMENTS.max_results})
        print(RESULTS)
    except HttpError as exception_value:
        print('An HTTP error %d occurred:\n%s' %
              (exception_value.resp.status, exception_value.content))
