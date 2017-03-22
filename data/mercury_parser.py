import json
from pprint import pprint
from bs4 import BeautifulSoup
import requests
import re
import sys
import string
import time

with open('nymag_links.json') as data_file: # change to json file of URLs
	data = json.load(data_file)

article_array = []
article_errors = []

for article in data:
	print(article)
	date = article['date']
	title = article['title']
	url = article['url']
	# print(date)
	# print(title)
	# print(url)

	mercury_base = "https://mercury.postlight.com/amp?url="
	mercury_url = mercury_base + url
	# print(mercury_url)

	try:
		text = ""
		# scrape article text using beautiful soup
		request = requests.get(mercury_url)
		html = request.text
		soup = BeautifulSoup(html, 'html.parser')
		content = soup.find('div', class_='hg-article-body').find_all('p')
		for tag in content:
			parents = tag.findParents('footer')
			if len(parents) == 0: # if footer is not a parent tag
				text = text + " " + tag.text
		# print(text)
		tempArray = {"date":str(date), "title":str(title), "url":url, "text":text}
		article_array.append(tempArray)
	except Exception as e:
		article_errors.append(article)
		print(str(e))
		print("Could not print this article")


pprint(article_array)

print(len(article_errors))

with open('nymag_data.json', 'w') as outfile: # change to name of file of correctly parsed articles
	json.dump(article_array, outfile)
with open('nymag_data_errors.json', 'w') as outfile: # change to name of file of incorrectly parsed articles
	json.dump(article_errors, outfile)