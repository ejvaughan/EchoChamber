import datetime
from bs4 import BeautifulSoup
import requests as r
from newspaper import Article
import json
import re


DKURL = 'http://www.dailykos.com'
ARTICLE_ATTRS = {'class':'see-full-story'}
PATH_TO_ARTICLES = "body .container .site-content .row .stories-section .row .col-sm-12 .story"

class News():

	def __init__(self, text, author, url, date):
		self.text = text
		self.author = author
		self.url = url
		self.date = date


def get_DK(pages):
	urls = dict()
	for page in range(1,pages):
		print(f'Page:  {page}')
		url = f"{DKURL}/?page={page}"
		html = BeautifulSoup(r.get(url).text.encode('ascii',"ignore").decode("ascii"), 'html.parser') 
		articles = html.select(PATH_TO_ARTICLES)
		for article in articles:
			a = article.find('a' , attrs=ARTICLE_ATTRS).get("href")
			urls[f"{DKURL}{a}"] = re.search(r'\d+/\d+/\d+', a).group(0)
	return urls


def get_text(url, date):
	a = Article(url)
	a.download()
	a.parse()
	t = a.text.encode('ascii', 'ignore').decode('ascii').replace("SIGN UP FOR OUR NEWSLETTER", "")
	auth = a.authors[0]
	return News(t, auth, url, date)


articles = []
for url, date in get_DK(49).items():
	try:
		articles.append(get_text(url, date).__dict__)
	except UnicodeEncodeError:
		print("UnicodeEncodeError")

with open('dkos.json', 'w') as outfile:
    json.dump(articles, outfile)
