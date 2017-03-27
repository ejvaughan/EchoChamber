import json
from pprint import pprint
from newspaper import Article
import sys
if len(sys.argv) == 3:
	urls, dest = sys.argv[1], sys.argv[2]
else:
	sys.exit("Usage: %s urlfile destinationfile" % sys.argv[0])


with open(urls) as data_file:
	data = json.load(data_file)

article_array = []
count = 0
for article in data:
	try:
		print(article)
		date = article['date']
		title = article['title']
		url = article['url']
		# print(url)
		a = Article(url)
		a.download()
		a.parse()
		text = a.text
		print(text)
		tempArray = {"date":date, "title":title, "url":url, "text":text}
		count+=1
		article_array.append(tempArray)
	except:
		pass
pprint(article_array)
print(str(count) + " articles parsed")
with open(dest, 'w') as outfile: # change to name of file of articles with text
	json.dump(article_array, outfile)
