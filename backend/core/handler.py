import csv
from tempfile import TemporaryFile
import requests as r
from bs4 import BeautifulSoup as bs
from openpyxl import load_workbook

class Base:

    def __init__(self) -> None:
        self.file = TemporaryFile(mode="r+")
        self.content = ""
        self.soup = None
    

    def write_to_temp(self, file) -> bool:

        try:
            self.file.write(file.read().decode())
            self.file.seek(0)
        except:
            return False

        return True
    

    def join_dicts(self, first, second):
        n_first = len(first)
        keys_first = first[0].keys()
        keys_second = second[0].keys()
        n_second = len(second)

        
        if n_first >= n_second:
            print("first")
            n_to_add = n_first - n_second
            for i in range(n_to_add):
                second.append({i: "NaN" for i in keys_second})

            
            for n in range(n_first):
                item = first[n]
                item_copy = item.copy()
                keys = second[n].keys()
                

                contains = [i for i in keys if i in item]
                

                if contains:
                    for i in keys:
                        if i not in item:
                            item.update({i: "NaN"})
                    dict_with_keys = {k: "NaN" for k in item_copy.keys()}
                    dict_with_keys.update(second[n])
                    if [k for k in dict_with_keys.values() if k != "NaN"]:
                        first.append(dict_with_keys)
                else:
                    for i in keys:
                        if i not in item:
                         item.update({i: second[n][i]})
                    
            return first

        else:

            n_to_add = n_second - n_first

            for i in range(n_to_add):
                first.append({i: "NaN" for i in keys_first})

            for n in range(n_second):
                item = second[n]
                item_copy = item.copy()
                keys = first[n].keys()
                
                contains = [i for i in keys if i in item]
                

                if contains:
                    for i in keys:
                        if i not in item:
                            item.update({i: "NaN"})
                    dict_with_keys = {k: "NaN" for k in item_copy.keys()}
                    dict_with_keys.update(first[n])
                    if [k for k in dict_with_keys.values() if k != "NaN"]:
                        second.append(dict_with_keys)
                else:
                    for i in keys:
                        if i not in item:
                         item.update({i: first[n][i]})

            return second
    
        


class IsCsv(Base):

    def parseData(self):
       
        data = []
        reader = csv.DictReader(self.file)
        for row in reader:
            data.append(row)

        self.file.close()

        return data


class isExcel(Base):


    def parseData(self, file):
        wb = load_workbook(file)

        excel_data = []

        for i in wb.sheetnames:
            sheet = wb[i]
            data = []

            for i in range(2, sheet.max_row + 1):
                dict = {}
                for n in range(len(sheet[i])):
                    if not sheet[1][n].value:
                        continue
                    dict.update({sheet[1][n].value:str(sheet[i][n].value)})
                if dict:
                    data.append(dict)

            if data:
                if excel_data:
                    excel_data = self.join_dicts(excel_data, data)
                else:
                    excel_data = data
        
        return excel_data

    
class IsUrl(Base):

    
    def setContent(self, url):
        get = r.get(url)
        self.content = get.text
        self.setParser()


    def setParser(self):
        self.soup = bs(self.content, "html.parser")


    def getData(self):

        table = self.soup.find_all("table")

        all_table_data = []

       
        for i in table:
       

            table_data = []
            head = i.find("thead")
            body = i.find("tbody")
   
            if not head:
                continue


            columns = [i.text.strip() for i in head.find_all("th")]
            
            body_tr = body.find_all("tr")
            for b_tr in body_tr:
                body_td = b_tr.find_all("td")
                table_data.append({columns[i]:body_td[i].text.strip() for i in range(len(columns))})
            if not table_data:
                continue
            if all_table_data:
                all_table_data = self.join_dicts(all_table_data, table_data)
            else:
                all_table_data = table_data
        
        return all_table_data


            

