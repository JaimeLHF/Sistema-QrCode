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


const input = document.getElementById('input')
const tbody = document.getElementById('tbody')
const add = document.getElementById('add')

const estoque = []


input.addEventListener('input', event => {
    const inputValue = event.target.value

    if (inputValue.length === 3) {

        db.collection("Estoque").doc(inputValue)

            .onSnapshot((doc) => {
                estoque.push({
                    Cod: inputValue,
                    Produto: doc.data().Produto,
                    Cor: doc.data().Cor,
                    Qtd: 0,
                })


                var found = estoque.find((id_unico) => {

                    if (id_unico.Cod == inputValue) {
                        return id_unico.Qtd++
                    }
                })



                const unicos = new Map();

                // Funcao para trazer somente Cod unicos do array de objetos estoque
                estoque.forEach((id_Unico) => {
                    if (!unicos.has(id_Unico.Cod)) {
                        unicos.set(id_Unico.Cod, id_Unico)
                    }
                })


                unicos.forEach((data) => {

                    const qtdLinhas = tbody.rows.length;
                    const linha = tbody.insertRow(qtdLinhas);

                    var cellCodigo = linha.insertCell(0);
                    var cellProduto = linha.insertCell(1);
                    var cellCor = linha.insertCell(2);
                    var cellQtd = linha.insertCell(3);


                    cellCodigo.innerHTML = `<button class="btn__remove-transp"></button> <h3>${data.Cod}</h3> <button class="btn__remove"><img src="img/trash.png" alt="Delete"></button>`
                    cellProduto.innerHTML = `Produto: ${data.Produto}`
                    cellCor.innerHTML = `Cor: ${data.Cor}`
                    cellQtd.innerHTML = `Qtd: ${data.Qtd}`

                })
            })

        tbody.innerText = ''
        input.value = ""
        input.focus()
    }

})

add.addEventListener('click', () => {



    const unicos = new Map();

    // Funcao para trazer somente Cod unicos do array de objetos estoque
    estoque.forEach((id_Unico) => {
        if (!unicos.has(id_Unico.Cod)) {
            unicos.set(id_Unico.Cod, id_Unico)
        }
    })

    if(tbody.rows.length > 0){
   // Funcao para add em firestore do Map unicos
    unicos.forEach((e) => {
        db.collection('Estoque').doc(e.Cod).update({
            Produto: e.Produto,
            Cor: e.Cor,
            Qtd: firebase.firestore.FieldValue.increment(e.Qtd)
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
}else{
    swal.fire({
        title: 'Nenhum Produto!',
        icon: 'error',
        showconfirmButton: true,
        confirmButtonText: 'Ok'
    })
}

})

window.onload = () =>  {
    input.focus()
}