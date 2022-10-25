import json
from urllib import response
from flask import Flask, render_template ,jsonify
import os, pytesseract
# from flask_uploads import UploadSet, configure_uploads, IMAGES
from PIL import Image
from flask import request

from datetime import datetime 

project_dir = os.path.dirname(os.path.abspath(__file__))

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'images'

ALLOWED_EXTENSIONS = {'webp', 'tiff', 'png', 'jpg', 'jpeg'}


class GetText(object):
    def __init__(self, file):
        pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
        self.file = pytesseract.image_to_string(Image.open(project_dir +'/images/'+ file))


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/', methods=['GET'])
def home():
    return render_template("index.html")





@app.route('/extract_text', methods=['POST'])
def extract_text():
    if 'photo' not in request.files:
        response = {"status" : 500,"status_msg": "File is not uploaded","message": ""}
        return jsonify(response)

    file = request.files['photo']
    if file.filename == '':
        response = {"status" : 500,"status_msg": "No image Uploaded","message": ""}
        return jsonify(response)
    
    if file and not allowed_file(file.filename):
        response = {"status" : 500,"status_msg": "File extension is not permitted","message": ""}
        return jsonify(response)

    name = str(datetime.now().microsecond) + str(datetime.now().month) + '-' + str(datetime.now().day) +  '.jpg'
    photo = request.files['photo']
    path = os.path.join(app.config['UPLOAD_FOLDER'],name)
    photo.save(path)

    textObject = GetText(name)

    response = {"status" : 200,"status_msg": "Text loaded","message": textObject.file}
    return jsonify(response)
        
