let prixPanier = 0;
let dataId = -1;

//Requête pour afficher les produits du panier
fetch("http://localhost:3000/api/cameras")
.then(response => response.json()
.then(response => {
    let productInCart = [];
    productInCart = JSON.parse(localStorage.getItem('produit'));
    for(let product of productInCart) {
        prixPanier = product.prix + prixPanier;
        // Copie du template et ajout du clone au noeud parent
        let carteProdPanier = document.querySelector('div#template_carte_produit_panier');
        let parentNodePanier = document.querySelector('#liste_produits_panier');
        let newCarteProdPanier = carteProdPanier.cloneNode(true);
        parentNodePanier.appendChild(newCarteProdPanier);
        newCarteProdPanier.removeAttribute('id');
        newCarteProdPanier.classList.remove('hidden');
        newCarteProdPanier.dataset.id = dataId+1; // TODO Mettre dataset sur le bouton supprimer
        dataId = dataId +1;
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
        let allBtnSuppr = document.querySelectorAll('.supprimer_produit_panier')
        for(let btn of allBtnSuppr) {
            btn.addEventListener('click', function() {
                let idData = this.parentNode.parentNode.parentNode.dataset.id;
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

            if(nomForm === '') { // Si formulaire ok (ou non) alors on envoie les données

            } else { // Si formulaire non ok (ou ok) alors .......
                console.log();
                contact.push(formContact);
                console.log(JSON.stringify(data));
                fetch("http://localhost:3000/api/cameras/order", {
                method: 'POST',
                headers: { 
                'Accept': 'application/json', 
                'Content-Type': 'application/json' 
                },
                    body: JSON.stringify(data),
                })
                .then(response => response.json())
                .then(response => {
                    console.log(response);
                });
            }
        });        
}));

