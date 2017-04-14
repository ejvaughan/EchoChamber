from newspaper_parser import parse
from bs4 import BeautifulSoup
import requests

articles = []
for x in range(0,100):
    url = "http://www.reuters.com/news/archive/politicsNews?view=page&page={}&pageSize=10".format(x)
    r = requests.get(url).text
    soup = BeautifulSoup(r, 'html.parser')
    stories = soup.find_all(class_='story-content')
    for story in stories:
        a = story.find('a')
        title = a.text.strip()
        url = 'http://www.reuters.com{}'.format(a['href'])
        article = {'url': url, 'title':title}
        articles.append(article)
parse(articles, 'reuters.json')
