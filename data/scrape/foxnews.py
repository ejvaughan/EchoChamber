import json
import requests
import datetime
from selenium import webdriver
# from selenium.webdriver.common.keys import Key
from bs4 import BeautifulSoup

import time
from selenium.common.exceptions import NoSuchElementException


def click(selector):
    try:
        driver.find_element_by_css_selector(selector).click()
    except :
        return False
    return True

articleCount = 1000
url = 'http://www.foxnews.com/politics.html'
driver = webdriver.Firefox()
driver.get(url)
articles = []
urls = []
while len(articles) < articleCount:
    try:
        click('#content > div > div:nth-child(2) > div:nth-child(6) > section > div > div > a > span')
        html = driver.page_source
        soup = BeautifulSoup(html, 'html.parser')
        articles = soup.find_all(class_='article-ct')
        print(len(articles))
    except: 
        time.sleep(1)
f = open('test.html', 'w')
f.write(html)
# print(articles)
for story in articles[1:]:
    try:
        url  = story.find_all('a')[1]['href']
    except:
        url = story.find('a')['href']
    urls.append({'url': url})

driver.close()
with open('foxnewsurls.json', 'w') as outfile:
    json.dump(urls, outfile)
