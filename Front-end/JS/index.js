const baseUrl = "http://127.0.0.1:5500/Front-end/HTML/";

// Affichage des produits
fetch('http://localhost:3000/api/cameras')
.then(response => response.json()
.then(products => {
    affichageProduitsIndex(products);
}));
//
