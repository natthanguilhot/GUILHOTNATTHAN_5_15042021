// Affichage nombre produit dans le panier
// TODO Juste afficher le nombre d'élément dans le panier
let numberOfProductInCart = document.querySelector('#number_prod_in_cart');
productInCart = [];
productInCart = JSON.parse(localStorage.getItem('produit'));
function totalProductInCart() {
    if (productInCart === null) {
        numberOfProductInCart.innerHTML = '0';
    }else {
        let numberTotalOfProductInCart = productInCart.length;
        numberOfProductInCart.innerHTML = numberTotalOfProductInCart;
    }    
}
totalProductInCart();

function affichageConfirmationCommande () {
    let orderResume = JSON.parse(localStorage.getItem("order"));
    let nameResumeHTML = document.querySelector('#name');
    let numberOfProductResumeHTML = document.querySelector('#nbr_produit');
    let orderIdHTML = document.querySelector('#order_id');
    nameResumeHTML.innerHTML = orderResume[0].prenom;
    numberOfProductResumeHTML.innerHTML = orderResume[0].orderLength;
    orderIdHTML.innerHTML = orderResume[0].orderId;
    setTimeout(function(){
        localStorage.clear();
    },1)
}
