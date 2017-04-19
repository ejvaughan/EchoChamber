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
files = ['dkos', 'guardian', 'foxnews', 'fiscaltimes', 'reuters']
clf = pickle.load(open('model.p', 'rb'))
for dataname in files:
    data = json.load(open('{}.json'.format(dataname)))
    scores = []
    for article in data:
        pred = clf.predict_proba([article['text']])[0][0]
        scores.append(pred)
    f = open(dataname+'_scores.json', 'w')
    f.write(json.dumps(scores))
# scores = [.1, .1]
# plt.hist(scores, 50, normed=1, facecolor='green', alpha=0.75)
# plt.xlabel('Probability of being Conservative')
# plt.ylabel('Frequency')
# plt.title('Distribution for {}'.format(dataname))
# plt.axis([0, 1, 0, 100])
# plt.grid(True)

# plt.show()
