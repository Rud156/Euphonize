import json
import requests

API_KEY = '7ede02c397c8cf99bf26e1f8cb9681fa'


def get_search_result(search_query):
    try:
        data = requests.get(f'https://ws.audioscrobbler.com/2.0/?method=track.search&track={search_query}' +
                            f'&api_key={API_KEY}&format=json')
        return json.loads(data.text)
    except (requests.ConnectTimeout, requests.ConnectionError) as error_message:
        print(error_message)
        return None
