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
import datetime

base_url = "https://townhall.com/columnists/date/" # remove 0
fullArray = []

date = "2017/01/01"

while date != "2017/03/26":
	# scrape article text using beautiful soup
	url = base_url + date
	print(url)
	request = requests.get(url)
	html = request.text
	soup = BeautifulSoup(html, 'html.parser')
	content = soup.find('div', class_="col-xs-8").find_all('div', class_='row', recursive=False) # extract content

	article_count = 0

	for tag in content:
		a_tag = tag.find('div', class_="index-story__title").find('a')
		link = "http://townhall.com" + a_tag["href"]
		title = a_tag.text
		date_start = link.find('2017')
		if date_start > -1:
			date = link[date_start:date_start+10]
			tempArray = {"date":date, "title":title, "url":link}
			pprint(tempArray)
			fullArray.append(tempArray)
			article_count += 1
			
	print(str(article_count) + " Articles Scraped")

	date_formatted = datetime.datetime.strptime(date, "%Y/%m/%d")
	end_date_formatted = date_formatted + datetime.timedelta(days=7)
	date = str(end_date_formatted.strftime("%Y/%m/%d"))

pprint(fullArray)
print(len(fullArray))

with open('townhall_links.json', 'w') as outfile:
	json.dump(fullArray, outfile)