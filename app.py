from flask import Flask, render_template
import os, pytesseract
# from flask_uploads import UploadSet, configure_uploads, IMAGES
from PIL import Image
from flask import request

project_dir = os.path.dirname(os.path.abspath(__file__))

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'images'

class GetText(object):
    def __init__(self, file):
        pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
        self.file = pytesseract.image_to_string(Image.open(project_dir +'/images/'+ file))



@app.route('/', methods=['GET'])
def home():
    return render_template("index.html")



@app.route('/extract_text', methods=['POST'])
def extract_text():
    if 'photo' not in request.files:
        return "there is no photo in form"
    name = request.form['img-name'] + '.jpg'
    photo = request.files['photo']
    path = os.path.join(app.config['UPLOAD_FOLDER'],name)
    photo.save(path)

    textObject = GetText(name)
    print('TEXT OBJECT' + textObject.file)
    return textObject.file
        
