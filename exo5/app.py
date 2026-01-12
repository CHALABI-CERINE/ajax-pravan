from flask import Flask, request, jsonify, make_response, render_template
from flaskext.mysql import MySQL

app = Flask(__name__)

app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = 'pass_root'
app.config['MYSQL_DATABASE_DB'] = 'db_persons'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'

mysql = MySQL()
mysql.init_app(app)

@app.route("/")
def index():
    return render_template("index.html")

@app.route('/api/persons', methods=["GET"])
def selectPersons():
    conn = mysql.connect()
    cursor = conn.cursor()
    cursor.execute("SELECT id, nom, prenom, points FROM PERSON")
    data = cursor.fetchall()
    row_headers = [x[0] for x in cursor.description]
    cursor.close()
    json_data = [dict(zip(row_headers, result)) for result in data]
    return make_response(jsonify(json_data), 200)

@app.route('/api/persons', methods=["POST"])
def insertPerson():
    nom = request.form.get("valNom")
    prenom = request.form.get("valPrenom")
    points = request.form.get("valPoints")

    if not nom or not prenom or not points:
        return make_response("Missing parameters", 400)

    conn = mysql.connect()
    cursor = conn.cursor()
    cursor.execute("SELECT max(id) FROM PERSON")
    max_ID = cursor.fetchall()[0][0] or 0
    new_ID = str(max_ID + 1)
    cursor.execute("INSERT INTO PERSON VALUES(%s, %s, %s, %s, NULL)", (new_ID, nom, prenom, points))
    conn.commit()
    cursor.close()
    return make_response(jsonify({"id": int(new_ID)}), 201)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
