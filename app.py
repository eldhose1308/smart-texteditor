from flask import Flask, render_template

app = Flask(__name__)


@app.route('/', methods=['GET'])
def home():
    return render_template("index.html")

@app.route('/old', methods=['GET'])
def home_old():
    return render_template("index_1.html")
