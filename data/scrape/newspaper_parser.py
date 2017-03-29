import json
from pprint import pprint
from newspaper import Article

def parse(data, dest):
	article_array = []
	count = 0
	for article in data:
		try:
			print(article)
			url = article['url']
			a = Article(url)
			a.download()
			a.parse()
			article['text'] = a.text
			count+=1
			article_array.append(article)
		except Exception as e:
			print(e)
			pass
	pprint(article_array)
	print(str(count) + " articles parsed out of " + str(len(data)))
	with open(dest, 'w') as outfile: # change to name of file of articles with text
		json.dump(article_array, outfile)
