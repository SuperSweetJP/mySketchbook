from distutils.log import error
from wsgiref.simple_server import make_server
from flask import Flask, render_template, redirect, request, url_for, session
from flask_session import Session
from content_management import Content
import mysql.connector

TOPIC_DICT, TAB_DICT, CAR_MAKE_DICT = Content()

app = Flask(__name__)
session = Session()

@app.route("/")
def hello():
  # return render_template("3d.html", TOPIC_DICT = TOPIC_DICT, TAB_DICT = TAB_DICT)
  return redirect('/3d/')

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
    if(selected_make == ''):
      return render_template("web_scraper.html", TOPIC_DICT = TOPIC_DICT, TAB_DICT = TAB_DICT, CAR_MAKE_DICT = CAR_MAKE_DICT, selected_make = selected_make, TableHeader_List = TableHeader_List)
    elif(CAR_MAKE_DICT[selected_make]):
      mydb = mysql.connector.connect(
        host="localhost",
        user="root",
        password="yoloswag",
        database="sslv"
      )

      mycursorCount = mydb.cursor(buffered=True)
      mycursor = mydb.cursor(buffered=True, dictionary=True)

      sqlSelectCount = "SELECT COUNT(*) from carstable WHERE Category = %s"
      sqlSelect = "SELECT Marka, Gads, Motors, Karba, Nobr, Virsb, Skate, Cena, date(FirstSeen), date(LastSeen), DATEDIFF(LastSeen, FirstSeen) AS UpForDays from carstable WHERE Category = %s order by LastSeen desc Limit 30"
      parm = (CAR_MAKE_DICT[selected_make],)

      mycursorCount.execute(sqlSelectCount, parm)
      
      mycursor.execute(sqlSelect, parm)

      return render_template("web_scraper.html", TOPIC_DICT = TOPIC_DICT, TAB_DICT = TAB_DICT, CAR_MAKE_DICT = CAR_MAKE_DICT, selected_make = selected_make, mycursor = mycursor, TableHeader_List = TableHeader_List, mycursorCount = mycursorCount)

  return render_template("web_scraper.html", TOPIC_DICT = TOPIC_DICT, TAB_DICT = TAB_DICT, CAR_MAKE_DICT = CAR_MAKE_DICT, selected_make = selected_make, TableHeader_List = TableHeader_List)


  #return render_template("web_scraper.html", TOPIC_DICT = TOPIC_DICT, TAB_DICT = TAB_DICT)

if __name__ == "__main__":
  # Quick test configuration. Please use proper Flask configuration options
  # in production settings, and use a separate file or environment variables
  # to manage the secret key!
  app.secret_key = 'super secret key' 
  app.config['SESSION_TYPE'] = 'filesystem'

  session.init_app(app)

  app.debug = True
  app.run()