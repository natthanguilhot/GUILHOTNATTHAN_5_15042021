// Affichage nombre produit dans le panier
function totalProductInCart() {
    let numberOfProductInCart = document.querySelector('#number_prod_in_cart');
    productInCart = [];
    productInCart = JSON.parse(localStorage.getItem('produit'));

    if (productInCart === null) {
        numberOfProductInCart.innerHTML = '0';
    }else {
        let numberTotalOfProductInCart = productInCart.length;
        numberOfProductInCart.innerHTML = numberTotalOfProductInCart;
    }    
}
totalProductInCart();
//
//
function affichageConfirmationCommande () {
    let orderResume = JSON.parse(localStorage.getItem("order"));
    console.log(orderResume);
    let nameResumeHTML = document.querySelector('#name');
    let numberOfProductResumeHTML = document.querySelector('#nbr_produit');
    let orderIdHTML = document.querySelector('#order_id');
    nameResumeHTML.innerHTML = orderResume[0].prenom;
    numberOfProductResumeHTML.innerHTML = orderResume[0].orderLength;
    orderIdHTML.innerHTML = orderResume[0].orderId;
    setTimeout(function(){
        localStorage.clear();
    },1)
}
function affichageProdPanier(response) {

    for(let product of productInCart) {
        prixPanier = product.prix + prixPanier;
        // Copie du template et ajout du clone au noeud parent
        let newCarteProdPanier = carteProdPanier.cloneNode(true);
        parentNodePanier.appendChild(newCarteProdPanier);
        newCarteProdPanier.removeAttribute('id');
        newCarteProdPanier.classList.remove('hidden');
        let btnSuppr = newCarteProdPanier.querySelector('.supprimer_produit_panier');
        btnSuppr.dataset.id = dataId+1;
        dataId += 1;
        let imgProduit = newCarteProdPanier.querySelector('.img_produit');
        let nomProduit = newCarteProdPanier.querySelector('.nom_produit');
        let optionProduit = newCarteProdPanier.querySelector('.option_produit');
        let qteProduit = newCarteProdPanier.querySelector('.qte_produit');
        let prixProduit = newCarteProdPanier.querySelector('.prix_produit');
        let price = new Intl.NumberFormat('fr-FR', {style :'currency', currency :'EUR', minimumFractionDigits : 2}).format(product.prix/100);
        nomProduit.innerHTML = product.nom;
        optionProduit.innerHTML = product.option;
        prixProduit.innerHTML = price;
        qteProduit.innerHTML = product.qty;
        //
        
        // Afficher l'image lié à l'id du produit
        let productId = product.id;
        for(let product of response) {
            if(productId === product._id) {
                imgProduit.setAttribute('src', product.imageUrl);
            }
        }
        //
    }
    // Suppresion du produit 
    dataId = -1;
    let allBtnSuppr = document.querySelectorAll('.supprimer_produit_panier');
    for(let btn of allBtnSuppr) {
        btn.addEventListener('click', function() {
            let idData = this.dataset.id;
            console.log(idData);
            productInCart.splice([idData],1);
            localStorage.setItem('produit', JSON.stringify(productInCart));
            let allDivProduit = document.querySelectorAll('.produit');
            for(let div of allDivProduit) {
                div.parentElement.removeChild(div);        
            }
            affichageProdPanier(response);
            totalProductInCart();
        });    
    }
    //

    // Affichage du prix
    let livraison = 499;
    let prixTotalPanier = prixPanier + livraison;
    let prixPanierHTML = document.querySelector('#prix_panier');
    let prixTotalHTML = document.querySelector('#prix_total');
    let pricePanier = new Intl.NumberFormat('fr-FR', {style :'currency', currency :'EUR', minimumFractionDigits : 2}).format(prixPanier/100); 
    let priceTotalPanierConvert = new Intl.NumberFormat('fr-FR', {style :'currency', currency :'EUR', minimumFractionDigits : 2}).format(prixTotalPanier/100); 
    prixPanierHTML.innerHTML = pricePanier;
    prixTotalHTML.innerHTML = priceTotalPanierConvert;
    //
    
}

// Fonctions validation formulaire
function nomPrenomVilleControl(nomForm, prenomForm, villeForm) {
    if(/^[A-Za-z\s]{2,20}$/.test(nomForm) && /^[A-Za-z]{2,20}$/.test(prenomForm) && /^[A-Za-z]{2,20}$/.test(villeForm)) {
     return true;
    }else {
     alert("Les champs Nom, Prénom et Ville ne doivent contenir que des lettres et pas d'espace inutile.")
     return false;
    }
 };
 function emailControl (email) {
    if(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
        return true;
    } else {
        alert('Email incorrect');
        return false;
    }
 }
 function addressControl (adresseForm) {
    if(/^[A-Za-z0-9-é\s]{5,50}$/.test(adresseForm)) {
        return true;
    } else {
        alert('Adresse incorrect');
        return false;
    }
 }
