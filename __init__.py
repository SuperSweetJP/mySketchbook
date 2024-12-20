from distutils.log import error
from wsgiref.simple_server import make_server
from flask import Flask, render_template, redirect, request, url_for, session, jsonify, make_response
from flask_session import Session
import json
# import content_management
import mysql.connector
from dotenv import load_dotenv, find_dotenv
import os
import sentry_sdk
from flask import Flask
from sentry_sdk.integrations.flask import FlaskIntegration

TAB_DICT = {
        "3D" : "threeD",
        "DATA" : "data"
    }

TOPIC_DICT = {
    "3D": 
        [
            #0 CardTitle, 1 CardType, 2 SupportingText, 3 Date, 4 Link (optional), 5 [Chips], 6 Width(col), [7 image loc, descr, width] (optional)
            [
                "Chess Knight model", 
                "seethrough-card", 
                "A knight chess piece model. Procedurally generated textures that were baked into an image.", 
                "10/04/2022", 
                "chess_knight", 
                ["Blender", "ThreeJs"],
                6,
                # r"img/gifs/ClampQuaternion.gif"
            ]
            ,[
                "Clamp quaternion", 
                "seethrough-card", 
                "Code snippet for limiting quaternion rotation on two axes.", 
                "13/02/2022", 
                "clamp_quaternion", 
                ["Quaternion", "Rotation", "Unity3D"],
                6,
                # r"img/gifs/ClampQuaternion.gif"
            ]
            ,[
                "Randomized building generator", 
                "seethrough-card", 
                "Played around with javascript ThreeJS library, to create randomized building blocks. Warning, quite resource heavy.", 
                "04/02/2022", 
                "cityScape",
                ["ThreeJS"],
                6
            ]
            ,[
                "Swarm model animated", 
                "seethrough-card", 
                "For performance testing on mobile", 
                "03/10/2021", 
                "swarm_model_anim",
                ["Blender", "ThreeJS"],
                6
            ]
            ,[
                "Swarm model", 
                "seethrough-card", 
                "A creepy crawly. My first complete model, along with some textures", 
                "03/10/2021", 
                "swarm_model",
                ["Blender", "ThreeJS"],
                6
            ]
        ],
    "DATA": 
        [
            # CardTitle, CardType, SupportingText, Date, Link, [Chips], Width(col)-optional
            [
                "Vehicle project dashboard", 
                "seethrough-card", 
                [
                    "Dashboard. Under construction.",
                    "",
                    "2022.06.27: Selectable subsets, CSS styling improvements for mobile.",
                    "2022.06.14: Dynamic update vertical bar chart based on make selection from horizontal bar chart."
                ],
                "17/05/2022", 
                "vp_data_dashboard", 
                ["Python", "Flask", "D3.js"],
                4,
                # r"img/gifs/ClampQuaternion.gif"
            ],
            [
                "Vehicle project data", 
                "seethrough-card", 
                [
                    "Data gathered by web scraper, to be used in Vehicle Project.", 
                    "ToDo: make table size responsive, OR redesign for mobile."
                ], 
                "23/04/2022", 
                "web_scraper", 
                ["Python", "MySQL", "WebScraper"],
                4,
                # r"img/gifs/ClampQuaternion.gif"
            ]
        ]
}

