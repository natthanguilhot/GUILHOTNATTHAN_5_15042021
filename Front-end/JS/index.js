const baseUrl = "http://127.0.0.1:5500/Front-end/HTML/";

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

        imgProduct.setAttribute('src', product.imageUrl);
        nomProdct.innerHTML = product.name;
        descriptionProduct.innerHTML = product.description;
        let price = new Intl.NumberFormat('fr-FR', {style :'currency', currency :'EUR', minimumFractionDigits : 2}).format(product.price/100);

        prixProduct.innerHTML = price;

        let id = product._id;

        const url = new URL(baseUrl + 'product.html');
        url.searchParams.append('id', id);

        let lienProduct = newCarteProd.querySelector('.lien');
        lienProduct.setAttribute('href',url);
    }
}));
//
