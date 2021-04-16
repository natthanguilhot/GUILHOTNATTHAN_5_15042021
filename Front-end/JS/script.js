let photoZurss = document.querySelector('#photo_zurss');
fetch('http://localhost:3000/api/cameras')
.then(response => response.json()
.then(response => photoZurss.setAttribute('src',response[0].imageUrl)));

let nomZurss = document.querySelector('#nom_zurss');
fetch('http://localhost:3000/api/cameras')
.then(response => response.json()
.then(response => nomZurss.innerHTML = response[0].name));

let descriptionZurss = document.querySelector('#description_zurss');
fetch('http://localhost:3000/api/cameras')
.then(response => response.json()
.then(response => descriptionZurss.innerHTML = response[0].description));

let prixZurss = document.querySelector('#prix_zurss');
fetch('http://localhost:3000/api/cameras')
.then(response => response.json()
.then(response => prixZurss.innerHTML = response[0].price));
