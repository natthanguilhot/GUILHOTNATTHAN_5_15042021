const baseUrl = "http://127.0.0.1:5500/Front-end/HTML/";
let prixPanier = 0;
let dataId = 0;
let carteProdPanier = document.querySelector('div#template_carte_produit_panier');
let parentNodePanier = document.querySelector('#liste_produits_panier');
// Affichage nombre produit dans le panier
export function totalProductInCart() {
    let numberOfProductInCart = document.querySelector('#number_prod_in_cart');
    let productInCart = [];
    productInCart = storage.load('produit');

    if (productInCart === null) {
        numberOfProductInCart.innerHTML = '0';
    }else {
        numberOfProductInCart.innerHTML = productInCart.length;
    }    
};
//
// Fonction formatage des prix
function prixConvert (prixamodifer) {
    return new Intl.NumberFormat('fr-FR', {style :'currency', currency :'EUR', minimumFractionDigits : 2}).format(prixamodifer/100);
};
//

/////////////////////////////////////////  PAGE INDEX ////////////////////////////////////////////////////
// Affichage produits page index
export function affichageProduitsIndex (response) {
    for(let product of response) {
        let carteProd = document.querySelector('#carte');// Récupération du parent et du template
        let noeudParent = document.querySelector('#noeud_parent');

        let newCarteProd = carteProd.cloneNode(true); // clonage et traitement
        noeudParent.appendChild(newCarteProd);
        newCarteProd.removeAttribute('id');
        newCarteProd.classList.remove('hidden');

        let imgProduct = newCarteProd.querySelector('img');// Selection du DOM
        let nomProdct = newCarteProd.querySelector('.nom_produit');
        let descriptionProduct = newCarteProd.querySelector('.description_produit');
        let prixProduct = newCarteProd.querySelector('.prix_produit');

        let price = prixConvert(product.price); // Affichage dans le DOM
        imgProduct.setAttribute('src', product.imageUrl);
        nomProdct.innerHTML = product.name;
        descriptionProduct.innerHTML = product.description;
        prixProduct.innerHTML = price;

        const url = new URL(baseUrl + 'product.html'); 
        url.searchParams.append('id', product._id);// On vient ajouter dans l'url le paramètre id avec l'id du produit donné par l'API

        let lienProduct = newCarteProd.querySelector('.lien');
        lienProduct.setAttribute('href',url); // On intègre se lien au bouton
    }
};
//
////////////////////////////////////////////////////

