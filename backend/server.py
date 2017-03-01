from flask import Flask, request
from flask_cors import CORS, cross_origin
import pickle
import csv
from newspaper import Article
from sklearn.externals import joblib

app = Flask(__name__)
CORS(app)

@app.route('/article', methods=['POST'])
def score():
    url = request.form['article']
    a = Article(url)
    a.download()
    a.parse()
    text = str(a.text)
    clf = joblib.load('model.p')
    s = pickle.dumps(clf)
    # text = request.form['article']
    pred = clf.predict([text])[0].item() # Return singular result
    return "Liberal" if pred else "Conservative"

if __name__ == "__main__":
    app.run()
