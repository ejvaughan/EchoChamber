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

# load guardian.csv and breitbart.csv files and construct the data set
label_names = [ 'conservative', 'liberal' ]

path = '../files'
articles, labels = [], []
for filename in glob.glob(os.path.join(path, '*.json')):
	print(filename)
	f = json.load(open(filename, 'r'))
	data = f['data']
	for article in data:
		articles += [article['text']]
		# articles += [preprocess(article['text'])]
	label = 1 if f['label'] == 'liberal' else 0

	labels += [label] * len(data)

print("Done preprocessing articles")
articles_train, articles_test, y_train, y_test = train_test_split(articles, labels, test_size=0.25, random_state=None)

# bag of bigrams with logistic regression
pipeline = Pipeline([('vect', TfidfVectorizer(ngram_range=(1,2), stop_words='english', tokenizer=preprocess)), ('clf', SGDClassifier(loss='log'))])

# tune the min_df and max_df hyperparameters
parameters = {'vect__min_df': np.linspace(0, 0.05, 6), 'vect__max_df': np.linspace(0.95, 1, 6) }
gs_clf = GridSearchCV(pipeline, parameters, n_jobs=-1)
# train the model
print("Training article now")
start = timeit.default_timer()
gs_clf = gs_clf.fit(articles_train, y_train)
stop = timeit.default_timer()
# print the hyperparameters that were chosen and their cross-validation score
print("Best score: %f" % gs_clf.best_score_);
for param_name in sorted(parameters.keys()):
        print("%s: %r" % (param_name, gs_clf.best_params_[param_name]))

# test on the test set
y_predicted = gs_clf.predict(articles_test)
# print the classification report
print(metrics.classification_report(y_test, y_predicted, target_names=label_names))
print(stop - start)
pickle.dump( gs_clf, open( "model.p", "wb" ) )