//////////////////////////////////////////////////// PAGE PRODUIT ////////////////////////////////////////////////////
function affichageProduit(response){
    let imgProduct = document.querySelector('img');
    let nomProduct = document.querySelector('.nom_produit')
    let descriptionProduct = document.querySelector('.description_produit');
    let prixProduct = document.querySelector('.prix_produit');

    nomProduct.innerHTML = response.name;
    descriptionProduct.innerHTML = response.description

    let price = prixConvert(response.price);
    prixProduct.innerHTML = price;

    imgProduct.setAttribute('src', response.imageUrl);

    let title = document.querySelector('title');
    title.innerHTML = 'Orinoco - ' + response.name;

    let selectLength = document.querySelector('#length');
    for (let length of response.lenses) {
        const newOptionLength = document.createElement('option')
        newOptionLength.setAttribute('value', length);
        newOptionLength.innerHTML = length;
        selectLength.appendChild(newOptionLength);
    }
};
export function pageProduit (response) {
    affichageProduit(response);
    // Gestion de la quantité
    let qtyPlus = document.querySelector('#qtyplus');
    let qtyMinus = document.querySelector('#qtyminus');
    let inputQty = document.querySelector('#qty');
    let numberQty = 1;
    
    inputQty.setAttribute('value',numberQty);

    qtyMinus.addEventListener('click', function() {
        inputQty.value = numberQty-1;
        numberQty = numberQty-1;
    });

    qtyPlus.addEventListener('click', function() {
        inputQty.value = numberQty+1;
        numberQty = numberQty+1;
    });


    //
    // Gestion du panier 
    //Récupérer contenu localstorage avec getItem (JSON.parse) 
    //Si localstorage vide, alors nouveau panier vide
    let addToCart = document.querySelector('button#addtocart');
    let selectOption = document.querySelector('#length');
    let errAddCart = document.querySelector('#erreuraddcart');
    let confirmAddCart = document.querySelector('#confirmaddcart');

    addToCart.addEventListener('click', function() {
        let productInCart = [];
        productInCart = storage.load('produit') // JSON.parse(localStorage.getItem('produit'));    
        // Si option est === 'Choississez votre lentille' alors popup erreur ('Veuillez sélectionner une lentille !')
        if (selectOption.value === 'Choississez votre lentille') {
            errAddCart.classList.remove('hidden');
            errAddCart.classList.add('anim_erreur_lentille');
        } else if(productInCart) {
            //Si productInCart/LS pas vide
            let product = {
                id : response._id,
                qty : Number(inputQty.value),
                nom : response.name,
                prix : response.price*Number(inputQty.value),
                option : selectOption.value
            }
            // Verif si id et option du produit sont deja présent, si oui, on change la quantité
            let isProductInCart = false;
            // TODO Sortir la fonction 
            function checkProdInCart () {
                for (let currentProduct of productInCart) {
                    if (product.id === currentProduct.id && product.option === currentProduct.option) {
                        isProductInCart = true;
                        let qtyOfProductInCart;
                        qtyOfProductInCart = currentProduct.qty;
                        currentProduct.qty = Number(qtyOfProductInCart) + Number(inputQty.value);
                        currentProduct.prix = response.price * currentProduct.qty;
                        // Anim validation d'ajout
                        confirmAddCart.classList.remove('hidden');
                        confirmAddCart.classList.add('anim_add_cart_ok');
                        setTimeout(function() {
                            confirmAddCart.classList.add('hidden');
                        },3000);        
                        break;
                    }
                }
            };                
            checkProdInCart();
            //
            // Si produit est déjà présent, alors on ajoute la quantité de l'input à la quantité déjà présente
            if (isProductInCart === true) {
                storage.save('produit',productInCart) // localStorage.setItem('produit', JSON.stringify(productInCart));
            } else {
                // Sinon push le produit dans le tableau productInCart et l'insérer dans le LS
                productInCart.push(product);
                storage.save('produit', productInCart) // localStorage.setItem('produit', JSON.stringify(productInCart));

                //animation erreur ou validation d'ajout au panier
                errAddCart.classList.add('hidden');
                confirmAddCart.classList.remove('hidden');
                confirmAddCart.classList.add('anim_add_cart_ok');
                setTimeout(function() {
                    confirmAddCart.classList.add('hidden');
                },3000);
                //Affichage nombre d'article dans panier
                let numberOfProductInCart = document.querySelector('#number_prod_in_cart');
                productInCart = storage.load('produit'); // JSON.parse(localStorage.getItem('produit'));
                numberOfProductInCart.innerHTML = productInCart.length;    
            }
        } else { // Sinon si LocalStorage vide, on récupère le tableau 'productInCart', on push le produit dans le tableau et on met a jour le LocalStorage
            productInCart = [];
            let product = {
                id : response._id,
                qty : Number(inputQty.value),
                nom : response.name,
                prix : response.price*Number(inputQty.value),
                option : selectOption.value
            }
            productInCart.push(product);
            storage.save('produit',productInCart) // localStorage.setItem('produit', JSON.stringify(productInCart));
            //animation erreur ou validation d'ajout au panier
            errAddCart.classList.add('hidden');
            confirmAddCart.classList.remove('hidden');
            confirmAddCart.classList.add('anim_add_cart_ok');
            setTimeout(function() {
                confirmAddCart.classList.add('hidden');
            },3000);
            //Affichage nombre d'article dans panier
            let numberOfProductInCart = document.querySelector('#number_prod_in_cart');
            productInCart = storage.load('produit');
            numberOfProductInCart.innerHTML = productInCart.length;
        }
    })    
};
////////////////////////////////////////////////////

//////////////////////////////////////////////////// PAGE PANIER ////////////////////////////////////////////////////
// Controle formualaire et envoie
function getDataForm () {
    let adresseForm = document.querySelector('#adresse').value;
    let mailForm = document.querySelector('#mail').value;
    let villeForm = document.querySelector('#city').value;
    let nomForm = document.querySelector('#lastname').value;
    let prenomForm = document.querySelector('#firstname').value;

    return {address : adresseForm, email : mailForm, city : villeForm, lastName : nomForm, firstName : prenomForm};
};

function checkForm (returnDataForm) {
    if(nomPrenomVilleControl(returnDataForm.lastName, returnDataForm.firstName, returnDataForm.city) && emailControl(returnDataForm.email) && addressControl(returnDataForm.address)) { // on controle le formulaire, Si formulaire ok traitement ci dessous, sinon les fonctions envoie une alerte
        sendOrder(); // On envoie le tableau a à l'API
    }
};

