from bs4 import BeautifulSoup
from newspaper import Article
import requests
import re
import sys
import datetime
from pprint import pprint
import numpy as np
import pandas as pd
import json

base_url = "http://nymag.com/daily/intelligencer/?start=" # remove 0
fullArray = []

index = 0
while index <= 1070:
	# scrape article text using beautiful soup
	url = base_url + str(index)
	print(url)
	request = requests.get(url)
	html = request.text
	soup = BeautifulSoup(html, 'html.parser')
	content = soup.find('aside', class_='newsfeed').find('div').find_all('div', class_='headline-wrapper') # extract content

	# pprint(content)
	# print(len(content))
	print(str(index) + " Begin Scraping")
	article_count = 0

	for tag in content:
		datetime = tag.find('time')["datetime"]
		if "2016" not in datetime:
			date = datetime[0:10].replace("-", "/")
			title = tag.find('h2').text
			link = tag.find('a')["href"]
			tempArray = {"date":date, "title":title, "url":link}
			# print(tempArray)
			fullArray.append(tempArray)
			article_count += 1

	print(str(index) + " End Scraping")
	print(str(article_count) + " Articles Scraped")

	index = index + 10

pprint(fullArray)
print(len(fullArray))

with open('nymag_links.json', 'w') as outfile:
	json.dump(fullArray, outfile)