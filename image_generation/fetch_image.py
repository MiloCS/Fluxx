import requests
from PIL import Image

def get_clipart_url(query):
	with open('key.txt', 'r') as f:
		api_key = f.readline()
		cx = f.readline()

	url = "https://www.googleapis.com/customsearch/v1?q={}&cx={}&key={}&searchType=image&alt=json".format(query + " clipart", cx, api_key)
	r = requests.get(url).json()
	return r["items"][0]["link"]

def get_image(url, query):
	r = requests.get(url)
	ext = url[url.rindex("."):]
	with open("keeper_images/"+ query + ext, "wb") as f:
		f.write(r.content)

with open("keepers.txt", "r") as f:
	for keeper in f.readlines():
		keeper = keeper.lower().strip('\n')
		get_image(get_clipart_url(keeper), keeper)