CAR_MAKE_DICT = {
    "Alfa-Romeo" : "https://www.ss.lv/lv/transport/cars/alfa-romeo/sell/",
    "Audi" : "https://www.ss.lv/lv/transport/cars/audi/sell/",
    "BMW" : "https://www.ss.lv/lv/transport/cars/bmw/sell/",
    "Cadilliac" : "https://www.ss.lv/lv/transport/cars/cadillac/sell/",
    "Chevrolet" : "https://www.ss.lv/lv/transport/cars/chevrolet/sell/",
    "Chrysler" : "https://www.ss.lv/lv/transport/cars/chrysler/sell/",
    "Citroen" : "https://www.ss.lv/lv/transport/cars/citroen/sell/",
    "Dacia" : "https://www.ss.lv/lv/transport/cars/dacia/sell/",
    "Daewoo" : "https://www.ss.lv/lv/transport/cars/daewoo/sell/",
    "Dodge" : "https://www.ss.lv/lv/transport/cars/dodge/sell/",
    "Fiat" : "https://www.ss.lv/lv/transport/cars/fiat/sell/",
    "Ford" : "https://www.ss.lv/lv/transport/cars/ford/sell/",
    "Honda" : "https://www.ss.lv/lv/transport/cars/honda/sell/",
    "Hyundai" : "https://www.ss.lv/lv/transport/cars/hyundai/sell/",
    "Infinity" : "https://www.ss.lv/lv/transport/cars/infiniti/sell/",
    "Jaguar" : "https://www.ss.lv/lv/transport/cars/jaguar/sell/",
    "Jeep" : "https://www.ss.lv/lv/transport/cars/jeep/sell/",
    "Kia" : "https://www.ss.lv/lv/transport/cars/kia/sell/",
    "Lancia" : "https://www.ss.lv/lv/transport/cars/lancia/sell/",
    "Land-Rover" : "https://www.ss.lv/lv/transport/cars/land-rover/sell/",
    "Lexus" : "https://www.ss.lv/lv/transport/cars/lexus/sell/",
    "Mazda" : "https://www.ss.lv/lv/transport/cars/mazda/sell/",
    "Mercedes" : "https://www.ss.lv/lv/transport/cars/mercedes/sell/",
    "Mini" : "https://www.ss.lv/lv/transport/cars/mini/sell/",
    "Mitsubishi" : "https://www.ss.lv/lv/transport/cars/mitsubishi/sell/",
    "Nissan" : "https://www.ss.lv/lv/transport/cars/nissan/sell/",
    "Opel" : "https://www.ss.lv/lv/transport/cars/opel/sell/",
    "Peugeot" : "https://www.ss.lv/lv/transport/cars/peugeot/sell/",
    "Porsche" : "https://www.ss.lv/lv/transport/cars/porsche/sell/",
    "Renault" : "https://www.ss.lv/lv/transport/cars/renault/sell/",
    "Saab" : "https://www.ss.lv/lv/transport/cars/saab/sell/",
    "Seat" : "https://www.ss.lv/lv/transport/cars/seat/sell/",
    "Skoda" : "https://www.ss.lv/lv/transport/cars/skoda/sell/",
    "Ssangyong" : "https://www.ss.lv/lv/transport/cars/ssangyong/sell/",
    "Subaru" : "https://www.ss.lv/lv/transport/cars/subaru/sell/",
    "Suzuki" : "https://www.ss.lv/lv/transport/cars/suzuki/sell/",
    "Toyota" : "https://www.ss.lv/lv/transport/cars/toyota/sell/",
    "Volkswagen" : "https://www.ss.lv/lv/transport/cars/volkswagen/sell/",
    "Volvo" : "https://www.ss.lv/lv/transport/cars/volvo/sell/"
}

# ToDo: uncomment this for production
sentry_sdk.init(
    dsn="https://d62e88e038c944849054a1cd7ef9a402@o1254638.ingest.sentry.io/6422628",
    integrations=[FlaskIntegration()],

    # Set traces_sample_rate to 1.0 to capture 100%
    # of transactions for performance monitoring.
    # We recommend adjusting this value in production.
    traces_sample_rate=1.0
)

app = Flask(__name__)
app.config.from_pyfile('settings.py')
app.config['JSON_SORT_KEYS'] = True
# these do not work. ToDo: rework the config
app.secret_key = os.environ.get("SBSECRETKEY")
app.config['SESSION_TYPE'] = 'filesystem'
app.debug = os.environ.get("DEBUG")


session = Session()
load_dotenv(find_dotenv())


@app.route("/")
def hello():
    # return render_template("3d.html", TOPIC_DICT = TOPIC_DICT, TAB_DICT = TAB_DICT)
    return redirect('/data/')


@app.errorhandler(404)
def pageNoFound(e):
    return render_template("404.html", TOPIC_DICT=TOPIC_DICT, TAB_DICT=TAB_DICT)


@app.route("/3d/")
def threeD():
    return render_template("3d.html", TOPIC_DICT=TOPIC_DICT, TAB_DICT=TAB_DICT)


@app.route("/city_scape/")
def cityScape():
    return render_template("city_scape.html", TOPIC_DICT=TOPIC_DICT, TAB_DICT=TAB_DICT)


@app.route("/contact/")
def contact():
    return render_template("contact.html", TOPIC_DICT=TOPIC_DICT, TAB_DICT=TAB_DICT)


@app.route("/about/")
def about():
    return render_template("about.html", TOPIC_DICT=TOPIC_DICT, TAB_DICT=TAB_DICT)


