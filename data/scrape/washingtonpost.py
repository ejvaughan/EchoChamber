import json
import requests
import datetime
from selenium import webdriver
from newspaper_parser import parse
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

articleCount = 400
url = 'https://www.washingtonpost.com/politics'
driver = webdriver.Firefox()
driver.get(url)
articles = []
urls = []
while len(articles) < articleCount:
    try:
        click('#fu4M4c1TPxy2gq > div > div.col-md-12.col-lg-11.col-lg-offset-1 > div.button.pb-loadmore.clear')
        html = driver.page_source
        soup = BeautifulSoup(html, 'html.parser')
        articles = soup.find_all(class_='story-headline')
        print(len(articles))
    except: 
        time.sleep(1)
f = open('test.html', 'w')
f.write(html)

# print(articles)
for story in articles:
    url  = story.find('h3').find('a')['href']
    urls.append({'url': url})

driver.close()
parse(urls, 'washingtonpost.json')
