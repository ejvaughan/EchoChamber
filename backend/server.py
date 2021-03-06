from flask import Flask, request
from flask_cors import CORS, cross_origin
from flask.json import jsonify
from newspaper import Article
import db
import pickle
import timeit

app = Flask(__name__)
CORS(app)

@app.route('/article', methods=['POST'])
def score():
    start = timeit.default_timer()
    url = request.form['article']
    score, title = db.check(url) # Get cached results from tuple
    if score == None:
        a = Article(url)
        a.download()
        a.parse()
        text = a.text
        title = a.title
        clf = pickle.load(open('/home/allen/flaskapp/model.p', 'rb'))
        pred = clf.predict([text])[0].item() # Return singular result
        score =  "Liberal" if pred else "Conservative"
        db.cache(url, score, title)
    time = timeit.default_timer() - start
    return jsonify({'score': score, 'title' : title, 'time':time})

@app.route('/')
def helloworld():
    return "Website still under development"

if __name__ == "__main__":
    app.run(host='0.0.0.0')
