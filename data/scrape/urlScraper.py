from bs4 import BeautifulSoup
import requests
import re
import sys
import string
from time import time

def scrape(url):
	# headers = {
	#     'x-api-key': 'K0liTGBXgDZWwbnzDeZvzPcQhdFmeTLSTm4HVq50',
	#     'Content-Type': 'application/json'
	# }
	# start = time.time()
	# r = requests.get('https://mercury.postlight.com/parser?url=http://www.salon.com/2017/02/22/president-trumps-plan-to-round-up-the-undocumented-will-be-wonderful-for-private-prisons/', headers=headers)
	# arr = r.content
	# print arr
	start = time()
	# convert to Mercury URL
	mercury_base = "https://mercury.postlight.com/amp?url="
	mercury_url = mercury_base + url
	print(mercury_url)

	# scrape article text using beautiful soup
	text = ""
	request = requests.get(mercury_url)
	html = request.text
	soup = BeautifulSoup(html, 'html.parser')
	title = soup.find('h1', class_='hg-title').text # extract title
	date = soup.find('time', class_='hg-pubdate').text # extract date
	content = soup.find('div', class_='hg-article-body').find_all('p')
	for tag in content:
		parents = tag.findParents('footer')
		if len(parents) == 0: # if footer is not a parent tag
			text = text + " " + tag.text

	text = text.encode("utf-8")
	text = text.replace("\xe2\x80\x99", "\'") # keep single quotes FIX POSSIBLE BUG
	text = text.decode("utf-8")
	text = text.encode("ascii", "ignore") # remove all non-ascii characters
	stop = time() - start
	toReturn = {"date":str(date), "title":str(title), "text":text, "url":url, 'time': stop}
	print(toReturn)
	return toReturn