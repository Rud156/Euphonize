from re import finditer
from urllib.parse import unquote

import requests
from lxml import html

header = {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:51.0) Gecko/20100101 Firefox/51.0'
}
ALL_VIDEO_URLS = []


def get_links(link):
    print('Getting link ' + link)
    try:
        page = requests.get(link, headers=header)
        tree = html.fromstring(page.text)
        main_script = tree.xpath(
            '//script[contains(string(), "var ytplayer=ytplayer")]')
        main_text = main_script[0].text_content()
        video_list = [m.start()
                      for m in finditer('url=https%3A%2F%2F', main_text)]
        print('Total Videos: ' + str(len(video_list)))
        video_url_details = []
        for i in range(0, len(video_list)):
            data_set = {}
            string = ''
            ending_index = 0
            for j in range(video_list[i] + 4, len(main_text)):
                if main_text[j] == '\\' or main_text[j] == ',':
                    break
                string += main_text[j]
                ending_index = j
            string = unquote(string)
            data_set['url'] = string
            print(string)

            audioIndex = string.find('mime%3Daudio')
            if audioIndex != -1:
                data_set['type'] = 'audio'
            else:
                videoIndex = string.find('mime%3Dvideo')
                if videoIndex != -1:
                    data_set['type'] = 'video'
                else:
                    data_set['type'] = 'undefined'

            sub_string = main_text[ending_index: ending_index + 200]
            index = sub_string.find('bitrate=')
            if index != -1:
                index = ending_index + index
                index += 8
                bitrate = ''
                for j in range(index, len(main_text)):
                    if not main_text[j].isdigit():
                        break
                    bitrate += main_text[j]
                data_set['bitrate'] = int(bitrate)
                data_set['important'] = True
            else:
                data_set['bitrate'] = -1
                data_set['important'] = False

            video_url_details.append(data_set)
        return video_url_details
    except (requests.ConnectionError, requests.ConnectTimeout) as exception_value:
        print('Error Occurred: ' + str(exception_value))


def BestAudio():
    print('Getting Best Audio Link: ')
    best_bitrate = 0
    url = ''
    for i in range(0, len(ALL_VIDEO_URLS)):
        if ALL_VIDEO_URLS[i]['type'] == 'audio':
            if ALL_VIDEO_URLS[i]['bitrate'] > best_bitrate:
                best_bitrate = ALL_VIDEO_URLS[i]['bitrate']
                url = ALL_VIDEO_URLS[i]['url']
    print(url)


def BestVideo():
    print('Getting Best Video Link: ')
    best_bitrate = 0
    url = ''
    for i in range(0, len(ALL_VIDEO_URLS)):
        if ALL_VIDEO_URLS[i]['type'] == 'video':
            if ALL_VIDEO_URLS[i]['bitrate'] > best_bitrate:
                best_bitrate = ALL_VIDEO_URLS[i]['bitrate']
                url = ALL_VIDEO_URLS[i]['url']
    print(url)


if __name__ == '__main__':
    global ALL_VIDEO_URLS
    ALL_VIDEO_URLS = get_links('https://www.youtube.com/watch?v=ZiYdOwOrGyc')
    BestAudio()
    BestVideo()
    #
