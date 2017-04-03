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

url = "http://www.motherjones.com/authors"
monthDict = {'Jan':1,'Feb':2,'Mar':3,'Apr':4,'May':5,'Jun':6,'Jul':7,'Aug':8,'Sep':9,'Oct':10,'Nov':11,'Dec':12}
links = []
fullArray = []

# scrape article text using beautiful soup
request = requests.get(url)
html = request.text
soup = BeautifulSoup(html, 'html.parser')
content = soup.find('div', class_='view-content').find_all('h3') # extract content
# print(content)
for tag in content:
	li_parent = (tag.findParents('li'))[0]
	li_class = li_parent['class'][1]
	if not li_class == "views-row-1":
		a_tag = tag.find('a')
		link = a_tag['href']
		links.append(link)

authorErr = []
author = 1
for link in links:
	url = "http://www.motherjones.com" + link
	print(url)
	request = requests.get(url)
	html = request.text
	soup = BeautifulSoup(html, 'html.parser')
	try:
		content = soup.find('div', class_='view-content')
		child_divs = content.find_all('div', recursive=False) # extract content
		for tag in child_divs:
			a_tag = tag.find('h3').find('a')
			a_href = a_tag['href'] # store link

			date_div = (tag.find_all('div'))[2]
			date = date_div.find('span').text
			year = date[date.find(',')+2:date.find(',')+6] # store year
			
			if year == "2017" and a_href[1:9] == "politics":
				link = "http://www.motherjones.com" + a_href
				title = a_tag.text # FIX multiple lines

				month = date[4:7]
				day = date[date.find('.')+2:date.find(',')]
				full_date = day + " " + month + ", " + year
				my_date = datetime.datetime.strptime(full_date, "%d %b, %Y")
				article_date = my_date.strftime("%Y/%m/%d")

				tempArray = {"date":article_date, "title":title, "url":link}
				fullArray.append(tempArray)
		print(str(author) + " Author Scraped")
		author += 1
		# if author == 201:
		# 	break
	except Exception as e:
		authorErr.append(link)
		print(str(e))
		print("Could not print " + link)

pprint(fullArray)
print(authorErr)

# df = pd.DataFrame(fullArray, columns= ['URL', 'Date', 'Title'])
# df.to_csv('Mother_Jones_Links.csv')
# print(df)

with open('links.json', 'w') as outfile:
	json.dump(fullArray, outfile)

with open('author_error.json', 'w') as outfile:
	json.dump(authorErr, outfile)