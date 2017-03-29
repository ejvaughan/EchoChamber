import requests
from bs4 import BeautifulSoup
import re
import json
from datetime import datetime
from newspaper_parser import parse

base_url = 'http://nypost.com/tag/politics/page/'

pageNum = 1
thisYear = True
urls = []
while thisYear:
    r = requests.get(base_url + str(pageNum))
    soup = BeautifulSoup(r.text, 'html.parser')
    articles = soup.find_all(class_='entry-header')
    for article in articles:
        url = article.find('a')['href']
        # title = article.find('a').text
        dateString = article.find('p').text
        raw_date = re.match(r'(.+)\s\|\s', dateString).group(1)
        date = datetime.strptime(raw_date, '%B %d, %Y')
        if date < datetime(2017,1,1):
            thisYear = False
            break
        urlObj = {'url' : url}
        urls.append(urlObj)
        if len(urls) % 25 == 0:
            print('{} urls added'.format(len(urls)))
    pageNum +=1
with open('nypost_urls.json', 'w') as outfile:
    json.dump(urls, outfile)
