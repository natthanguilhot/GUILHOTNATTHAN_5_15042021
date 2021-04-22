// Affichage des produits
fetch('http://localhost:3000/api/cameras')
.then(response => response.json()
.then(products => {
    for(let product of products) {
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
        let seeMore = newCarteProd.querySelector('.see_more');

        imgProduct.setAttribute('src', product.imageUrl);
        nomProdct.innerHTML = product.name;
        descriptionProduct.innerHTML = product.description;
        seeMore.setAttribute('id', product._id);
        let price = product.price/100;
        new Intl.NumberFormat('fr-FR', {style :'currency', currency :'EUR'}).format(price);
        
        prixProduct.innerHTML = price+' €';
        seeMore.addEventListener('click', function() {
            console.log('test click '+ product._id);
            const url = new URL('..'+product.name,'http://127.0.0.1:5500/Front-end/HTML/product');
            console.log(url);
        })
    }
}));
//
