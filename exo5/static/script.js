let lignes = 0;
let total_points = 0;
let persons = [];
let httpRequest;

function init() {
  getPersons();
}

function actualiser() {
  getPersons();
}

function getPersons() {
  httpRequest = new XMLHttpRequest();
  httpRequest.open("GET", "/api/persons");
  httpRequest.onreadystatechange = doAfficherPersons;
  httpRequest.send();
}

function doAfficherPersons() {
  if (httpRequest.readyState === XMLHttpRequest.DONE) {
    if (httpRequest.status === 200) {
      const table = document.getElementsByTagName("table")[0];
      const rows = table.getElementsByClassName("row");
      while (rows.length > 0) {
        rows[0].remove();
      }

      lignes = 0;
      total_points = 0;

      let response = httpRequest.responseText;
      persons = JSON.parse(response);

      for (let person of persons) {
        doInsert(person.id, person.nom, person.prenom, person.points);
      }
    } else {
      alert("Petit souci !");
    }
  }
}

function doInsert(id, nom, prenom, points) {
  lignes++;
  total_points += points;
  doInsertRowTable(id, nom, prenom, points);
  update_summary();
}

function doInsertRowTable(id, nom, prenom, points) {
  const table = document.getElementsByTagName("table")[0];
  const row = table.insertRow();
  row.className = "row";

  row.insertCell(0).innerText = id;
  row.insertCell(1).innerText = nom;
  row.insertCell(2).innerText = prenom;
  row.insertCell(3).innerText = points;
  row.insertCell(4).innerHTML = "<input type='checkbox'/>";
}

function update_summary() {
  document.getElementById("ligne_count").innerText = lignes + " ligne(s)";
  document.getElementById("total_points").innerText = "Total point(s)= " + total_points;
}


function doNewData() {
  let elt_nom = document.getElementById("form_nom");
  let elt_prenom = document.getElementById("form_prenom");
  let elt_points = document.getElementById("form_points");

  let nom = elt_nom.value;
  let prenom = elt_prenom.value;
  let points = parseInt(elt_points.value);

  if (nom === "" || prenom === "" || Number.isNaN(points)) {
    alert("Formulaire incomplet !");
  } else {
    httpRequest = new XMLHttpRequest();
    httpRequest.open("POST", "/api/persons");
    httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    httpRequest.onreadystatechange = function () {
      if (httpRequest.readyState === 4 && httpRequest.status === 201) {
        let resp = JSON.parse(httpRequest.responseText);
        let id = resp["id"];
        doInsert(id, nom, prenom, points);
        persons.push({ id, nom, prenom, points });
      }
    };

    let data = "valNom=" + nom + "&valPrenom=" + prenom + "&valPoints=" + points;
    httpRequest.send(data);

    elt_nom.value = "";
    elt_prenom.value = "";
    elt_points.value = "";
  }
}
