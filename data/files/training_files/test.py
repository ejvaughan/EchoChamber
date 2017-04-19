import json
import glob
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import SGDClassifier
from sklearn.pipeline import Pipeline
from sklearn.model_selection import GridSearchCV
from sklearn.model_selection import train_test_split
from sklearn import metrics
import pickle
import timeit
import os
from preprocess import preprocess # Use our preprocess script

clf = pickle.load(open("model.p", 'rb'))
# load guardian.csv and breitbart.csv files and construct the data set
label_names = [ 'conservative', 'liberal' ]
files = ['breitbart', 'motherjones', 'nymag', 'nypost' , 'salon']

# files = ['dkos']
for file_ in files:
    liberal = 0
    total = len(files)
    data = json.load(open(file_ + '.json', 'r'))['data']
    sum_ = 0
    total = len(data)
    for text in data:
        sum_ += clf.predict([text['text']])[0]
        # score = clf.predict_proba([data['text']])[0]
        # if score < .25:
        #     print(data['url'])
        #     print(score)
    percent = sum_/total
    print(file_  + ": " + str(percent) + " liberal")
