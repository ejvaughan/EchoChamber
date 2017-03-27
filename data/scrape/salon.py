import json
import requests
import datetime
from selenium import webdriver
# from selenium.webdriver.common.keys import Key
from bs4 import BeautifulSoup

import time
from selenium.common.exceptions import NoSuchElementException


def click(class_name):
    try:
        driver.find_element_by_class_name(class_name).click()
        print("CLICKED")
    except :
        return False
    return True

# First look through first page of salon politics
# Trace back all unique authors
# Go through their authors page
# Check each article for date and for topic
# Break at date earlier than new years 2017

# r = requests.get('http://www.salon.com/category/politics/')
# soup = BeautifulSoup(r.text, 'html.parser')
# byline = soup.findAll(class_='byline')
# authors = set()
# for line in byline:
#     if line.find('a') != None:
#         authors.add(line.find('a')['href'])
# print(authors)
authors = {'http://www.salon.com/writer/eric_boehlert/', 'http://www.salon.com/writer/david_cohen/', 'http://www.salon.com/writer/heather_digby_parton/', 'http://www.salon.com/writer/brett-c-burkhardt/', 'http://www.salon.com/writer/jeremy-binckes/', 'http://www.salon.com/writer/michael-j-brenner/', 'http://www.salon.com/writer/robert_reich/', 'http://www.salon.com/writer/taylor-link/', 'http://www.salon.com/writer/b-jessie-hill/', 'http://www.salon.com/writer/michael_winship/', 'http://www.salon.com/writer/thom_hartmann_2/', 'http://www.salon.com/writer/paul_rosenberg/', 'http://www.salon.com/writer/amanda_marcotte/', 'http://www.salon.com/writer/sophia_tesfaye/', 'http://www.salon.com/writer/phil-galewitz/', 'http://www.salon.com/writer/matthew-sheffield/', 'http://www.salon.com/writer/alexandra_rosenmann/', 'http://www.salon.com/writer/jordan_chariton/', 'http://www.salon.com/writer/gary_legum/', 'http://www.salon.com/writer/jordan-tama/', 'http://www.salon.com/writer/adam-g-klein/', 'http://www.salon.com/writer/ben-buchanan/', 'http://www.salon.com/writer/ryan-bohl/', 'http://www.salon.com/writer/elizabeth_grossman/', 'http://www.salon.com/writer/kytja-weir/', 'http://www.salon.com/writer/matthew_rozsa/', 'http://www.salon.com/writer/simon_maloy/'}
articles = []
driver = webdriver.Firefox()
for author in authors:
    driver.get(author)
    print(author)
    while True :
        html = driver.page_source
        soup = BeautifulSoup(html, 'html.parser')
        stories = soup.find_all(class_='story')
        for story in stories:
            epoch_time = int(story.find(class_='toLocalTime')['data-tlt-epoch-time'])
            date = time.strftime('%Y/%m/%d', time.localtime(epoch_time))
            if date < '2017/01/01':
                print("EARLIER")
                break
            # Get title and url here from scraping
            title = story.find('a')['data-headline']
            url  = story.find('a')['href']
            article = {'url' : url, 'title': title, 'date' : date}
            print(article)
            articles.append(article)
        if not click('previous') or date < '2017/01/01':
            print("BREAK")
            break

    driver.close()
with open('salon.json', 'w') as outfile:
    json.dump(articles, outfile)
