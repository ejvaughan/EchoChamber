from bs4 import BeautifulSoup
import requests
import re
import sys
import nltk
from nltk.corpus import stopwords
from nltk.stem.porter import *
import string
from collections import Counter

def preprocess(url):
	# convert to Mercury URL
	mercury_base = "https://mercury.postlight.com/amp?url="
	mercury_url = mercury_base + url
	print mercury_url

	# scrape article text using beautiful soup
	text = ""
	request = requests.get(mercury_url)
	html = request.text
	soup = BeautifulSoup(html, 'html.parser')
	date = soup.find('time', class_='hg-pubdate').text # extract date, not necessary for now
	content = soup.find('div', class_='hg-article-body').find_all('p')
	for tag in content:
		parents = tag.findParents('footer')
		if len(parents) == 0: # if footer is not a parent tag
			text = text + "\n" + tag.text
	print text

	text = text.encode("utf-8")
	text = text.replace("\xe2\x80\x99", "\'") # keep single quotes FIX POSSIBLE BUG
	text = text.decode("utf-8")
	text = text.encode("ascii", "ignore") # remove all non-ascii characters

	text = text.lower() # make all text lowercase
	text = text.translate(None, string.punctuation) # remove punctuation

	tokens = nltk.word_tokenize(text) # convert text to tokens
	tokens = [word for word in tokens if word not in stopwords.words('english')] # remove stop words

	#stem tokens
	stemmer = PorterStemmer()
	stemmed = []
	for item in tokens:
		stemmed.append(str(stemmer.stem(item)))
	tokens = stemmed

	count = Counter(tokens)
	print count.most_common(50)

url = "http://www.cnn.com/2017/03/05/politics/trump-russia-fallout/index.html"
preprocess(url)