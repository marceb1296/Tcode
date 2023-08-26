from core.handler import IsCsv, IsUrl, isExcel
from flask_restful import Resource
from flask import request
from werkzeug.utils import secure_filename


ALLOWED_EXTENSIONS = {"csv", "xlsx", "xlsm", "xltx", "xltm"}


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


class Tcode(Resource):
    def post(self):

        start_index = 0
        columns = ["pk"]
        result = []

        url = request.POST.get("url")
        main = request.FILES.get("file_main")
        second = request.FILES.get("file_second")

        if main and allowed_file(main.name):
            ext = main.name.split(".")[1]

            if ext == "csv":
                parse = IsCsv()
                is_writeabled = parse.write_to_temp(main)
                if is_writeabled:
                    csv_cols, csv_data, index_result = parse.parseData(
                        start_index)

                    columns.extend(csv_cols)  # type: ignore
                    result.extend(csv_data)
                    start_index = index_result

                else:
                    return {
                        'status': 'Failed',
                        'message': "File Main cant be decoded into utf8"
                    }

            elif ext.startswith("xl"):
                parse = isExcel()
                excel_cols, excel_data, index_result = parse.parseData(
                    main, start_index)

                columns.extend(excel_cols)  # type: ignore
                result.extend(excel_data)
                start_index = index_result

        if second and allowed_file(second.name) and main:

            ext_second = second.name.split(".")[1]

            if ext_second == "csv":
                parse_second = IsCsv()
                is_writeabled_ = parse_second.write_to_temp(second)
                if is_writeabled_:

                    csv_second_cols, csv_second_data, index_second_result = parse_second.parseData(
                        start_index)

                    result = parse_second.join_dicts(
                        result, columns, csv_second_data, csv_second_cols)
                    columns.extend(csv_second_cols)  # type: ignore
                    start_index = index_second_result

                else:
                    return {
                        'status': 'Failed',
                        'message': "File Second cant be decoded into utf8"
                    }

            elif ext_second.startswith("xl"):
                parse_second = isExcel()
                excel_second_cols, excel_second_data, index_second_result = parse_second.parseData(
                    second, start_index)

                result = parse_second.join_dicts(
                    result, columns, excel_second_data, excel_second_cols)
                columns.extend(excel_second_cols)  # type: ignore
                start_index = index_second_result

        if url:
            parse_url = IsUrl()

            try:
                parse_url.setContent(url)
            except:
                return {
                    'status': 'Error',
                    "message": "Failed to establish a connection with %s" % url
                }

            url_cols, url_data, _ = parse_url.getData(start_index)

            if not url_data:
                return {
                    'status': 'Error',
                    "message": "Can't find any table from %s" % url
                }

            if result:
                result = parse_url.join_dicts(
                    result, columns, url_data, url_cols)
            else:
                result = url_data

            columns.extend(url_cols)

        if len(columns) == 1:
            return {
                'status': 'Error',
                "message": "Unable to find data on file/url"
            }

        return {
            'status': 'Success',
            "message": "Request have been successfully",
            "data_show": result[:20],
            'data': result,
            'columns': columns
        }
