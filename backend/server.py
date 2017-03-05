from flask import Flask, request
from flask_cors import CORS, cross_origin
from flask.json import jsonify
import csv
from newspaper import Article
from sklearn.externals import joblib
import timeit
# import ssl
# context = ssl.SSLContext(ssl.PROTOCOL_TLSv1_2)
# context.load_cert_chain('host.cert', 'host.key')


app = Flask(__name__)
CORS(app)

@app.route('/article', methods=['POST'])
def score():
    start = timeit.default_timer()
    url = request.form['article']
    a = Article(url)
    a.download()
    a.parse()
    text = a.text
    clf = joblib.load('model.p')
    pred = clf.predict([text])[0].item() # Return singular result
    score =  "Liberal" if pred else "Conservative"
    title = a.title
    time = timeit.default_timer() - start

    return jsonify({'score': score, 'title' : title, 'time':time})

if __name__ == "__main__":
    app.run(host='0.0.0.0')
    # app.run(host='127.0.0.1',port='5000',  ssl_context=context)
