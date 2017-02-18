import requests
from lxml import html
from re import finditer
from urllib2 import unquote

header = {'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:51.0) Gecko/20100101 Firefox/51.0'}
allVideoUrls = []


def get_links(link):
    print "Getting link " + link
    try:
        page = requests.get(link, headers=header)
        tree = html.fromstring(page.content)
        mainScript = tree.xpath('//script[contains(string(), "var ytplayer = ytplayer")]')
        mainText = mainScript[0].text_content()
        videoList = [m.start() for m in finditer('url=https%3A%2F%2F', mainText)]
        print "Total Videos: " + str(len(videoList))
        videoURLDetails = []
        for i in xrange(0, len(videoList)):
            dataSet = {}
            string = ""
            endingIndex = 0
            for j in xrange(videoList[i] + 4, len(mainText)):
                if mainText[j] == '\\' or mainText[j] == ',':
                    break
                string += mainText[j]
                endingIndex = j
            string = unquote(string)
            dataSet['url'] = string
            print string

            audioIndex = string.find('mime%3Daudio')
            if audioIndex != -1:
                dataSet['type'] = 'audio'
            else:
                videoIndex = string.find('mime%3Dvideo')
                if videoIndex != -1:
                    dataSet['type'] = 'video'
                else:
                    dataSet['type'] = 'undefined'

            subString = mainText[endingIndex: endingIndex + 200]
            index = subString.find('bitrate=')
            if index != -1:
                index = endingIndex + index
                index += 8
                bitrate = ""
                for j in xrange(index, len(mainText)):
                    if not mainText[j].isdigit():
                        break
                    bitrate += mainText[j]
                dataSet['bitrate'] = int(bitrate)
                dataSet['important'] = True
            else:
                dataSet['bitrate'] = -1
                dataSet['important'] = False

            videoURLDetails.append(dataSet)
        return videoURLDetails
    except (requests.ConnectionError, requests.ConnectTimeout) as e:
        print "Error Occurred: " + str(e)


def BestAudio():
    print "Getting Best Audio Link: "
    bestBitrate = 0
    url = ""
    for i in xrange(0, len(allVideoUrls)):
        if allVideoUrls[i]['type'] == 'audio':
            if allVideoUrls[i]['bitrate'] > bestBitrate:
                bestBitrate = allVideoUrls[i]['bitrate']
                url = allVideoUrls[i]['url']
    print url


def BestVideo():
    print "Getting Best Video Link: "
    bestBitrate = 0
    url = ""
    for i in xrange(0, len(allVideoUrls)):
        if allVideoUrls[i]['type'] == 'video':
            if allVideoUrls[i]['bitrate'] > bestBitrate:
                bestBitrate = allVideoUrls[i]['bitrate']
                url = allVideoUrls[i]['url']
    print url


if __name__ == '__main__':
    global allVideoUrls
    allVideoUrls = get_links('https://www.youtube.com/watch?v=ZiYdOwOrGyc')
    BestAudio()
    BestVideo()
    #
