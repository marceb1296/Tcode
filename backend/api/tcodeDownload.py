from flask_restful import Resource
from flask import request, Response
import json
import csv
from io import StringIO, BytesIO
from flask import make_response
from openpyxl import Workbook

class TcodeDownload(Resource):
    def post(self):

        file = request.form.get("fileName")
        ext = request.form.get("ext")
        try:
            data = json.loads(request.form.get("data"))
        except:
            Response(
                "Error parsing data",
                status=500
            )

        if ext == "csv":
            fields = data[0].keys()
            with StringIO() as file:
                dict = csv.DictWriter(file, fieldnames=fields)
                dict.writeheader()
                for i in data:
                    dict.writerow(i)
                
                output_file = make_response(file.getvalue())
                output_file.headers["Content-Disposition"] = "attachment; filename=%s.%s" % (file, ext)
                output_file.headers["Content-type"] = "text/csv"
                return output_file

        elif ext == "xlsx":
            fields = [i for i in data[0].keys()]
            fields_len = len(data)
            
            with BytesIO() as file:
                wb = Workbook()
                sheet = wb.active
                for i in range(fields_len):
                    values = [k for k in data[i].values()]
                    if i == 0:
                        sheet.append(fields)
                        sheet.append(values)
                    else:
                        sheet.append(values)
                wb.save(file)

                output_file = make_response(file.getvalue())
                output_file.headers["Content-Disposition"] = "attachment; filename=%s.%s" % (file, ext)
                output_file.headers["Content-type"] = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                return output_file


        return Response(
            "Unknow error, please try again later",
            status=500
        )