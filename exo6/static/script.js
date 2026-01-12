let lignes = 0;
let total_points = 0;
let persons = [];
let httpRequest;

// --- DOM helpers ---
function getDOM() {
  const table = document.getElementsByTagName("table")[0];
  const tbody = table.tBodies[0] || table.querySelector("tbody");
  const tfoot = table.tFoot || table.querySelector("tfoot");
  return { table, tbody, tfoot };
}

// --- Init & Refresh ---
function init() {
  getPersons();
}

function actualiser() {
  getPersons();
}

// --- GET persons ---
function getPersons() {
  httpRequest = new XMLHttpRequest();
  httpRequest.open("GET", "/api/persons");
  httpRequest.onreadystatechange = doAfficherPersons;
  httpRequest.send();
}

function doAfficherPersons() {
  if (httpRequest.readyState === XMLHttpRequest.DONE) {
    if (httpRequest.status === 200) {
      const { tbody } = getDOM();

      // Clear tbody rows
      while (tbody.firstChild) tbody.removeChild(tbody.firstChild);

      // Reset counters
      lignes = 0;
      total_points = 0;

      persons = JSON.parse(httpRequest.responseText);
      for (let person of persons) {
        doInsert(person.id, person.nom, person.prenom, person.points);
      }
    } else {
      alert("Petit souci !");
    }
  }
}

// --- Insert row and update summary ---
function doInsert(id, nom, prenom, points) {
  lignes++;
  total_points += Number(points);
  doInsertRowTable(id, nom, prenom, points);
  update_summary();
}

function doInsertRowTable(id, nom, prenom, points) {
  const { tbody } = getDOM();
  const row = document.createElement("tr");
  row.className = "row";

  const col1 = document.createElement("td");
  const col2 = document.createElement("td");
  const col3 = document.createElement("td");
  const col4 = document. createElement("td");
  const col5 = document.createElement("td");
  const col6 = document.createElement("td");

  col1.innerText = id;
  col2.innerText = nom;
  col3.innerText = prenom;
  col4.innerText = points;
  col5.innerHTML = "<input type='checkbox'/>";

  // Créer le bouton Edit
  var btnEdit = document.createElement("button");
  btnEdit.innerText = "Edit";
  btnEdit.className = "btn-edit";
  btnEdit.onclick = function() {
    editRow(btnEdit);
  };
  col6.append(btnEdit);

  col1.setAttribute("class", "col_number");
  col2.setAttribute("class", "col_text");
  col3.setAttribute("class", "col_text");
  col4.setAttribute("class", "col_points");
  col5.setAttribute("class", "col_chkbox");
  col6.setAttribute("class", "col_edit");

  row.append(col1, col2, col3, col4, col5, col6);
  tbody.append(row);
}

function update_summary() {
  const left = document.getElementById("ligne_count");
  const right = document. getElementById("total_points");
  if (left) left.innerText = lignes + " ligne(s)";
  if (right) right.innerText = "Total point(s)= " + total_points;
}

// --- Ajouter (POST /api/persons) ---
function doNewData() {
  const elt_nom = document.getElementById("form_nom");
  const elt_prenom = document.getElementById("form_prenom");
  const elt_points = document. getElementById("form_points");

  const nom = elt_nom.value. trim();
  const prenom = elt_prenom.value. trim();
  const points = parseInt(elt_points.value);

  if (! nom || !prenom || Number.isNaN(points)) {
    alert("Formulaire incomplet !");
    return;
  }

  httpRequest = new XMLHttpRequest();
  httpRequest.open("POST", "/api/persons");
  httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  httpRequest.onreadystatechange = function () {
    if (httpRequest.readyState === 4) {
      if (httpRequest.status === 201) {
        const resp = JSON.parse(httpRequest.responseText);
        const id = resp["id"];
        doInsert(id, nom, prenom, points);
        persons.push({ id, nom, prenom, points });
        elt_nom.value = "";
        elt_prenom.value = "";
        elt_points. value = "";
      } else {
        alert("Ajout échoué (" + httpRequest.status + ")");
      }
    }
  };

  const data = "valNom=" + encodeURIComponent(nom) +
               "&valPrenom=" + encodeURIComponent(prenom) +
               "&valPoints=" + encodeURIComponent(points);
  httpRequest.send(data);
}

