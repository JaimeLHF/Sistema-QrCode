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

const tbody = document.getElementById('tbody')
const estoque = []

function read_db() {

    db.collection("Estoque").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            estoque.push({
                Cod: doc.id,
                Produto: doc.data().Produto,
                Cor: doc.data().Cor,
                Qtd: doc.data().Qtd
            })
        })
        renderTable(estoque)
    })
}


const searchButton = document.getElementById('searchButton')



searchInput.addEventListener('input', () => {
    const searchInput = document.getElementById('searchInput').value.toLowerCase()
    const filteredEstoque = estoque.filter((item) => {
        const produto = item.Produto.toLowerCase()
        const cor = item.Cor.toLowerCase()
        const codigo = item.Cod.toLowerCase()
        return produto.includes(searchInput) || codigo.includes(searchInput)
    })
    renderTable(filteredEstoque)
})


searchInputCor.addEventListener('input', () => {
    const searchInputCor = document.getElementById('searchInputCor').value.toLowerCase()
    const filteredEstoque = estoque.filter((item) => {
        const produto = item.Produto.toLowerCase()
        const cor = item.Cor.toLowerCase()
        const codigo = item.Cod.toLowerCase()
        return cor.includes(searchInputCor)
    })
    renderTable(filteredEstoque)
})


searchButton.addEventListener('click', () => {
    const searchInput = document.getElementById('searchInput').value.toLowerCase()
    const filteredEstoque = estoque.filter((item) => {
        const produto = item.Produto.toLowerCase()
        const cor = item.Cor.toLowerCase()
        const codigo = item.Cod.toLowerCase()
        return produto.includes(searchInput) || cor.includes(searchInput) || codigo.includes(searchInput)
    })
    renderTable(filteredEstoque)
})










function renderTable(data) {
    tbody.innerHTML = ''

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

}



window.onload = function () {
    read_db()
}