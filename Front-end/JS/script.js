let azerty = document.querySelector('#test');
fetch('http://localhost:3000/api/cameras')
.then(response => response.json()
.then(response => azerty.setAttribute('src',response[0].imageUrl)));