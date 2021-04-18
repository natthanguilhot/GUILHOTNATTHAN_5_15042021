// Produit 0
let carteProd = document.querySelector('#carte');

fetch('http://localhost:3000/api/cameras')
.then(response => response.json()
.then(products => {
    for(let product of products) {
        console.log(product)
        let newCarteProd = carteProd.cloneNode(true);
        newCarteProd.removeAttribute('id');
        newCarteProd.classList.replace('hidden', 'contents');
        // pour chaque produit, recuperer les infos et les cloner la div carte en enelevant id,  etc...
    }
}));
