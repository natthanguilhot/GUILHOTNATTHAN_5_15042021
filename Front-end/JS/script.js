const baseUrl = "http://127.0.0.1:5500/Front-end/HTML/";
let prixPanier = 0;
let dataId = -1;
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
        let numberTotalOfProductInCart = productInCart.length;
        numberOfProductInCart.innerHTML = numberTotalOfProductInCart;
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

    for (let length of response.lenses) {
        let selectLength = document.querySelector('#length');
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
        } else { // Sinon si il y a deja des produits dans le panier, alors on push le produit dans tableau 'productInCart' et on l'insert dans local storage
            if(productInCart) {
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
                function checkProdInCart () {
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
    return {address : adresseForm, mail : mailForm, ville : villeForm, nom : nomForm, prenom : prenomForm};
};
function checkForm (returnDataForm) {
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
    let productInCart = storage.load('produit');
    for(let prod of productInCart) {
        tablProductId.push(prod.id);
    };
    let data = {
        contact : formContact,
        products : tablProductId,
    };
    return {contact : contact, data : data};
};
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
            storage.save('order',order); // on envoie le tableau dans le LS
            storage.remove('produit'); // on vide le panier LS
            window.location.href = "confirmation.html"; // on envoie sur la page confirmation    
        });
};
export function formulaireCommande () {
    // Formulaire de commande
    let btnFormulaireCommande = document.querySelector('#btncommande');
    btnFormulaireCommande.addEventListener('click', function(){
        let returnDataForm = getDataForm();
        getDataForm(); // On récupère les input du formulaire
        checkForm(returnDataForm); // On vérifié les inputs et si c'est ok, on lance les autres fonctions
        event.preventDefault();      
    });        
};
export function affichageProdPanier(response, productInCart) {
    productInCart = storage.load('produit') // JSON.parse(localStorage.getItem('produit'));    
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
     alert("Les champs Nom, Prénom et Ville ne doivent contenir que des lettres, pas d'espace inutile et pas de caractères spécieaux(&,-,(),§,! ..).")
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
    let orderResume = storage.load("order");
    let nameResumeHTML = document.querySelector('#name');
    let numberOfProductResumeHTML = document.querySelector('#nbr_produit');
    let orderIdHTML = document.querySelector('#order_id');
    nameResumeHTML.innerHTML = orderResume[0].prenom;
    numberOfProductResumeHTML.innerHTML = orderResume[0].orderLength;
    orderIdHTML.innerHTML = orderResume[0].orderId;
    setTimeout(function(){
        storage.remove('order');
    },500)
};
//
//////////////////////////////////////////////// STORAGE
let storage = {
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