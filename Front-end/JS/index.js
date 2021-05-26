import {affichageProduitsIndex, totalProductInCart} from './script.js';

totalProductInCart();

// Affichage des produits
fetch('http://localhost:3000/api/cameras')
.then(response => response.json()
.then(products => {
    affichageProduitsIndex(products);
}));
//
