
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
const cub = []
const loading_table = document.getElementById('loading_table')


function getUser() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            let userLabel = document.getElementById("user_email")
           userLabel.innerHTML = user.email
            console.log(user)
        } else {
            let timerInterval
            Swal.fire({
                icon: 'info',
                title: 'Redirecionando Login!',
                html: 'Loading...',
                timer: 2000,
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading()
                    const b = Swal.getHtmlContainer().querySelector('b')
                    timerInterval = setInterval(() => {
                        b.textContent = Swal.getTimerLeft()
                    }, 100)
                },
                willClose: () => {
                    clearInterval(timerInterval)
                }
            }).then((result) => {
                /* Read more about handling dismissals below */
                if (result.dismiss === Swal.DismissReason.timer) {
                    window.location.replace('index.html')
                }
            })
        }
    })

}



// --------------------------- Renderizar Tabela ao preencher Input ------------------------------

input.addEventListener('input', event => {

    const inputValue = event.target.value

    if (inputValue.length === 3) {

        const newItem = document.createElement('tr')
        newItem.setAttribute('class', 'loading_table')
        newItem.appendChild(document.createTextNode('Loading...'))
        tbody.appendChild(newItem)



        // ---------- Procura se existe Cod no Banco de dados ----------

        db.collection('Estoque').get().then(snapshot => {
            snapshot.docs.reduce((listProdutos, doc) => {
                listProdutos = `${doc.data().Codigo}`
                codSearch.push(listProdutos)
            }, '')

            // const client = document.getElementById('client').value
            const found = codSearch.find(element => element == inputValue)

            const result = codSearch.sort().reduce((init, current) => {
                if (init.length === 0 || init[init.length - 1] !== current) {
                    init.push(current)
                }
                return init;
            }, []);

            codSearch = result

            // ------- Se não existe --------
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
            }
        })

        // ------- Se existe --------

        let encontrado = false
        for (let i = 0; i < estoque.length; i++) {
            if (estoque[i].Codigo === inputValue) {
                estoque[i].Quantidade++
                estoque[i].Cubagem += estoque[i].Cubagem_original
                estoque[i].Peso += estoque[i].Peso_original
                encontrado = true


                break
            }
        }
        if (!encontrado) {


            db.collection("Estoque").where("Codigo", '==', inputValue)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        estoque.push({
                            Codigo: inputValue,
                            Produtos: doc.data().Produto,
                            Cores: doc.data().Cor,
                            Quantidade: 1,
                            Cubagem_original: doc.data().Cubagem,
                            Cubagem: doc.data().Cubagem,
                            Peso_original: doc.data().Peso,
                            Peso: doc.data().Peso,
                        });
                        renderTable(estoque);
                        sum_cards();
                    });
                })
        }
        else {
            renderTable(estoque);
            sum_cards();
        }

        input.value = "";
        input.focus();

    }


})


// --------------------------- Renderizar Tabela ------------------------------

function renderTable(datas) {

    const tbody = document.getElementById('tbody')
    const newItem = document.createElement('tr')
    newItem.setAttribute('class', 'loading_table')
    newItem.appendChild(document.createTextNode('Loading...'))
    tbody.appendChild(newItem)


    tbody.innerHTML = ''

    datas.forEach((data) => {
        const linha = tbody.insertRow(tbody.rows.length);
        const cellCodigo = linha.insertCell(0);
        const cellProduto = linha.insertCell(1);
        const cellCor = linha.insertCell(2);
        const cellQtd = linha.insertCell(3);

        cellCodigo.innerHTML = `<button class="btn__remove-transp"></button> <h3>${data.Codigo}</h3> <button class="btn__remove"><img src="img/subtracting.png" alt="Delete" id="remove_${data.Codigo}"></button>`;
        cellProduto.innerHTML = `Produto: ${data.Produtos}`;
        cellCor.innerHTML = `Cor: ${data.Cores}`;
        cellQtd.innerHTML = `Qtd: ${data.Quantidade}`;
    });

    newItem.style.display = 'none';

}

// ------------------ Achar o índice do elemento no array estoque depois que clicar no remove ------------------

function findIndex(cod) {
    for (let i = 0; i < estoque.length; i++) {
        if (estoque[i].Codigo === cod) {
            return i
        }
    }
}



