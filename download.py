import requests
import pafy
import json
from cover_art_getter import itunes_album_art
import os
import urllib

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
# v = pafy.new("https://www.youtube.com/watch?v=Rmt8-H3Lyys")
# v = v.getbestaudio()
# v.download("./hellooo.mp3")

def pirate_music(music_id , title , artist):

	audio = pafy.new(music_id)
	audio_a = audio.getbestaudio()
	itunes_search = title+" - "+artist
	title_n = title.replace(" " , "_")
	#file_off ="./tmp/FeelingGood.mp3"
	file_off = audio_a.download("./tmp/"+title_n+".mp3")
	try:
		album_art = itunes_album_art(itunes_search)
		album_art = urllib.urlretrieve(album_art[0] , "./tmp/artwork/"+title+".jpg")
	except Exception as e:
		print("Unable to find artwork , setting default artwork. Error : " + str(e))
		album_art = "./tmp/artwork/default.png"
	print(album_art)
	
	print("Getting Track info for " + title + "....")
	try:
		page = requests.get("http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key="+API_KEY+"&artist="+artist+"&track="+title+"&format=json")
		page = json.loads(page.content)
	except Exception as e:
		e = str(e)
		print("Error in getting Artist data : " +str(e))
		return None
	try:
		album = page["track"]["album"]["title"]
	except Exception as e:
		print("Unalble to extract data from JSON data : " +str(e))
		album = ""
	try:
		genre = []
		genre.append(page["track"]["toptags"]["tag"][0]["name"])
		genre.append(page["track"]["toptags"]["tag"][1]["name"])
	except Exception as e:
		print("Unable to find data")
		genre = [" ", " "]	
	print(album , genre)
	

	# try:
		
	# except Exception as e:
	# 	print("Error in ffmpeg " + str(e))
	print(file_off)
	print(title , album_art[0])
	print(artist , genre[0])	

	new_file = "./tmp/fumen_"+title_n+".mp3"
	# Script using id3 tag
	exe = "ffmpeg -i " + file_off+ " -i '"+album_art+"' -map 0 -map 1 -c copy -codec -id3v2_version 3 -metadata title='"+ title +"' -metadata TPE1='"+artist+"' -metadata TPE2='"+artist+"' -metadata album='"+album+"' -metadata genre='"+genre[0]+"' "+new_file
	
	# Super Script **
	# exe = "ffmpeg -i " + file_off+ " -i '"+album_art[0]+"' -codec copy -metadata title='"+ title +"' -metadata TPE1='"+artist+"' -metadata TPE2='"+artist+"' -metadata album='"+album+"' -metadata genre='"+genre[0]+"' "+new_file
	print(exe)
	os.system(exe)     
	#os.system("ffmpeg -loglevel quiet -i "+file_off+" -codec copy -metadata title="+title+" -metadata author="+artist+" -metadata album="+album+" -metadata genre="+genre[0]+" "+new_file+" && echo 'boob'")
	
	print(new_file)	

# Uncomment to Run for test
pirate_music("https://www.youtube.com/watch?v=gBkWR-WfEeU" , "Feeling Good" , "Gryffin")