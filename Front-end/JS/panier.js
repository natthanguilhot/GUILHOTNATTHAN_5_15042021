import {formulaireCommande, affichageProdPanier, totalProductInCart, storage} from './script.js';

totalProductInCart();

//Requête pour afficher les produits du panier
fetch("http://localhost:3000/api/cameras")
.then(response => response.json()
.then(response => {
    let productInCart = [];
    productInCart = storage.load('produit');

    affichageProdPanier(response, productInCart);
    
    formulaireCommande(productInCart);
})
);