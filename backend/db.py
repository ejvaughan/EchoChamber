from pymongo import MongoClient

client = MongoClient()
articles = client['echo']['articles']

def check(url):
    article = articles.find_one({'article' : url})
    return (article['score'], article['title']) if article else (None, None)
def cache(url, score, title):
    articles.insert({'article' : url, 'score': score, 'title': title})
