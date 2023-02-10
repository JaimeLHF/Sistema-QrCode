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
const cancel = document.getElementById('cancel')
var codSearch = []
var listCod = []
const array_produtos = []
const estoque = []






function push_array() {

    db.collection("Estoque").get().then((querySnapshot) => {
        querySnapshot.forEach((docee) => {
            // doc.data() is never undefined for query doc snapshots
            array_produtos.push({
                Cod: docee.id,
                Produto: docee.data().Produto,
                Cor: docee.data().Cor,
                Qtd: 0,
            })
            // console.log(array_produtos);
        });
    });

}


input.addEventListener('input', event => {

    const inputValue = event.target.value


    if (inputValue.length === 3) {

        // Verificar se produto existe na colecao do banco de dados (documento)
        db.collection('Estoque').get().then(
            snapshot => {
                snapshot.docs.reduce((listCod, doc) => {

                    listCod = `${doc.id}`
                    codSearch.push(listCod)
                }, '')

                const found = codSearch.find(element => element == inputValue)

                const result = codSearch.sort().reduce((init, current) => {
                    if (init.length === 0 || init[init.length - 1] !== current) {
                        init.push(current)
                    }
                    return init

                }, []);

                codSearch = result

                // Se não existe
                if (!found) {
                    swal.fire({
                        title: 'Produto não cadastrado!',
                        icon: 'info',
                        showconfirmButton: true,
                        confirmButtonText: 'Ok'
                    })

                    input.value = ""
                    input.focus()
                    // Se existe
                } else {

                    // array_produtos.find((codigo) => {
                    //     if (codigo.Cod == inputValue) {
                    //         estoque.push({
                    //             Cod: codigo.Cod,
                    //             Produto: codigo.Produto,
                    //             Cor: codigo.Cor,
                    //             Qtd: 0,
                    //         })
                    //         console.log(estoque)


                    db.collection("Estoque").doc(inputValue)

                        .onSnapshot((doc) => {
                            estoque.push({
                                Cod: inputValue,
                                Produto: doc.data().Produto,
                                Cor: doc.data().Cor,
                                Qtd: 0,
                            })


                            estoque.find((id_unico) => {

                                if (id_unico.Cod == inputValue) {
                                    return id_unico.Qtd++
                                }
                            })



                            // Funcao para trazer somente Cod unicos do array de objetos estoque
                            const unicos = new Map();


                            estoque.forEach((id_Unico) => {
                                if (!unicos.has(id_Unico.Cod)) {
                                    unicos.set(id_Unico.Cod, id_Unico)
                                }
                            })

                            console.log(unicos)

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

                            // }
                            // })                 
                        })
                    tbody.innerText = ''
                    input.value = ""
                    input.focus()
                }

            }

        )

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

    if (tbody.rows.length > 0) {


        swal.fire({
            title: 'Confirmar Entrada em estoque?',
            text: "Em caso de dúvidas, confira as quantidades",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Confirmar'
        }).then((result) => {

            if (result.isConfirmed) {
                Swal.fire({
                    icon: 'success',
                    title: 'Confirmar Entrada em estoque?',
                })
                // Funcao para add em firestore do Map unicos
                unicos.forEach((e) => {
                    db.collection('Estoque').doc(e.Cod).update({
                        Produto: e.Produto,
                        Cor: e.Cor,
                        Qtd: firebase.firestore.FieldValue.increment(e.Qtd)
                    })
                })

                setTimeout(() => {
                    window.location.replace('index.html')
                }, 2000)
            }

        })
    } else {
        swal.fire({
            title: 'Nenhum Produto!',
            icon: 'error',
            showconfirmButton: true,
            confirmButtonText: 'Ok'
        })
    }

})

cancel.addEventListener('click', () => {

    Swal.fire({
        title: 'Cancelar Entrada em Estoque?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Fechar',
        confirmButtonText: 'Confirmar'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire(
                'Cancelado!',
                'Processo Cancelado!',
                'success'
            )

            setTimeout(() => {
                window.location.replace('index.html')
            }, 1000)

        }
    })
})

window.onload = () => {
    input.focus()
    push_array()
}
