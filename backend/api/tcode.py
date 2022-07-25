from core.handler import IsCsv, IsUrl, isExcel
from flask_restful import Resource
from flask import request
from werkzeug.utils import secure_filename
import os


ALLOWED_EXTENSIONS = {"csv", "xlsx", "xlsm", "xltx", "xltm"}
UPLOAD_FOLDER = './tmp_files'


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


class Tcode(Resource):
  def post(self):
    
    result_ = []
    result = []

    url = request.form.get("url")
    main = request.files.get("file_main")
    second = request.files.get("file_second")

    if main and allowed_file(main.filename):
      filename = secure_filename(main.filename)
      ext = filename.split(".")[1]

      if ext == "csv":
        parse = IsCsv()
        is_writeabled = parse.write_to_temp(main)
        if is_writeabled:
          result_.extend(parse.parseData())

        else:
          return {
            'status': 'Failed',
            'message': "File Main cant be decoded into utf8"
          }

      elif ext.startswith("xl"):
        parse = isExcel()
        result_ = parse.parseData(main)

    if second and allowed_file(second.filename) and main:
      filename_ = secure_filename(second.filename)
      ext_ = filename_.split(".")[1]

      if ext_ == "csv":
        parse_ = IsCsv()
        is_writeabled_ = parse_.write_to_temp(second)
        print("entra")
        if is_writeabled_:
          get_result = parse_.parseData()
          
          result = pa_rse.join_dicts(result_, get_result)
            
        else:
          return {
            'status': 'Failed',
            'message': "File Second cant be decoded into utf8"
          }

      elif ext_.startswith("xl"):
        parse_ = isExcel()
        get_result = parse_.parseData(second)
        result_ = parse_.join_dicts(result_, get_result)


    if url:
      parse = IsUrl()
      parse.setContent(url)

      if result_:
        result_ = parse.join_dicts(result_, parse.getData())
      else:
        result_ = parse.getData()

    for i in range(len(result_)):
        new_dict = {"pk": i}
        for k, v in result_[i].items():
            new_dict.update({k:v})

        result.append(new_dict)

    return {
      'status': 'Success',
      "message": "Request have been succesfully",
      "data_show": result[:20],
      'data': result
     }