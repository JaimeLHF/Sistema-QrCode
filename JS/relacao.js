var firebaseConfig = {
    apiKey: "AIzaSyDh6_fijd6VKOHeo3_lyboPMn6KfLJd-1w",
    authDomain: "db-firebase-5d90c.firebaseapp.com",
    projectId: "db-firebase-5d90c",
    storageBucket: "db-firebase-5d90c.appspot.com",
    messagingSenderId: "210076045087",
    appId: "1:210076045087:web:0dcc5f236fb364d3dc2a2a"
};

firebase.initializeApp(firebaseConfig)

const db = firebase.firestore()


const card_volumes = document.getElementById('count-volumes')
const card_peso = document.getElementById('count-peso')
const card_cub = document.getElementById('count-cubagem')
const tbody = document.getElementById('tbody')
const estoque = []



//  ------------------ Dados do Banco de Dados ----------------------------

function read_db() {

    db.collection("Estoque").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            estoque.push({
                Cod: doc.id,
                Produto: doc.data().Produto,
                Cor: doc.data().Cor,
                Qtd: doc.data().Qtd,
                Peso: doc.data().PesoTotal,
                Cub: doc.data().CubagemTotal
            })
        })
        renderTable(estoque)
        soma_card()
    })

}


//  ------------------ Busca ----------------------------

const searchButton = document.getElementById('searchButton')
searchButton.addEventListener('click', () => {
    const searchInput = document.getElementById('searchInput').value.toLowerCase()
    const filteredEstoque = estoque.filter((item) => {
        const produto = item.Produto.toLowerCase()
        const cor = item.Cor.toLowerCase()
        return produto.includes(searchInput) || cor.includes(searchInput)
    })

    // ----Soma no filtro do array 
    const total_qtd = filteredEstoque.reduce((soma, produto) => soma + produto.Qtd, 0);
    const total_peso = filteredEstoque.reduce((soma, produto) => soma + produto.Peso, 0);
    const total_cub = filteredEstoque.reduce((soma, produto) => soma + produto.Cub, 0);
    card_volumes.innerHTML = `${total_qtd} `
    card_peso.innerHTML = `${total_peso.toFixed(2)} `
    card_cub.innerHTML = `${total_cub.toFixed(3)} `
    renderTable(filteredEstoque)
})


//  ------------------ Table ----------------------------
const loading_table = document.getElementById('loading_table')

function renderTable(data) {

    tbody.innerHTML = ''

    const newItem = document.createElement('tr')
    newItem.setAttribute('class', 'loading_table')
    newItem.appendChild(document.createTextNode('Loading...'))
    tbody.appendChild(newItem)


    data.forEach((e) => {
        const linha = tbody.insertRow();
        var cellCodigo = linha.insertCell(0);
        var cellProduto = linha.insertCell(1);
        var cellCor = linha.insertCell(2);
        var cellQtd = linha.insertCell(3);

        cellCodigo.innerHTML = e.Cod
        cellProduto.innerHTML = e.Produto
        cellCor.innerHTML = e.Cor
        cellQtd.innerHTML = e.Qtd
    })

    newItem.style.display = 'none'

}


function soma_card() {

    // Somar Cub do objeto Map
    let sumCub = 0;
    estoque.forEach((data) => {
        sumCub += data.Cub;
    })
    card_cub.innerHTML = `${sumCub.toFixed(3)} `

    // Somar Peso do objeto Map
    let sumPeso = 0;
    estoque.forEach((data) => {
        sumPeso += data.Peso;
    })
    card_peso.innerHTML = `${sumPeso.toFixed(2)} `


    // Somar Quantidade do objeto Map
    let sumQtd = 0;
    estoque.forEach((data) => {
        sumQtd += data.Qtd;
    })
    card_volumes.innerHTML = `${sumQtd} `
}


window.onload = function () {
    read_db()

}


const loading = document.getElementById('loading');


window.addEventListener('load', function () {
    loading.style.display = 'none';
});