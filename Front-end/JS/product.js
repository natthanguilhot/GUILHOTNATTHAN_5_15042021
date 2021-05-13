// Récupération de l'id du produit via l'url
const url = new URL(window.location.href);
const id = url.searchParams.get('id');

// Requête au produit correspondant à l'id et affichage de celui ci
fetch("http://localhost:3000/api/cameras/"+ id)
.then(response => response.json()
.then(response => {
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
    //

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
        productInCart = JSON.parse(localStorage.getItem('produit'));    
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
                // Verif si id et option du produit sont deja présent
                let isProductInCart = false;
                const checkProdInCart = function () {
                    for (let i of productInCart) {
                        if (product.id === i.id && product.option === i.option) {
                            isProductInCart = true;
                            let qtyOfProductInCart;
                            qtyOfProductInCart = i.qty;
                            i.qty = Number(qtyOfProductInCart) + Number(inputQty.value);
                            i.prix = response.price * i.qty;
                            break;
                        }
                    }
                }
                checkProdInCart();
                //
                // Si produit est déjà présent, alors on ajoute la quantité de l'input à la quantité déjà présente
                if (isProductInCart === true) {
                    localStorage.setItem('produit', JSON.stringify(productInCart));
                } else {
                    // Sinon push le produit dans le tableau productInCart et l'insérer dans le LS
                    productInCart.push(product);
                    localStorage.setItem('produit', JSON.stringify(productInCart));
    
                    //animation erreur ou validation d'ajout au panier
                    errAddCart.classList.add('hidden');
                    confirmAddCart.classList.remove('hidden');
                    confirmAddCart.classList.add('anim_add_cart_ok');
                    setTimeout(function() {
                        confirmAddCart.classList.add('hidden');
                    },3000);
    
    
                    //Affichage nombre d'article dans panier
                    let numberOfProductInCart = document.querySelector('#number_prod_in_cart');
                    productInCart = JSON.parse(localStorage.getItem('produit'));
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
                localStorage.setItem('produit', JSON.stringify(productInCart));

                //animation erreur ou validation d'ajout au panier
                errAddCart.classList.add('hidden');
                confirmAddCart.classList.remove('hidden');
                confirmAddCart.classList.add('anim_add_cart_ok');
                setTimeout(function() {
                    confirmAddCart.classList.add('hidden');
                },3000);


                //Affichage nombre d'article dans panier
                let numberOfProductInCart = document.querySelector('#number_prod_in_cart');
                productInCart = JSON.parse(localStorage.getItem('produit'));
                numberOfProductInCart.innerHTML = productInCart.length;
            }    
        }
    })
}));