from distutils.log import error
from wsgiref.simple_server import make_server
from flask import Flask, render_template, redirect, request, url_for, session, jsonify
from flask_session import Session
from .content_management import Content
import mysql.connector
from dotenv import load_dotenv, find_dotenv
import os

TOPIC_DICT, TAB_DICT, CAR_MAKE_DICT = Content()

app = Flask(__name__)
session = Session()
load_dotenv(find_dotenv()) 

@app.route("/")
def hello():
  # return render_template("3d.html", TOPIC_DICT = TOPIC_DICT, TAB_DICT = TAB_DICT)
  return redirect('/data/')

@app.route("/dynamics_notes/")
def dynamicsNotes():
  return render_template("dynamics_notes.html", TOPIC_DICT = TOPIC_DICT, TAB_DICT = TAB_DICT)

@app.errorhandler(404)
def pageNoFound(e):
  return render_template("404.html", TOPIC_DICT = TOPIC_DICT, TAB_DICT = TAB_DICT)

@app.route("/3d/")
def threeD():
  return render_template("3d.html", TOPIC_DICT = TOPIC_DICT, TAB_DICT = TAB_DICT)

@app.route("/city_scape/")
def cityScape():
  return render_template("city_scape.html", TOPIC_DICT = TOPIC_DICT, TAB_DICT = TAB_DICT)

@app.route("/contact/")
def contact():
  return render_template("contact.html", TOPIC_DICT = TOPIC_DICT, TAB_DICT = TAB_DICT)

@app.route("/about/")
def about():
  return render_template("about.html", TOPIC_DICT = TOPIC_DICT, TAB_DICT = TAB_DICT)

@app.route("/text_entry/")
def text_entry():
  return render_template("text_entry.html", TOPIC_DICT = TOPIC_DICT, TAB_DICT = TAB_DICT)

@app.route("/text_entry2/")
def text_entry2():
  return render_template("text_entry2.html", TOPIC_DICT = TOPIC_DICT, TAB_DICT = TAB_DICT)

@app.route("/clamp_quaternion/")
def clamp_quaternion():
  return render_template("clamp_quaternion.html", TOPIC_DICT = TOPIC_DICT, TAB_DICT = TAB_DICT)

@app.route("/swarm_model/")
def swarm_model():
  return render_template("swarm_model.html", TOPIC_DICT = TOPIC_DICT, TAB_DICT = TAB_DICT)

@app.route("/chess_knight/")
def chess_knight():
  return render_template("chess_knight.html", TOPIC_DICT = TOPIC_DICT, TAB_DICT = TAB_DICT)

@app.route("/swarm_model_anim/")
def swarm_model_anim():
  return render_template("swarm_model_anim.html", TOPIC_DICT = TOPIC_DICT, TAB_DICT = TAB_DICT)

@app.route("/data/")
def data():
  return render_template("data.html", TOPIC_DICT = TOPIC_DICT, TAB_DICT = TAB_DICT)

@app.route("/orbit_controls/")
def orbit_controls():
  return render_template("orbit_controls.html", TOPIC_DICT = TOPIC_DICT, TAB_DICT = TAB_DICT)

@app.route("/web_scraper/", methods = ['POST', 'GET'])
def web_scraper():
  selected_make = ''
  # table headers
  TableHeader_List = ["Model", "Year", "Engine", "Transmission", "Mileage (km)", "Body", "Tech.Eval.", "Price", "FirstSeen", "LastSeen", "UpForDays"]
  if request.method == "POST":
    selected_make = request.form['make']
    selected_model = request.form['model']

    if(selected_make == ''):
      return render_template("web_scraper.html", TOPIC_DICT = TOPIC_DICT, TAB_DICT = TAB_DICT, CAR_MAKE_DICT = CAR_MAKE_DICT, selected_make = selected_make, TableHeader_List = TableHeader_List)
    elif(CAR_MAKE_DICT[selected_make]):
      #alter sql queries and parms if model selected
      if(selected_model != ''):
        sqlSelectCount = "SELECT COUNT(*) from CarsTable WHERE Category = %s AND Marka = %s"
        sqlSelect = "SELECT Marka, GadsMod, Motors, Karba, Nobr, Virsb, Skate, Cena, date(FirstSeen), date(LastSeen), DATEDIFF(LastSeen, FirstSeen) AS UpForDays from CarsTable WHERE Category = %s AND Marka = %s order by LastSeen desc Limit 30"
        parm = (CAR_MAKE_DICT[selected_make], selected_model)
      else:
        sqlSelectCount = "SELECT COUNT(*) from CarsTable WHERE Category = %s"
        sqlSelect = "SELECT Marka, GadsMod, Motors, Karba, Nobr, Virsb, Skate, Cena, date(FirstSeen), date(LastSeen), DATEDIFF(LastSeen, FirstSeen) AS UpForDays from CarsTable WHERE Category = %s order by LastSeen desc Limit 30"
        parm = (CAR_MAKE_DICT[selected_make], )

      

      mydb, mycursorCount = getMyCursor(sqlSelectCount, parm)
      mydb2, mycursor = getMyCursor(sqlSelect, parm, True)

      rowCount = [item[0] for item in mycursorCount.fetchall()]

      return render_template("web_scraper.html", TOPIC_DICT = TOPIC_DICT, TAB_DICT = TAB_DICT, CAR_MAKE_DICT = CAR_MAKE_DICT, selected_make = selected_make, selected_model = selected_model, mycursor = mycursor, TableHeader_List = TableHeader_List, rowCount = rowCount)

  return render_template("web_scraper.html", TOPIC_DICT = TOPIC_DICT, TAB_DICT = TAB_DICT, CAR_MAKE_DICT = CAR_MAKE_DICT, selected_make = selected_make, TableHeader_List = TableHeader_List)

#handle dynamic dropdown values > js
@app.route('/_get_updated_settings')
def get_updated_settings():
  # print(request.args)

  make = request.args.get('make')
  output = {}
  if(make != ''):
    parm = (CAR_MAKE_DICT[make],)
    sqlSelectModels = "SELECT DISTINCT Marka from CarsTable WHERE Category = %s and Marka <> '' ORDER BY Marka ASC"

    mydb, mycursor = getMyCursor(sqlSelectModels, parm, True)
    output['model'] = [item['Marka'] for item in mycursor.fetchall()]
    
  
  return jsonify(output)

def getMyCursor(_sqlSelect, _parm, _dict = False):
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
  app.config.from_pyfile('settings.py')
  app.secret_key = os.environ.get("SBSECRETKEY")
  app.config['SESSION_TYPE'] = 'filesystem'

  session.init_app(app)

  app.debug = os.environ.get("DEBUG")
  app.run()