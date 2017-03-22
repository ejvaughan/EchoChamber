import json
from pprint import pprint
from newspaper import Article

with open('links.json') as data_file:
	data = json.load(data_file)

article_array = []

for article in data:
	print(article)
	date = article['date']
	title = article['title']
	url = article['url']
	# print(date)
	# print(title)
	# print(url)
	a = Article(url)
	a.download()
	a.parse()
	text = a.text
	print(text)
	tempArray = {"date":date, "title":title, "url":url, "text":text}
	article_array.append(tempArray)

pprint(article_array)

with open('nymag_data.json', 'w') as outfile: # change to name of file of articles with text
	json.dump(article_array, outfile)