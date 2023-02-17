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
const card_volumes = document.getElementById('count-volumes')
const card_peso = document.getElementById('count-peso')
const card_cub = document.getElementById('count-cubagem')

var codSearch = []
var listCod = []
const estoque = []

const loading_table = document.getElementById('loading_table')


input.addEventListener('input', event => {

    const inputValue = event.target.value



    if (inputValue.length === 3) {

        const newItem = document.createElement('tr')
        newItem.setAttribute('class', 'loading_table')
        newItem.appendChild(document.createTextNode('Loading...'))
        tbody.appendChild(newItem)




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
                    newItem.style.display = 'none'
                } else {


                    db.collection("Estoque").doc(inputValue)

                        .onSnapshot((doc) => {
                            estoque.push({
                                Cod: inputValue,
                                Produto: doc.data().Produto,
                                Cor: doc.data().Cor,
                                Qtd: 0,
                                Cub: doc.data().Cubagem,
                                Peso: doc.data().Peso
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


                            // Funcao para somar Cubagem de codigos Unicos no array
                            const codDesejado = inputValue;
                            const somaCub = estoque.reduce((acc, obj) => {
                                if (obj.Cod === codDesejado) {
                                    return acc + doc.data().Cubagem;
                                } else {
                                    return acc;
                                }
                            }, 0);


                            // Funcao para somar Peso de codigos Unicos no array
                            const somaPeso = estoque.reduce((acc, obj) => {
                                if (obj.Cod === codDesejado) {
                                    return acc + doc.data().Peso;
                                } else {
                                    return acc;
                                }
                            }, 0);

                            // Funcao para levar ao array a soma de Peso e Cubagem
                            estoque.forEach((b) => {
                                if (b.Cod == inputValue) {
                                    b.Cub = somaCub
                                    b.Peso = somaPeso
                                } else {
                                    b.Cub = b.Cub
                                    b.Peso = b.Peso
                                }
                            })


                            unicos.forEach((data) => {

                                const qtdLinhas = tbody.rows.length;
                                const linha = tbody.insertRow(qtdLinhas);

                                var cellCodigo = linha.insertCell(0);
                                var cellProduto = linha.insertCell(1);
                                var cellCor = linha.insertCell(2);
                                var cellQtd = linha.insertCell(3);


                                cellCodigo.innerHTML = `<button class="btn__remove-transp"></button> <h3>${data.Cod}</h3> <button class="btn__remove" id="remove"><img src="img/subtracting.png" alt="Delete"></button>`
                                cellProduto.innerHTML = `Produto: ${data.Produto}`
                                cellCor.innerHTML = `Cor: ${data.Cor}`
                                cellQtd.innerHTML = `Qtd: ${data.Qtd}`


                                // Funcao para remover itens da lista e somar novamente o array e os cards
                                const removeBtn = cellCodigo.querySelector('#remove');

                                removeBtn.addEventListener('click', () => {

                                    const codigo = cellCodigo.querySelector('h3').textContent;

                                    const produto = unicos.get(codigo);
                                    db.collection('Estoque').doc(produto.Cod).onSnapshot((t) => {
                                        if (produto.Qtd > 0) {
                                            produto.Qtd--;
                                            produto.Cub -= t.data().Cubagem;
                                            produto.Peso -= t.data().Peso;
                                        }
                                        
                                        cellQtd.innerHTML = `Qtd: ${produto.Qtd}`
                                      

                                        // Somar Cub do objeto Map
                                        let sumCub = 0;
                                        unicos.forEach((data) => {
                                            sumCub += data.Cub;
                                        })
                                        card_cub.innerHTML = `${sumCub.toFixed(3)} `

                                        // Somar Peso do objeto Map
                                        let sumPeso = 0;
                                        unicos.forEach((data) => {
                                            sumPeso += data.Peso;
                                        })
                                        card_peso.innerHTML = `${sumPeso.toFixed(2)} `

                                        // Somar Quantidade do objeto Map
                                        let sumQtd = 0;
                                        unicos.forEach((data) => {
                                            sumQtd += data.Qtd;
                                        })
                                        card_volumes.innerHTML = `${sumQtd} `
                                    })
                                })

                            })

                            newItem.style.display = 'none'



                            // Somar Cub do objeto Map
                            let sumCub = 0;
                            unicos.forEach((data) => {
                                sumCub += data.Cub;
                            })
                            card_cub.innerHTML = `${sumCub.toFixed(3)} `

                            // Somar Peso do objeto Map
                            let sumPeso = 0;
                            unicos.forEach((data) => {
                                sumPeso += data.Peso;
                            })
                            card_peso.innerHTML = `${sumPeso.toFixed(2)} `


                            // Somar Quantidade do objeto Map
                            let sumQtd = 0;
                            unicos.forEach((data) => {
                                sumQtd += data.Qtd;
                            })
                            card_volumes.innerHTML = `${sumQtd} `



                            add.addEventListener('click', () => {


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
                                                title: 'Estoque Atualizado!',
                                            })
                                            // Funcao para add em firestore do Map unicos
                                            unicos.forEach((e) => {
                                                db.collection('Estoque').doc(e.Cod).update({
                                                    Produto: e.Produto,
                                                    Cor: e.Cor,
                                                    Qtd: firebase.firestore.FieldValue.increment(e.Qtd),
                                                    CubagemTotal: firebase.firestore.FieldValue.increment(e.Cub),
                                                    PesoTotal: firebase.firestore.FieldValue.increment(e.Peso),
                                                })
                                            })

                                            setTimeout(() => {
                                                window.location.replace('relacao.html')
                                            }, 2000)
                                        }

                                    })
                                } else if (tbody.rows.length == 0) {
                                    swal.fire({
                                        title: 'Nenhum Produto!',
                                        icon: 'error',
                                        showconfirmButton: true,
                                        confirmButtonText: 'Ok'
                                    })
                                }

                            })




                        })

                    tbody.innerText = ''
                    input.value = ""
                    input.focus()
                }

            }

        )

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
}

document.querySelector('body').onkeydown = (e) => {
    input.focus()
}

const loading = document.getElementById('loading');


window.addEventListener('load', function () {   
    loading.style.display = 'none';
});


