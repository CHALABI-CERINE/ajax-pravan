# Exercice 3 : Service Web REST CRUD
# Basé sur TP8 (slides REST API)

from flask import Flask, request, jsonify, make_response
from flaskext.mysql import MySQL   # Connecteur MySQL

app = Flask(__name__)

# Configuration MySQL (adapter selon ton environnement)
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = 'Cerine2009@'
app.config['MYSQL_DATABASE_DB'] = 'db_persons'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'

mysql = MySQL()
mysql.init_app(app)

# -------------------------------
# Endpoint CONSULTATION (GET)
# -------------------------------
@app.route('/api/persons', methods=["GET"])
def selectPersons():
    conn = mysql.connect()
    cursor = conn.cursor()
    cursor.execute("SELECT id, nom, prenom, points FROM PERSON")
    
    data = cursor.fetchall()
    row_headers = [x[0] for x in cursor.description]
    cursor.close()
    
    json_data = []
    for result in data:   # boucle for → slide 30
        json_data.append(dict(zip(row_headers, result)))
    
    return make_response(jsonify(json_data), 200)

# -------------------------------
# Endpoint INSERTION (POST)
# -------------------------------
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

    req = f"INSERT INTO PERSON VALUES({new_ID}, '{nom}', '{prenom}', {points}, NULL)"
    cursor.execute(req)
    conn.commit()
    cursor.close()

    return make_response(jsonify({"id": int(new_ID)}), 201)

# -------------------------------
# Endpoint MISE À JOUR (PUT)
# -------------------------------
@app.route('/api/persons/<string:id>', methods=["PUT"])
def updatePerson(id):
    nom = request.form.get("valNom")
    prenom = request.form.get("valPrenom")
    points = request.form.get("valPoints")

    if not nom or not prenom or not points:
        return make_response("Missing parameters", 400)

    conn = mysql.connect()
    cursor = conn.cursor()
    
    req = f"UPDATE PERSON SET nom='{nom}', prenom='{prenom}', points={points} WHERE id={id}"
    cursor.execute(req)
    conn.commit()
    cursor.close()

    return make_response("Record updated", 200)

# -------------------------------
# Endpoint SUPPRESSION (DELETE)
# -------------------------------
@app.route('/api/persons/<string:id>', methods=["DELETE"])
def deletePerson(id):
    conn = mysql.connect()
    cursor = conn.cursor()
    cursor.execute(f"DELETE FROM PERSON WHERE id={id}")
    conn.commit()
    cursor.close()

    return make_response("Record deleted", 204)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
