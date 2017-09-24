import requests
import pafy
import json
from cover_art_getter import itunes_album_art
import os
import urllib.request
import urllib.parse
import urllib.error

pafy.set_api_key('AIzaSyCsrKjMf7_mHYrT6rIJ-oaA6KL5IYg389A')
API_KEY = '7ede02c397c8cf99bf26e1f8cb9681fa'

'''
Get Music title
    Artist Name
    Year Production
    Genre
    Album Name
    Album Art # Useitunes

'''


def pirate_music(music_id, title, artist):

    audio = pafy.new(music_id)
    audio_a = audio.getbestaudio()
    itunes_search = title + ' - ' + artist
    title_n = title.replace(' ', '_')
    file_off = audio_a.download('./tmp/' + title_n)
    # file_off = ('./tmp/Want_You_Back')

    try:
        album_art = itunes_album_art(itunes_search)
        album_art = urllib.request.urlretrieve(
            album_art[0], './tmp/artwork/' + title_n + '.jpg')
        print(album_art)
    except Exception as exception_value:
        print(('Unable to find artwork , setting default artwork. Error : ' + str()))
        album_art = './tmp/artwork/default.png'

    print(('Getting Track info for ' + title + '....'))
    try:
        page = requests.get('http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=' +
                            API_KEY + '&artist=' + artist + '&track=' + title + '&format=json')
        page = json.loads(page.text)
    except Exception as exception_value:
        print(('Error in getting Artist data : ' + str()))
        return None

    try:
        album = page['track']['album']['title']
    except Exception as exception_value:
        print(('Unalble to extract data from JSON data : ' + str()))
        album = ' '

    try:
        genre = page['track']['toptags']['tag'][0]['name']
        # genre.append(page['track']['toptags']['tag'][1]['name'])
    except Exception as exception_value:
        print('Unable to find data')
        # Fix : Adding multiple Genres
        genre = ' '

    print('---------------------------------')
    print((album, genre))
    print(file_off)
    print(title)
    print(album_art)
    print((artist, genre))
    print('---------------------------------')
    new_file = './tmp/fumen_' + title_n + '.mp3'

    # Converting m4a to mp3
    convert_exe = 'ffmpeg -i ' + file_off + ' ' + new_file
    os.system(convert_exe)

    # Adding metadata to mp3 file
    # CLI for ref:
    # ffmpeg -i in.mp3 -i test.png -map 0:0 -map 1:0 -c copy -id3v2_version 3 -metadata:s:v title='Album cover' -metadata:s:v comment='Cover (Front)' out.mp3

    # update_exe = 'ffmpeg -i ' + new_file + ' -i ' + album_art[0] + ' -map 0:0 -map 1:0 -c copy -id3v2_version 3 \
    #             -metadata:s:v title='' + title + '' -metadata:s:v artist='' + artist + '' -metadata:s:v genre='' + genre + '' \
    #             -metadata:s:v comment='Cover(Front)' ' + new_file
    # print(update_exe)
    # os.system(update_exe)
    # print((new_file + ' updated added metadata , converted to mp3'))


# Uncomment to Run for test
pirate_music('https://www.youtube.com/watch?v=D7krrRoJpT0',
             'Want You Back', 'Haim')
