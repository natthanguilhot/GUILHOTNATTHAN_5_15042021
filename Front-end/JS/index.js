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
        // seeMore.setAttribute('id', product._id);
        let price = product.price;
        new Intl.NumberFormat('fr-FR', {style :'currency', currency :'EUR', minimumFractionDigits : 2}).format(price);
        prixProduct.innerHTML = price/100+' €';


        // let id = product._id
        // seeMore.addEventListener('click', function() {
        //     const url = new URL('http://localhost:3000/api/cameras/'+id);
        //     // let lienProduct = newCarteProd.querySelector('.lien');
        //     // lienProduct.setAttribute('href',url)
        //     fetch(url)
        //     .then(response => response.json()
        //     .then(response => {
        //         console.log(response);
        //         let imgProduct = document.querySelector('img');
        //         let nomProdct = document.querySelector('.nom_produit')
        //         let descriptionProduct = document.querySelector('.description_produit');
        //         let prixProduct = document.querySelector('.prix_produit');
        //         nomProdct.innerHTML = response.name;
        //     }))
        // });
    }
}));
//
