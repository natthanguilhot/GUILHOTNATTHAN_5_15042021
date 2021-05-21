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
};
totalProductInCart();
//
// Affichage produits page index
function affichageProduitsIndex (response) {
    for(let product of response) {
        let carteProd = document.querySelector('#carte');
        let noeudParent = document.querySelector('#noeud_parent');
        let newCarteProd = carteProd.cloneNode(true);
        noeudParent.appendChild(newCarteProd);
        newCarteProd.removeAttribute('id');
        newCarteProd.classList.remove('hidden');

        let imgProduct = newCarteProd.querySelector('img');
        let nomProdct = newCarteProd.querySelector('.nom_produit')
        let descriptionProduct = newCarteProd.querySelector('.description_produit');
        let prixProduct = newCarteProd.querySelector('.prix_produit');

        imgProduct.setAttribute('src', product.imageUrl);
        nomProdct.innerHTML = product.name;
        descriptionProduct.innerHTML = product.description;
        let price = new Intl.NumberFormat('fr-FR', {style :'currency', currency :'EUR', minimumFractionDigits : 2}).format(product.price/100);

        prixProduct.innerHTML = price;

        let id = product._id;

        const url = new URL(baseUrl + 'product.html');
        url.searchParams.append('id', id);

        let lienProduct = newCarteProd.querySelector('.lien');
        lienProduct.setAttribute('href',url);
    }
};
//
// Controle formualair et envoie
function formulaireCommande () {
    // Formulaire de commande
    let btnFormulaireCommande = document.querySelector('#btncommande');
    btnFormulaireCommande.addEventListener('click', function(){
        let nomForm = document.querySelector('#lastname').value;
        let prenomForm = document.querySelector('#firstname').value;
        let adresseForm = document.querySelector('#adresse').value;
        let villeForm = document.querySelector('#city').value;
        let mailForm = document.querySelector('#mail').value;
        let contact = [];
        let formContact = {
            firstName : prenomForm,
            lastName : nomForm,
            address : adresseForm,
            city : villeForm,
            email : mailForm,
        }
        let tablProductId = [];
        for(let prod of productInCart) {
            tablProductId.push(prod.id);
        };
        let data = {
            contact : formContact,
            products : tablProductId,
        };

        if(nomPrenomVilleControl(nomForm, prenomForm, villeForm) && emailControl(mailForm) && addressControl(adresseForm)) { // on controle le formulaire, Si formulaire ok traitement ci dessous, sinon les fonctions envoie une alerte
            contact.push(formContact); // on push le formulaire dans le tableau contact
            fetch("http://localhost:3000/api/cameras/order", {
            method: 'POST',
            headers: { 
            'Accept': 'application/json', 
            'Content-Type': 'application/json' 
            },
                body: JSON.stringify(data), // On envoie les données au serveur
            })
            .then(response => response.json())
            .then(response => {
                let order = []; // on créé un tableau order
                let orderResume = { // on créé un objet résumé
                    orderLength : response.products.length,
                    orderId : response.orderId,
                    prenom : response.contact.firstName
                }
                order.push(orderResume); // on push l'objet dans le tableau 
                localStorage.setItem('order', JSON.stringify(order)); // on envoie le tableau dans le LS
            });
            localStorage.removeItem('produit'); // on vide le panier LS
            window.location.href = "confirmation.html"; // on envoie sur la page confirmation    
        } 
        event.preventDefault();      
    });        
};
//
//
function affichageConfirmationCommande () {
    let orderResume = JSON.parse(localStorage.getItem("order"));
    let nameResumeHTML = document.querySelector('#name');
    let numberOfProductResumeHTML = document.querySelector('#nbr_produit');
    let orderIdHTML = document.querySelector('#order_id');
    nameResumeHTML.innerHTML = orderResume[0].prenom;
    numberOfProductResumeHTML.innerHTML = orderResume[0].orderLength;
    orderIdHTML.innerHTML = orderResume[0].orderId;
    setTimeout(function(){
        localStorage.remove('order');
    },500)
};
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
    
};

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
 };
 function addressControl (adresseForm) {
    if(/^[A-Za-z0-9-é\s]{5,50}$/.test(adresseForm)) {
        return true;
    } else {
        alert('Adresse incorrect');
        return false;
    }
 };
//