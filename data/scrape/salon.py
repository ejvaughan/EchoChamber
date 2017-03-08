import requests
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from bs4 import BeautifulSoup


# First look through first page of salon politics
# Trace back all unique authors
# Go through their authors page
# Check each article for date and for topic
# Break at date earlier than new years 2017

r = requests.get('http://www.salon.com/category/politics/') 
soup = BeautifulSoup(r.text, 'html.parser')
byline = soup.findAll(class_='byline')
authors = set()
for line in byline:
    if line.find('a') != None:
        authors.add(line.find('a')['href']) 
print(authors)


driver = webdriver.Firefox()
for author in authors:
    driver.get(author)
    # Get all articles from this page
    # Throw them into a list
    # WE CAN PARSE THOSE LINKS YEE YEE
driver.close()