// ------------------ Função para atualizar a tabela depois que clicar no remove ------------------
function updateTable() {
    const tbody = document.getElementById('tbody')
    tbody.innerHTML = ''

    estoque.forEach((data) => {
        const linha = tbody.insertRow(tbody.rows.length);
        const cellCodigo = linha.insertCell(0);
        const cellProduto = linha.insertCell(1);
        const cellCor = linha.insertCell(2);
        const cellQtd = linha.insertCell(3);

        cellCodigo.innerHTML = `<button class="btn__remove-transp"></button> <h3>${data.Codigo}</h3> <button class="btn__remove" ><img src="img/subtracting.png" alt="Delete" id="remove_${data.Codigo}"></button>`;
        cellProduto.innerHTML = `Produto: ${data.Produtos}`;
        cellCor.innerHTML = `Cor: ${data.Cores}`;
        cellQtd.innerHTML = `Qtd: ${data.Quantidade}`;
    });
}



// ------------------ Atualizar o estoque e a tabela ao clicar no botão "remove" ------------------

document.addEventListener('click', function (event) {
    if (event.target.id.startsWith('remove_')) {
        const cod = event.target.id.split('_')[1]
        const index = findIndex(cod)
        estoque[index].Quantidade -= 1
        estoque[index].Cubagem -= estoque[index].Cubagem_original
        estoque[index].Peso -= estoque[index].Peso_original
        if (estoque[index].Quantidade === 0) {
            estoque.splice(index, 1)
        }
        updateTable();
        sum_cards();
        console.log(estoque)
    }
})



// --------------------------- Somar Cub/Peso/Volumes dentro do array ------------------------------

function sum_cards() {
    const sum_vol = estoque.reduce(function (acc, obj) {
        return acc + obj.Quantidade
    }, 0)

    const sum_peso = estoque.reduce(function (acc, obj) {
        return acc + obj.Peso
    }, 0)

    const sum_cub = estoque.reduce(function (acc, obj) {
        return acc + obj.Cubagem
    }, 0)

    card_volumes.innerHTML = `${sum_vol} `

    card_peso.innerHTML = `${sum_peso.toFixed(2)} `

    card_cub.innerHTML = `${sum_cub.toFixed(3)} `
}



// --------------------------- Adicionar dados no Bando de Dados ------------------------------

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
                estoque.forEach((e) => {
                    db.collection("Estoque").doc(e.Codigo).update({
                        Qtd: firebase.firestore.FieldValue.increment(e.Quantidade),
                        CubagemTotal: firebase.firestore.FieldValue.increment(e.Cubagem),
                        PesoTotal: firebase.firestore.FieldValue.increment(e.Peso),
                    })
                })

                let timerInterval
                Swal.fire({
                    title: 'Atualizando Estoque!',
                    html: 'Loading...',
                    timer: 2000,
                    timerProgressBar: true,
                    didOpen: () => {
                        Swal.showLoading()
                        const b = Swal.getHtmlContainer().querySelector('b')
                        timerInterval = setInterval(() => {
                            b.textContent = Swal.getTimerLeft()
                        }, 100)
                    },
                    willClose: () => {
                        clearInterval(timerInterval)
                    }
                }).then((result) => {
                    /* Read more about handling dismissals below */
                    if (result.dismiss === Swal.DismissReason.timer) {
                        window.location.replace('relacao.html')
                    }
                })
            }
        })
    } else if (tbody.rows.length == 0) {
        swal.fire({
            title: 'Nenhum Produto!',
            icon: 'error',
            showconfirmButton: true,
            confirmButtonText: 'Ok'
        });
    }

});




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
                window.location.replace('relacao.html')
            }, 1000)

        }
    })
})





window.onload = () => {
    getUser();
    const loading = document.getElementById('loading');
    input.focus()
    loading.style.display = 'none'
   
}

document.querySelector('body').onkeydown = () => {
    input.focus()
}






window.onbeforeunload = function () {

    if (tbody.rows.length == 0) {
        window.location.replace('relacao.html')
    } else {
        Swal.fire({
            title: 'Cancelar operação?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Fechar',
            confirmButtonText: 'Confirmar'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    icon: 'sucess',
                })

                setTimeout(() => {
                    window.location.replace('relacao.html')
                }, 1000)

            }
        })
    }
}

