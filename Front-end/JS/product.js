import {totalProductInCart,affichageProduit, produit} from './script.js';
totalProductInCart();
// Récupération de l'id du produit via l'url
const url = new URL(window.location.href);
const id = url.searchParams.get('id');
//
// Requête au produit correspondant à l'id et affichage de celui ci
fetch("http://localhost:3000/api/cameras/"+ id)
.then(response => response.json()
.then(response => {
    produit(response);
}));