const baseUrl = "http://127.0.0.1:5500/Front-end/HTML/";
let prixPanier = 0;
let dataId = -1;
let carteProdPanier = document.querySelector('div#template_carte_produit_panier');
let parentNodePanier = document.querySelector('#liste_produits_panier');
let productInCart = [];
productInCart = JSON.parse(localStorage.getItem('produit'));

// Affichage nombre produit dans le panier
export function totalProductInCart() {
    let numberOfProductInCart = document.querySelector('#number_prod_in_cart');
    let productInCart = [];
    productInCart = JSON.parse(localStorage.getItem('produit'));

    if (productInCart === null) {
        numberOfProductInCart.innerHTML = '0';
    }else {
        let numberTotalOfProductInCart = productInCart.length;
        numberOfProductInCart.innerHTML = numberTotalOfProductInCart;
    }    
};
//
// Affichage produits page index
export function affichageProduitsIndex (response) {
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
        let price = prixConvert(product.price);

        prixProduct.innerHTML = price;

        let id = product._id;

        const url = new URL(baseUrl + 'product.html');
        url.searchParams.append('id', id);

        let lienProduct = newCarteProd.querySelector('.lien');
        lienProduct.setAttribute('href',url);
    }
};
//

// Controle formualaire et envoie
// TODO découper la fonction en 3/4 autre fonctions
function getDataForm (productInCart) {
    let adresseForm = document.querySelector('#adresse').value;
    let mailForm = document.querySelector('#mail').value;
    let villeForm = document.querySelector('#city').value;
    let nomForm = document.querySelector('#lastname').value;
    let prenomForm = document.querySelector('#firstname').value;
    return {address : adresseForm, mail : mailForm, ville : villeForm, nom : nomForm, prenom : prenomForm};
};
function checkForm () {
    let returnDataForm = getDataForm();
    if(nomPrenomVilleControl(returnDataForm.nom, returnDataForm.prenom, returnDataForm.ville) && emailControl(returnDataForm.mail) && addressControl(returnDataForm.address)) { // on controle le formulaire, Si formulaire ok traitement ci dessous, sinon les fonctions envoie une alerte
        createArrayForAPI(); // On crée les tableaux réquis par l'API
        sendOrder(); // On envoie le tableau a à l'API
    }
};
function createArrayForAPI () {
    let returnDataForm = getDataForm();
    let contact = [];
    let formContact = {
        firstName : returnDataForm.prenom,
        lastName : returnDataForm.nom,
        address : returnDataForm.address,
        city : returnDataForm.ville,
        email : returnDataForm.mail,
    }
    contact.push(formContact);
    let tablProductId = [];
    for(let prod of productInCart) {
        tablProductId.push(prod.id);
    };
    let data = {
        contact : formContact,
        products : tablProductId,
    };
    return {contact : contact, data : data};
}
function sendOrder () {
    let returnCreateArrayForAPI = createArrayForAPI();
    fetch("http://localhost:3000/api/cameras/order", {
        method: 'POST',
        headers: { 
        'Accept': 'application/json', 
        'Content-Type': 'application/json' 
        },
            body: JSON.stringify(returnCreateArrayForAPI.data), // On envoie les données au serveur
        })
        .then(response => response.json())
        .then(response => {
            let order = []; // on créé un tableau order
            let orderResume = { // on créé un objet order résumé
                orderLength : response.products.length,
                orderId : response.orderId,
                prenom : response.contact.firstName
            }
            order.push(orderResume); // on push l'objet dans le tableau 
            localStorage.setItem('order', JSON.stringify(order)); // on envoie le tableau dans le LS
            localStorage.removeItem('produit'); // on vide le panier LS
            window.location.href = "confirmation.html"; // on envoie sur la page confirmation    
        });
};
export function formulaireCommande () {
    // Formulaire de commande
    let btnFormulaireCommande = document.querySelector('#btncommande');
    btnFormulaireCommande.addEventListener('click', function(){
        getDataForm(productInCart); // On récupère les input du formulaire
        checkForm(); // On vérifié les inputs et si c'est ok, on lance les autres fonctions
        event.preventDefault();      
    });        
};
//


//
export function affichageConfirmationCommande () {
    let orderResume = JSON.parse(localStorage.getItem("order"));
    let nameResumeHTML = document.querySelector('#name');
    let numberOfProductResumeHTML = document.querySelector('#nbr_produit');
    let orderIdHTML = document.querySelector('#order_id');
    nameResumeHTML.innerHTML = orderResume[0].prenom;
    numberOfProductResumeHTML.innerHTML = orderResume[0].orderLength;
    orderIdHTML.innerHTML = orderResume[0].orderId;
    setTimeout(function(){
        localStorage.removeItem('order');
    },500)
};

function prixConvert (prixamodifer) {
    return new Intl.NumberFormat('fr-FR', {style :'currency', currency :'EUR', minimumFractionDigits : 2}).format(prixamodifer/100);
};
export function affichageProdPanier(response, productInCart) {
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
        let price = prixConvert(product.prix);
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
    let pricePanier = prixConvert(prixPanier); 
    let priceTotalPanierConvert = prixConvert(prixTotalPanier); 
    prixPanierHTML.innerHTML = pricePanier;
    prixTotalHTML.innerHTML = priceTotalPanierConvert;
    //
    
};

// Fonctions validation formulaire
function nomPrenomVilleControl(nomForm, prenomForm, villeForm) {
    if(/^[A-Za-z\s]{2,20}$/.test(nomForm) && /^[A-Za-z]{2,20}$/.test(prenomForm) && /^[A-Za-z]{2,20}$/.test(villeForm)) {
     return true;
    }else {
     alert("Les champs Nom, Prénom et Ville ne doivent contenir que des lettres, pas d'espace inutile et pas de caractères spécieaux(é,-,î..).")
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
// Page produit
export function affichageProduit(response){
    let imgProduct = document.querySelector('img');
    let nomProduct = document.querySelector('.nom_produit')
    let descriptionProduct = document.querySelector('.description_produit');
    let prixProduct = document.querySelector('.prix_produit');
    nomProduct.innerHTML = response.name;
    descriptionProduct.innerHTML = response.description

    let price = new Intl.NumberFormat('fr-FR', {style :'currency', currency :'EUR', minimumFractionDigits : 2}).format(response.price/100);
    prixProduct.innerHTML = price;

    imgProduct.setAttribute('src', response.imageUrl);

    let title = document.querySelector('title');
    title.innerHTML = 'Orinoco - ' + response.name;

    for (let length of response.lenses) {
        let selectLength = document.querySelector('#length');
        const newOptionLength = document.createElement('option')
        newOptionLength.setAttribute('value', length);
        newOptionLength.innerHTML = length;
        selectLength.appendChild(newOptionLength);
    }
};

//
export function checkProdInCart (product) {
    for (let i of productInCart) {
        if (product.id === i.id && product.option === i.option) {
            isProductInCart = true;
            let qtyOfProductInCart;
            qtyOfProductInCart = i.qty;
            i.qty = Number(qtyOfProductInCart) + Number(inputQty.value);
            i.prix = response.price * i.qty;
            // Anim validation d'ajout
            confirmAddCart.classList.remove('hidden');
            confirmAddCart.classList.add('anim_add_cart_ok');
            setTimeout(function() {
                confirmAddCart.classList.add('hidden');
            },3000);        
            break;
        }
    }
}
