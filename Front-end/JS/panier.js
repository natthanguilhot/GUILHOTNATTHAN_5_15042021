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

    // Suppresion du produit 
    let allBtnSuppr = document.querySelectorAll('.supprimer_produit_panier');
    for(let btn of allBtnSuppr) {
        btn.addEventListener('click', function() {
            let idData = this.parentNode.dataset.id;
            productInCart.splice([idData],1);
            localStorage.setItem('produit', JSON.stringify(productInCart));
            window.location.reload(); // TODO mettre fonction recharger panier et non la page
        });    
    }
    //

    // Formulaire de commande
    let btnFormulaireCommande = document.querySelector('#btncommande');
    btnFormulaireCommande.addEventListener('click', function(){
        let nomForm = document.querySelector('#lastname').value;
        let prenomForm = document.querySelector('#firstname').value;
        let adresseFrom = document.querySelector('#adresse').value;
        let villeForm = document.querySelector('#city').value;
        let mailForm = document.querySelector('#mail').value;
        let contact = [];
        let formContact = {
            firstName : prenomForm,
            lastName : nomForm,
            address : adresseFrom,
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

        function nomPrenomVilleControl() {
           if(/^[A-Za-z]{2,20}$/.test(nomForm) && /^[A-Za-z]{2,20}$/.test(prenomForm) && /^[A-Za-z]{2,20}$/.test(villeForm)) {
            return true;
           }else {
            alert('Les champs Nom, Prénom et Ville ne doivent contenir que des lettres.')
            return false;
           }
        };
        function emailControl () {
            if(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(mailForm)){
                return true;
            } else {
                alert('Email incorrect');
                return false;
            }
        }
        function addressControl () {
            if(/^[A-Za-z0-9\s]{5,50}$/.test(villeForm)) {
                return true;
            } else {
                alert('Adresse incorrect');
                return false;
            }
        }
        if(nomPrenomVilleControl() && emailControl() && addressControl()) { // Si formulaire ok alors
            contact.push(formContact); // on push le formulaire dans le tableau contact
            console.log(data);
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
                    orderId : response.orderId
                }
                order.push(orderResume); // on push l'objet dans le tableau 
                localStorage.setItem('order', JSON.stringify(order)); // on envoie le tableau dans le LS
            });
        }
        event.preventDefault();
        localStorage.clear('produit'); // on vide le panier LS
        window.location.href = "confirmation.html"; // on envoie sur la page confirmation
    });        
}));

