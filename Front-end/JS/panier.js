let prixPanier = 0;
let dataId = -1;
let carteProdPanier = document.querySelector('div#template_carte_produit_panier');
let parentNodePanier = document.querySelector('#liste_produits_panier');

//Requête pour afficher les produits du panier
fetch("http://localhost:3000/api/cameras")
.then(response => response.json()
.then(response => {
    let productInCart = [];
    productInCart = JSON.parse(localStorage.getItem('produit'));

    affichageProdPanier(response);
    
    formulaireCommande();
}));