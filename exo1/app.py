# Importation de Flask (Concept de serveur Web, Slide 4 du cours)
from flask import Flask, render_template

app = Flask(__name__)

# Données PERSONS (Source : Page 6 du TP)
# Ces données sont gérées ici côté serveur (Modèle Classique, Slide 5)
PERSONS = [
    {'id': 1, 'nom': 'JOHN', 'prenom': 'DOE', 'points': 15},
    {'id': 2, 'nom': 'BOB', 'prenom': 'CARLTON', 'points': 9},
    {'id': 3, 'nom': 'RAYANE', 'prenom': 'SMITH', 'points': 13}
]

@app.route('/')
def index():
    # Envoi de la page complète (Slide 5: "Traditional Web Application Model")
    return render_template('index.html')

@app.route('/getData')
def get_data():
    # Rendu côté serveur (Slide 7: "Server-side rendering")
    return render_template('data.html', persons=PERSONS)

if __name__ == '__main__':
    app.run(debug=True, port=5000)