@app.route("/text_entry/")
def text_entry():
    return render_template("text_entry.html", TOPIC_DICT=TOPIC_DICT, TAB_DICT=TAB_DICT)


@app.route("/text_entry2/")
def text_entry2():
    return render_template("text_entry2.html", TOPIC_DICT=TOPIC_DICT, TAB_DICT=TAB_DICT)


@app.route("/clamp_quaternion/")
def clamp_quaternion():
    return render_template("clamp_quaternion.html", TOPIC_DICT=TOPIC_DICT, TAB_DICT=TAB_DICT)


@app.route("/swarm_model/")
def swarm_model():
    return render_template("swarm_model.html", TOPIC_DICT=TOPIC_DICT, TAB_DICT=TAB_DICT)


@app.route("/chess_knight/")
def chess_knight():
    return render_template("chess_knight.html", TOPIC_DICT=TOPIC_DICT, TAB_DICT=TAB_DICT)


@app.route("/swarm_model_anim/")
def swarm_model_anim():
    return render_template("swarm_model_anim.html", TOPIC_DICT=TOPIC_DICT, TAB_DICT=TAB_DICT)


@app.route("/data/")
def data():
    return render_template("data.html", TOPIC_DICT=TOPIC_DICT, TAB_DICT=TAB_DICT)


@app.route("/orbit_controls/")
def orbit_controls():
    return render_template("orbit_controls.html", TOPIC_DICT=TOPIC_DICT, TAB_DICT=TAB_DICT)


@app.route("/mesh_test/")
def mesh_test():
    return render_template("mesh_test.html", TOPIC_DICT=TOPIC_DICT, TAB_DICT=TAB_DICT)


@app.route("/web_scraper/", methods=['POST', 'GET'])
def web_scraper():
    selected_make = ''
    # table headers
    TableHeader_List = ["Model", "Year", "Engine", "Transmission",
                        "Mileage (km)", "Body", "Tech.Eval.", "Price", "FirstSeen", "LastSeen", "UpForDays"]
    if request.method == "POST":
        selected_make = request.form['make']
        selected_model = request.form['model']

        if(selected_make == ''):
            return render_template("web_scraper.html", TOPIC_DICT=TOPIC_DICT, TAB_DICT=TAB_DICT, CAR_MAKE_DICT=CAR_MAKE_DICT, selected_make=selected_make, TableHeader_List=TableHeader_List)
        elif(CAR_MAKE_DICT[selected_make]):
            # alter sql queries and parms if model selected
            if(selected_model != ''):
                sqlSelectCount = "SELECT COUNT(*) from CarsTable WHERE Category = %s AND Marka = %s"
                sqlSelectFrequency = """SELECT T1.yearMonth, Count(T2.RecId) as Count FROM calendarTable T1
                                LEFT JOIN CarsTable T2 on T1.db_date = T2.DateFirst and T2.Category = %s and T2.Marka = %s
                                WHERE T1.db_date < CURDATE()
                                GROUP BY T1.YearMonth"""
                sqlSelect = "SELECT Marka, GadsMod, Motors, Karba, Nobr, Virsb, Skate, Cena, date(FirstSeen), date(LastSeen), DATEDIFF(LastSeen, FirstSeen) AS UpForDays from CarsTable WHERE Category = %s AND Marka = %s order by LastSeen desc Limit 30"
                parm = (CAR_MAKE_DICT[selected_make], selected_model)
            else:
                sqlSelectCount = "SELECT COUNT(*) from CarsTable WHERE Category = %s"
                sqlSelectFrequency = """SELECT T1.yearMonth, Count(T2.RecId) as Count FROM calendarTable T1
                                LEFT JOIN CarsTable T2 on T1.db_date = T2.DateFirst and T2.Category = %s
                                WHERE T1.db_date < CURDATE()
                                GROUP BY T1.YearMonth"""
                sqlSelect = "SELECT Marka, GadsMod, Motors, Karba, Nobr, Virsb, Skate, Cena, date(FirstSeen), date(LastSeen), DATEDIFF(LastSeen, FirstSeen) AS UpForDays from CarsTable WHERE Category = %s order by LastSeen desc Limit 30"
                parm = (CAR_MAKE_DICT[selected_make], )

            mydb, mycursorCount = getMyCursor(sqlSelectCount, parm)
            mydb2, mycursor = getMyCursor(sqlSelect, parm, True)
            mydb3, mycursorFrequency = getMyCursor(
                sqlSelectFrequency, parm, True)

            rowCount = [item[0] for item in mycursorCount.fetchall()]

            freqDict = mycursorFrequency.fetchall()
            freqDict = jsonify(freqDict)
            # print(freqDict)

            return render_template("web_scraper.html", TOPIC_DICT=TOPIC_DICT, TAB_DICT=TAB_DICT, CAR_MAKE_DICT=CAR_MAKE_DICT, selected_make=selected_make, selected_model=selected_model, mycursor=mycursor, TableHeader_List=TableHeader_List, rowCount=rowCount, freqDict=freqDict.data)

    return render_template("web_scraper.html", TOPIC_DICT=TOPIC_DICT, TAB_DICT=TAB_DICT, CAR_MAKE_DICT=CAR_MAKE_DICT, selected_make=selected_make, TableHeader_List=TableHeader_List)


