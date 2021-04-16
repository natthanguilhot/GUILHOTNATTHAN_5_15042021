// Produit 0
let photoP0 = document.querySelector('#photo_p0');
let nomP0 = document.querySelector('#nom_p0');

fetch('http://localhost:3000/api/cameras')
.then(response => response.json()
.then(products => {
    for(let product of products) {
        console.log(product)
        // pour chaque produit, recuperer les infos et les cloner la div carte en enelevant id,  etc...
    }
}));
