import csv
import sys
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import SGDClassifier
from sklearn.pipeline import Pipeline
from sklearn.model_selection import GridSearchCV
from sklearn.model_selection import train_test_split
from sklearn import metrics

# load guardian.csv and breitbart.csv files and construct the data set
breitbart_articles = []
guardian_articles = []
label_names = [ 'conservative', 'liberal' ]

with open('breitbart.csv', newline='') as f:
	reader = csv.reader(f)

	next(reader) # skip the header

	breitbart_articles = [ article[2] for article in reader ]

with open('guardian.csv', newline='') as f:
	reader = csv.reader(f)

	guardian_articles = [ article[1] for article in reader ]

articles = breitbart_articles + guardian_articles
labels = ([0] * len(breitbart_articles)) + ([1] * len(guardian_articles))

print("# Breitbart articles: %i\n# Guardian articles: %i" % (len(breitbart_articles), len(guardian_articles)))

articles_train, articles_test, y_train, y_test = train_test_split(articles, labels, test_size=0.25, random_state=None)

# bag of bigrams with logistic regression
pipeline = Pipeline([('vect', TfidfVectorizer(ngram_range=(1,2))), ('clf', SGDClassifier(loss='log'))])

# tune the min_df and max_df hyperparameters
parameters = {'vect__min_df': np.linspace(0, 0.05, 6), 'vect__max_df': np.linspace(0.95, 1, 6) }
gs_clf = GridSearchCV(pipeline, parameters, n_jobs=-1)

# train the model
gs_clf = gs_clf.fit(articles_train, y_train)

# print the hyperparameters that were chosen and their cross-validation score
print("Best score: %f" % gs_clf.best_score_);
for param_name in sorted(parameters.keys()):
        print("%s: %r" % (param_name, gs_clf.best_params_[param_name]))

# test on the test set
y_predicted = gs_clf.predict(articles_test)

# print the classification report
print(metrics.classification_report(y_test, y_predicted, target_names=label_names))