@app.route("/vp_data_dashboard/")
def vp_data_dashboard():
    return render_template("vp_data_dashboard.html", TAB_DICT=TAB_DICT)

# handle dynamic Model dropdown values, after Make selected


@app.route('/_get_updated_settings')
def get_updated_settings():
    # print(request.args)

    make = request.args.get('make')
    output = {}
    if(make != ''):
        parm = (CAR_MAKE_DICT[make],)
        sqlSelectModels = "SELECT DISTINCT Marka from CarsTable WHERE Category = %s and Marka <> '' and Year >= YEAR(CURDATE()) - 1 ORDER BY Marka ASC"

        mydb, mycursor = getMyCursor(sqlSelectModels, parm, True)
        output['model'] = [item['Marka'] for item in mycursor.fetchall()]

    return jsonify(output)

# get total counts per make
# ToDo: add year grouping


@app.route('/_get_totals')
def get_totals():
    # year = request.args.get('year')
    # print(year)

    sqlSelect = "select count(*) as cnt, Category from CarsTable WHERE Year >= YEAR(CURDATE()) - 1 group by Category order by cnt DESC;"

    mydb, mycursor = getMyCursor(sqlSelect, None, False)

    cntData = mycursor.fetchall()
    cntDict = {}
    for t in cntData:
        strValueList = [t[1]]
        strValue = strValueList[0].replace("'", "")
        if(strValue in list(CAR_MAKE_DICT.values())):
            cntDict[list(CAR_MAKE_DICT.keys())[
                list(CAR_MAKE_DICT.values()).index(strValue)]] = t[0]

    jsonDict = jsonify(cntDict)
    return jsonDict.data

# load frequency data grouped by make, yearmonth


@app.route('/_get_frequency_data')
def get_frequency_data():
    make = request.args.get('make')
    parm = None

    if(make == 'null'):
        sqlSelectFrequency = """SELECT T1.yearMonth, Count(T2.RecId) as Count FROM calendarTable T1
                          LEFT JOIN CarsTable T2 on T1.db_date = T2.DateFirst
                          WHERE T1.db_date <= CURDATE() AND T1.Year >= YEAR(CURDATE()) - 1
                          GROUP BY T1.YearMonth"""
    else:
        parm = (CAR_MAKE_DICT[make],)
        sqlSelectFrequency = """
            WITH FilteredCars AS (
            SELECT RecId, DateFirst
            FROM CarsTable
            WHERE Category = %s
            )
            SELECT T1.yearMonth, 
                COUNT(T2.RecId) as Count
            FROM calendarTable T1
            LEFT JOIN FilteredCars T2 
                ON T1.db_date = T2.DateFirst
            WHERE T1.db_date <= CURDATE() 
            AND T1.Year >= YEAR(CURDATE()) - 1
            GROUP BY T1.yearMonth;
        """  

    mydb2, mycursorFreq = getMyCursor(sqlSelectFrequency, parm, True)

    freqDict = mycursorFreq.fetchall()
    freqDict = jsonify(freqDict)

    return freqDict.data


def getMyCursor(_sqlSelect, _parm=None, _dict=False):
    mydb = mysql.connector.connect(
        host=os.environ.get("SBHOST"),
        user=os.environ.get("SBUSER"),
        password=os.environ.get("SBDBPASS"),
        database=os.environ.get("SBDB")
    )

    mycursor = mydb.cursor(buffered=True, dictionary=_dict)
    mycursor.execute(_sqlSelect, _parm)

    return mydb, mycursor


if __name__ == "__main__":
    session.init_app(app)
    app.run()
