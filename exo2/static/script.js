/**
 * Récupère les données de manière asynchrone (Slide 23-30 du cours)
 */
function getData() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/getData', true);

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // Désérialisation JSON (Slide 77 du cours)
            var data = JSON.parse(xhr.responseText);
            doAfficherData(data);
        }
    };
    xhr.send();
}

/**
 * Gère l'affichage dans la zone "res" (Page 13 du TP)
 */
function doAfficherData(data) {
    var res = document.getElementById("res");
    res.innerHTML = ""; // On vide la zone
    
    // On crée le tableau et on l'ajoute au DOM
    var table = createTable(data);
    res.append(table);
}

/**
 * Crée l'élément table et ses entêtes (Page 14-16 du TP)
 */
function createTable(data) {
    var table = document.createElement("table");
    table.setAttribute("border", "1");

    // Création des entêtes
    var row = document.createElement("tr");
    var th_id = document.createElement("th");
    var th_nom = document.createElement("th");
    var th_prenom = document.createElement("th");
    var th_points = document.createElement("th");

    th_id.innerText = "No";
    th_nom.innerText = "Nom";
    th_prenom.innerText = "Prenom";
    th_points.innerText = "Points";

    row.append(th_id);
    row.append(th_nom);
    row.append(th_prenom);
    row.append(th_points);
    table.append(row);

    // Remplissage avec les données (Page 17 du TP)
    data.forEach(function(person) {
        insertRow(person, table);
    });

    return table;
}

/**
 * Insère une ligne pour chaque personne (Page 18 du TP)
 */
function insertRow(person, table) {
    var row = document.createElement("tr");

    var td_id = document.createElement("td");
    var td_nom = document.createElement("td");
    var td_prenom = document.createElement("td");
    var td_points = document.createElement("td");

    td_id.innerText = person["id"];
    td_nom.innerText = person["nom"];
    td_prenom.innerText = person["prenom"];
    td_points.innerText = person["points"];

    row.append(td_id);
    row.append(td_nom);
    row.append(td_prenom);
    row.append(td_points);

    table.append(row);
}