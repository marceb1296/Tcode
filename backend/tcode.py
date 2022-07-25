from flask import Flask, send_from_directory
from flask_restful import Api, Resource, reqparse
from flask_cors import CORS #comment this on deployment
from api.tcode import Tcode
from api.tcodeDownload import TcodeDownload

app = Flask(__name__, static_url_path='', static_folder='build')
CORS(app) #comment this on deployment
api = Api(app)

@app.route("/", defaults={'path':''})
def serve(path):
    return send_from_directory(app.static_folder,'index.html')


api.add_resource(Tcode, '/tcode')
api.add_resource(TcodeDownload, "/tcode/download")
