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

base_url = "http://www.thefiscaltimes.com/Policy-Politics?query=&page="
fullArray = []

page = 0
while page < 15:
	# scrape article text using beautiful soup
	url = base_url + str(page)
	print(url)
	request = requests.get(url)
	html = request.text
	soup = BeautifulSoup(html, 'html.parser')
	directory_content = soup.find('div', class_='directory-content')
	view_content = directory_content.find('div', class_='view-content')
	content = view_content.find_all('div', recursive=False) # extract content

	# pprint(content)
	print(len(content))
	print(str(page) + " Begin Scraping")
	article_count = 0

	for tag in content:
		a_tag = tag.find('a')
		datetime = tag.find('span', class_="date-display-single").text
		if "2016" not in a_tag and "Monday, January 9, 2017 - 7:15am" not in datetime:
			title = a_tag.text
			link = "http://thefiscaltimes.com" + a_tag["href"]
			date_start = (a_tag["href"]).find('2017')
			date = (a_tag["href"])[date_start:date_start+10]
			tempArray = {"date":date, "title":title, "url":link}
			pprint(tempArray)
			fullArray.append(tempArray)
			article_count += 1

	print(str(page) + " End Scraping")
	print(str(article_count) + " Articles Scraped")

	page += 1

pprint(fullArray)
print(len(fullArray))

with open('fiscalTimes_links.json', 'w') as outfile:
	json.dump(fullArray, outfile)