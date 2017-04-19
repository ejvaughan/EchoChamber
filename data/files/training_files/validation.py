import matplotlib.mlab as mlab
import matplotlib.pyplot as plt
import json
import pickle
import sys
# if len(sys.argv) == 2:
#     dataname = sys.argv[1]
# else:
#     print("Add name of file as args")
#     sys.exit(1)
files = ['breitbart', 'motherjones', 'nymag', 'nypost' , 'salon', 'townhall']
clf = pickle.load(open('model.p', 'rb'))
for dataname in files:
    data = json.load(open('{}.json'.format(dataname)))['data']
    scores = []
    for article in data:
        pred = clf.predict_proba([article['text']])[0][0]
        scores.append(pred)
    f = open(dataname+'_scores.json', 'w')
    f.write(json.dumps(scores))