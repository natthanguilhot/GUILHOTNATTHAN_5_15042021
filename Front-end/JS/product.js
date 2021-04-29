// Affichage du produit sélectionné

const url = new URL(window.location.href);
const id = url.searchParams.get('id');

fetch("http://localhost:3000/api/cameras/"+ id)
.then(response => response.json()
.then(response => {
    let imgProduct = document.querySelector('img');
    let nomProdct = document.querySelector('.nom_produit')
    let descriptionProduct = document.querySelector('.description_produit');
    let prixProduct = document.querySelector('.prix_produit');
    nomProdct.innerHTML = response.name;
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
        inputQty.setAttribute('value',numberQty-1);
        numberQty = numberQty-1;
    });
    qtyPlus.addEventListener('click', function() {
        inputQty.setAttribute('value',numberQty+1);
        numberQty = numberQty+1;
    });
    //


    //Récupérer contenu localstorage avec getItem (JSON.parse) 
    //Si localstorage vide, alors nouveau panier vide
    let productInCart = [];

    //Sinon récupération panier localstorage

    // Gestion du panier 
    let addToCart = document.querySelector('button#addtocart');
    addToCart.addEventListener('click', function() {
        let product = {
            nom : response.name,
            quantité : numberQty,
            prix : response.price * numberQty,
        }
    
        productInCart.push(product);
    
        localStorage.setItem('produit', JSON.stringify(productInCart));
    })
    //
}));