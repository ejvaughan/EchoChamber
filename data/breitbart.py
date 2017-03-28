import json
import datetime
from bs4 import BeautifulSoup
import requests as r
from newspaper import Article


#BB
BBURL = 'http://www.breitbart.com/big-government'
ARTICLE_ATTRS = {'class':'thumbnail-url'}

class News():
    def __init__(self, text, author, url):
        self.text = text
        self.author = author
        self.url = url


def get_BBurls(dates):
    urls = set()
    for date in dates:
        d = '{}/{}/{}'.format(date.year, date.month, date.day)
        url = '{}/{}'.format(BBURL, d)
        html = BeautifulSoup(r.get(url).text, 'html.parser')
        articles = html.find_all('article')
        for article in articles:
            url = article.find('a')['href']
            if url[0:4] != 'http': # Some links only give a relative link
                # url = 'http://www.breitbart.com' + url
                print("Annoying url")
                continue
            author = article.find(class_='byauthor').text if article.find(class_='byauthor') else 'null'
            urls.add((url, author)) # Add a tuple
            if len(urls) % 25 == 0:
                print('{} urls added'.format(len(urls)))

    return urls

def get_text(data):
    url, author = data
    a = Article(url)
    a.download()
    a.parse()
    text = a.text.replace("SIGN UP FOR OUR NEWSLETTER", "")
    # print(text.replace("SIGN UP FOR OUR NEWSLETTER", ""))
    # text = a.text.encode('ascii', 'ignore').decode('ascii')
    return {"url" : url, "author": author, "text": text} 




today = datetime.datetime.today()
numdays = 85 # Change this later. Just want to track from new years
date_list = (today - datetime.timedelta(days=x) for x in range(numdays))
bb_urls = get_BBurls(date_list)
print(len(bb_urls))
count = 0
articles = []
for url in bb_urls:
    try:
        articles.append(get_text(url))
        count += 1
    except UnicodeEncodeError:
        print("UnicodeEncodeError")
    except Exception as e:
        count +=1
        print(url)
        print(e)
with open('breitbart.json', 'w') as outfile:
    json.dump(articles, outfile)