function createArrayForAPI () {
    const formContact = getDataForm();
    const productsLS = storage.load('produit')

    let tablProductId = productsLS.map(e => e.id); // On parcour le tableau, et on remplace les éléments du tableau par par l'id des éléments

    return { contact : formContact, products : tablProductId};
};

function sendOrder () {
    let returnCreateArrayForAPI = createArrayForAPI();
    fetch("http://localhost:3000/api/cameras/order", {
        method: 'POST',
        headers: { 
        'Accept': 'application/json', 
        'Content-Type': 'application/json' 
        },
            body: JSON.stringify(returnCreateArrayForAPI), // On envoie les données au serveur
        })
        .then(response => response.json())
        .then(response => {
            console.log(response);
            let order = []; // on créé un tableau order
            let orderResume = { // on créé un objet order résumé
                orderLength : response.products.length,
                orderId : response.orderId,
                prenom : response.contact.firstName
            }
            order.push(orderResume); // on push l'objet dans le tableau 
            storage.save('order',order); // on envoie le tableau dans le LS
            storage.remove('produit'); // on vide le panier LS
            window.location.href = "confirmation.html"; // on envoie sur la page confirmation    
        });
};

export function formulaireCommande () {
    // Formulaire de commande
    let btnFormulaireCommande = document.querySelector('#btncommande');
    btnFormulaireCommande.addEventListener('click', function(){
        const returnDataForm = getDataForm();
        checkForm(returnDataForm); // On vérifié les inputs et si c'est ok, on lance les autres fonctions
        event.preventDefault();      
    });        
};

export function affichageProdPanier(response, productInCart) {
    prixPanier = 0;
    dataId = 0;
    productInCart = storage.load('produit') // JSON.parse(localStorage.getItem('produit'));
    for(let product of productInCart) {
        // Copie du template et ajout du clone au noeud parent
        let newCarteProdPanier = carteProdPanier.cloneNode(true);
        newCarteProdPanier.removeAttribute('id');
        newCarteProdPanier.classList.remove('hidden');
        let btnSuppr = newCarteProdPanier.querySelector('.supprimer_produit_panier');
        btnSuppr.dataset.id = dataId++;
        
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

        parentNodePanier.appendChild(newCarteProdPanier);

        prixPanier += product.prix;
    }
    // Suppresion du produit 
    let allBtnSuppr = document.querySelectorAll('.supprimer_produit_panier');

    for(let btn of allBtnSuppr) {
        btn.addEventListener('click', function() {
            let idData = this.dataset.id;
            console.log(idData);

            productInCart.splice([idData],1);
            storage.save('produit',productInCart);

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

    let pricePanier = prixConvert(prixPanier); 
    let priceTotalPanierConvert = prixConvert(prixTotalPanier);

    let prixPanierHTML = document.querySelector('#prix_panier');
    let prixTotalHTML = document.querySelector('#prix_total');

    prixPanierHTML.innerHTML = pricePanier;
    prixTotalHTML.innerHTML = priceTotalPanierConvert;
    //
    
};

// Fonctions validation formulaire
function nomPrenomVilleControl(nomForm, prenomForm, villeForm) {
    if(/^[A-Za-z\s]{2,20}$/.test(nomForm) && /^[A-Za-z]{2,20}$/.test(prenomForm) && /^[A-Za-z]{2,20}$/.test(villeForm)) {
     return true;
    }else {
     alert("Les champs Nom, Prénom et Ville ne doivent contenir que des lettres (minimum 2), pas d'espace inutile et pas de caractères spécieaux(&,-,(),§,! ..).")
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

//////////////////////////////////////////////////// PAGE CONFIRMATION ////////////////////////////////////////////////////
export function affichageConfirmationCommande () {
    let orderResume = storage.load("order"); // On récupère les données de la commande (prénom, id et nombre de produits)
    let nameResumeHTML = document.querySelector('#name');
    let numberOfProductResumeHTML = document.querySelector('#nbr_produit');
    let orderIdHTML = document.querySelector('#order_id');

    nameResumeHTML.innerHTML = orderResume[0].prenom; // On affiche ces données
    numberOfProductResumeHTML.innerHTML = orderResume[0].orderLength;
    orderIdHTML.innerHTML = orderResume[0].orderId;

    setTimeout(function(){ // On supprime les données
        storage.remove('order');
    },500)
};
//
//////////////////////////////////////////////// STORAGE ////////////////////////////////////////////////////
export let storage = {
    load : function (key) {
        return JSON.parse(localStorage.getItem(key))
    },
    save : function (key, value) {
        return localStorage.setItem(key, JSON.stringify(value))
    },
    remove : function (key) {
        return localStorage.removeItem(key);
    }
};