// --- Console Tableau ---
function consoleTableau() {
  console.log(persons);
}

// --- Supprimer (DELETE /api/persons/<id>) ---
function deletePerson(id) {
  httpRequest = new XMLHttpRequest();
  httpRequest.open('DELETE', '/api/persons/' + id);
  httpRequest.send();
}

function deleteRow() {
  if (confirm('Voulez-vous vraiment supprimer les lignes ?')) {
    const table = document.getElementsByTagName("table")[0];
    const rows = table.getElementsByClassName("row");
    let i = 0;
    
    while (i < rows.length) {
      if (rows[i].childNodes[4].firstChild.checked) {
        total_points = total_points - parseInt(rows[i].childNodes[3].innerText);
        
        const id = parseInt(rows[i].firstChild.innerText);
        deletePerson(id);
        
        rows[i].remove();
        persons.splice(i, 1);
        i--;
        lignes--;
      }
      i++;
    }
    
    alert("Ligne(s) supprimée(s) avec succès !");
    update_summary();
  }
}

// --- Edition (PUT /api/persons/<string:id>) ---
function editRow(btnEdit) {
  // Afficher le formulaire d'édition
  document.getElementById("form_edit_container").hidden = false;
  // Cacher le formulaire d'ajout
  document.getElementById("form_container").hidden = true;

  // Récupérer la ligne tr, en navigant dans les parent de btnEdit
  tr = btnEdit.parentNode. parentNode;

  // Récupérer les valeurs des colonnes en navigant dans les childNodes
  td_id     = tr.childNodes[0];
  td_nom    = tr.childNodes[1];
  td_prenom = tr.childNodes[2];
  td_points = tr.childNodes[3];

  // Récupérer les champs du formulaire d'édition
  elt_id     = document.getElementById("form_edit_id");
  elt_nom    = document.getElementById("form_edit_nom");
  elt_prenom = document.getElementById("form_edit_prenom");
  elt_points = document.getElementById("form_edit_points");

  // Remplir le formulaire d'édition avec les valeurs des colonnes à éditer
  elt_id.value     = td_id.innerText;
  elt_nom.value    = td_nom. innerText;
  elt_prenom.value = td_prenom.innerText;
  elt_points.value = td_points.innerText;
}

function annulerEdit() {
  // Cacher le formulaire d'édition
  document.getElementById("form_edit_container").hidden = true;
  // Afficher le formulaire d'ajout
  document.getElementById("form_container").hidden = false;
}

function doEditData() {
  // Récupérer les champs du formulaire d'édition
  elt_id     = document.getElementById("form_edit_id");
  elt_nom    = document.getElementById("form_edit_nom");
  elt_prenom = document.getElementById("form_edit_prenom");
  elt_points = document.getElementById("form_edit_points");

  // Récupérer leur valeur
  id     = elt_id.value;
  nom    = elt_nom. value;
  prenom = elt_prenom.value;
  points = parseInt(elt_points. value);

  if (nom == "" || prenom == "" || Number.isNaN(points)) {
    alert("Formulaire incomplet !");
  } else {
    // Envoyer la requête PUT avec les valeurs récupérées
    httpRequest = new XMLHttpRequest();
    httpRequest.open("PUT", "/api/persons/" + id);
    httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    // Une fois la requête exécutée, appeler la fonction actualiser
    httpRequest.onreadystatechange = actualiser;

    var data = "valNom=" + nom
             + "&valPrenom=" + prenom
             + "&valPoints=" + points;

    httpRequest.send(data);

    // Vider les champs
    elt_nom.value = "";
    elt_prenom.value = "";
    elt_points.value = "";

    // Masquer le formulaire d'édition et afficher celui d'ajout
    document. getElementById("form_edit_container").hidden = true;
    document.getElementById("form_container").hidden = false;
  }
}