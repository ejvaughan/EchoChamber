import nltk
from nltk.corpus import stopwords
from nltk.stem.porter import *
import string
from collections import Counter
import re

def preprocess(text):
	# text = text.encode("utf-8")
	# text = text.replace("\xe2\x80\x99", "\'") # keep single quotes FIX POSSIBLE BUG
	# text = text.decode("utf-8")
	text = text.encode("ascii", "ignore") # remove all non-ascii characters
	text = text.decode("ascii")
	# print(text)

	text = text.lower() # make all text lowercase
	# text = text.translate(None, string.punctuation) # remove punctuation
	text = re.sub('['+string.punctuation+']', '', text) # remove punctuation

	tokens = nltk.word_tokenize(text) # convert text to tokens
	# tokens = [word for word in tokens if word not in stopwords.words('english')] # remove stop words

	# stem the tokens
	stemmer = PorterStemmer()
	stemmed = []
	for item in tokens:
		stemmed.append(str(stemmer.stem(item)))
	tokens = stemmed

	count = Counter(tokens)

	return tokens
