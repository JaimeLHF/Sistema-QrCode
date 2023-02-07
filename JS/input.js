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


const exemplo = document.getElementById('exemplo')
const input = document.getElementById('input')
let tbody = document.getElementById('tbody')

const estoque = []
const add = document.getElementById('add')

input.addEventListener('input', event => {
    const inputValue = event.target.value

    if (inputValue.length === 3) {

        db.collection("Produtos").doc(inputValue)
            .onSnapshot((doc) => {
                estoque.push({
                    Cod: inputValue,
                    Produto: doc.data().Produto,
                    Cor: doc.data().Cor,
                    Qtd: 1,
                })

                // const li = document.createElement('li')

                estoque.forEach((data) => {

                    const qtdLinhas = tbody.rows.length;
                    const linha = tbody.insertRow(qtdLinhas);

                    var cellCodigo = linha.insertCell(0);
                    var cellProduto = linha.insertCell(1);
                    var cellCor = linha.insertCell(2);
                    var cellQtd = linha.insertCell(3);


                    cellCodigo.innerHTML = data.Cod
                    cellProduto.innerHTML = data.Produto
                    cellCor.innerHTML = data.Cor
                    cellQtd.innerHTML = data.Qtd

                    //     li.innerHTML = `
                    // <div class="divLi">               
                    // <h3 class="li_Cod">${data.Cod}</h3>
                    // <div class="prod_cor">
                    // <p class="li_Prod">${data.Produto}</p>
                    // <p class="li_cor">${data.Cor}</p>
                    // </div>
                    // <h2 class="li_qtd">${data.Qtd}</h2>                
                    // </div>
                    // `
                    //     tbody.appendChild(li)

                })

            })
        tbody.innerText = ''
        input.value = ""
        input.focus()
    }

})

add.addEventListener('click', () => {
    estoque.forEach((e) => {
        db.collection('Estoque').doc(e.Cod).update({
            Produto: e.Produto,
            Cor: e.Cor,
            Qtd: firebase.firestore.FieldValue.increment(1)
        })
    })

    swal.fire({
        title: 'Estoque Atualizado!',
        icon: 'success',
        showconfirmButton: true,
        confirmButtonText: 'Ok'
    }).then(() => {
        setTimeout(() => {
            window.location.replace('index.html')
        }, 1000)
    })
})


