// Affichage nombre produit dans le panier
let numberOfProductInCart = document.querySelector('#number_prod_in_cart');
productInCart = [];
productInCart = JSON.parse(localStorage.getItem('produit'));
if (productInCart === null) {
    numberOfProductInCart.innerHTML = '0';
}else {
    numberOfProductInCart.innerHTML = productInCart.length;
}

