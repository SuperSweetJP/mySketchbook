# from distutils.log import error
from wsgiref.simple_server import make_server
from flask import Flask, render_template, redirect, request, url_for, session, jsonify, make_response
from flask_session import Session
import json
#from .content_management import _load_diary_posts
#from .content_management import Content
# from content_management import Content
# from content_management import _load_diary_posts
try:
    from .content_management import Content
    from .content_management import _load_blog_posts
    from .utils.html_post import wrap_all_markdown_imgs
except ImportError:
    from content_management import Content
    from content_management import _load_blog_posts
    from utils.html_post import wrap_all_markdown_imgs
import mysql.connector
from dotenv import load_dotenv, find_dotenv
import os
import sentry_sdk
from flask import Flask
from sentry_sdk.integrations.flask import FlaskIntegration
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent
BLOG_DIR = BASE_DIR / "static" / "blog"

TOPIC_DICT, TAB_DICT, CAR_MAKE_DICT = Content()

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
    return redirect('/blog/')


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

@app.route("/tome/")
def tome():
    return render_template("tome.html", TOPIC_DICT=TOPIC_DICT, TAB_DICT=TAB_DICT)

@app.route("/cassette_tape/")
def cassette_tape():
    return render_template("cassette_tape.html", TOPIC_DICT=TOPIC_DICT, TAB_DICT=TAB_DICT)

@app.route("/chalice/")
def chalice():
    return render_template("chalice.html", TOPIC_DICT=TOPIC_DICT, TAB_DICT=TAB_DICT)

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

@app.route("/maze_golf/")
def maze_golf():
    return render_template("maze_golf.html", TOPIC_DICT=TOPIC_DICT, TAB_DICT=TAB_DICT)

@app.route("/maze_golf_emb/")
def maze_golf_emb():
    return render_template("maze_golf_emb.html", TOPIC_DICT=TOPIC_DICT, TAB_DICT=TAB_DICT)

@app.route("/grid_test/")
def grid_test():
    return render_template("grid_test.html", TOPIC_DICT=TOPIC_DICT, TAB_DICT=TAB_DICT)

@app.route("/grid_test_emb/")
def grid_test_emb():
    return render_template("grid_test_emb.html", TOPIC_DICT=TOPIC_DICT, TAB_DICT=TAB_DICT)

@app.route("/3d_menu/")
def threed_menu():
    return render_template("3d_menu.html", TOPIC_DICT=TOPIC_DICT, TAB_DICT=TAB_DICT)

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
                sqlSelectCount = "SELECT COUNT(*) from CarsTable WHERE Category = %s AND Marka = %s and Year >= YEAR(CURDATE()) - 1"
                sqlSelectFrequency = """SELECT T1.yearMonth, Count(T2.RecId) as Count FROM calendarTable T1
                                LEFT JOIN CarsTable T2 on T1.db_date = T2.DateFirst and T2.Category = %s and T2.Marka = %s
                                WHERE T1.db_date < CURDATE() and T1.Year >= YEAR(CURDATE()) - 1
                                GROUP BY T1.YearMonth"""
                sqlSelect = "SELECT Marka, GadsMod, Motors, Karba, Nobr, Virsb, Skate, Cena, date(FirstSeen), date(LastSeen), DATEDIFF(LastSeen, FirstSeen) AS UpForDays from CarsTable WHERE Category = %s AND Marka = %s order by LastSeen desc Limit 30"
                parm = (CAR_MAKE_DICT[selected_make], selected_model)
            else:
                sqlSelectCount = "SELECT COUNT(*) from CarsTable WHERE Category = %s and Year >= YEAR(CURDATE()) - 1"
                sqlSelectFrequency = """SELECT T1.yearMonth, Count(T2.RecId) as Count FROM calendarTable T1
                                LEFT JOIN CarsTable T2 on T1.db_date = T2.DateFirst and T2.Category = %s
                                WHERE T1.db_date < CURDATE() and T1.Year >= YEAR(CURDATE()) - 1
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


@app.route("/blog/")
def blog_index():
    blog_cards = _load_blog_posts()
    return render_template("blog_index.html",
                           TOPIC_DICT=TOPIC_DICT, TAB_DICT=TAB_DICT,
                           BLOG_CARDS=blog_cards)

@app.route("/blog/<slug>/")
def blog_detail(slug):
     # [Title, CardType, SupportingText, Date, Link, [Chips], Width, body]
    post = _load_blog_posts(slug)
    title = post[0]
    date = post[3]
    tags = post[5]
    body_md = post[7]

    # render markdown (simple, built-in fallback)
    try:
        import markdown
        body_html = markdown.markdown(body_md, extensions=["fenced_code", "tables", "codehilite"])
        body_html = wrap_all_markdown_imgs(body_html)
    except Exception:
        # very basic fallback: paragraphs
        body_html = "".join(f"<p>{line}</p>" for line in body_md.split("\n\n"))
    return render_template("blog_entry.html",
                           TOPIC_DICT=TOPIC_DICT, TAB_DICT=TAB_DICT,
                           title=title, date=date, tags=tags, body_html=body_html)


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
