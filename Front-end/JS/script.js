// Affichage nombre produit dans le panier
let numberOfProductInCart = document.querySelector('#number_prod_in_cart');
productInCart = [];
productInCart = JSON.parse(localStorage.getItem('produit'));
function totalProductInCart() {
    if (productInCart === null) {
        numberOfProductInCart.innerHTML = '0';
    }else {
        let numberTotalOfProductInCart = 0;
        for(let i of productInCart) {
            let numberOfProduct = i.qty;
            numberTotalOfProductInCart = numberOfProduct + numberTotalOfProductInCart;
        }
        numberOfProductInCart.innerHTML = numberTotalOfProductInCart;
    }    
}
totalProductInCart();