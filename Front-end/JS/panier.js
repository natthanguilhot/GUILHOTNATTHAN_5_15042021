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
}));

