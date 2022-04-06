from flask import Flask, render_template, redirect, request
from .content_management import Content

TOPIC_DICT, TAB_DICT = Content()

app = Flask(__name__)

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

@app.route("/swarm_model_anim/")
def swarm_model_anim():
  return render_template("swarm_model_anim.html", TOPIC_DICT = TOPIC_DICT, TAB_DICT = TAB_DICT)

@app.route("/data/")
def data():
  return render_template("data.html", TOPIC_DICT = TOPIC_DICT, TAB_DICT = TAB_DICT)

@app.route("/orbit_controls/")
def orbit_controls():
  return render_template("orbit_controls.html", TOPIC_DICT = TOPIC_DICT, TAB_DICT = TAB_DICT)

if __name__ == "__main__":
  app.run()