const firebaseConfig = {
    apiKey: "AIzaSyDh6_fijd6VKOHeo3_lyboPMn6KfLJd-1w",
    authDomain: "db-firebase-5d90c.firebaseapp.com",
    projectId: "db-firebase-5d90c",
    storageBucket: "db-firebase-5d90c.appspot.com",
    messagingSenderId: "210076045087",
    appId: "1:210076045087:web:0dcc5f236fb364d3dc2a2a"
  };

firebase.initializeApp(firebaseConfig)

const db = firebase.firestore()


firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        let userLabel = document.getElementById("user_email")
        userLabel.innerHTML = user.email
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


const estoque = []


//  --------------------------------- Ler dados --------------------------------- 
async function read_db() {
    estoque.length = 0;
    const read = await db.collection('Estoque').get()

    read.forEach((doc) => {
        estoque.push({
            Cod: doc.id,
            Produto: doc.data().Produto,
            Cor: doc.data().Cor,
            Qtd: doc.data().Qtd,
            Peso: doc.data().Peso,
            Cub: doc.data().Cubagem,
            PesoTotal: doc.data().PesoTotal,
            CubTotal: doc.data().CubagemTotal,
            CompEmb: doc.data().CompEmb,
            LargEmb: doc.data().LargEmb,
            ProfEmb: doc.data().ProfEmb,
            CompProd: doc.data().CompProd,
            LargProd: doc.data().LargProd,
            ProfProd: doc.data().ProfProd,

        })
    })

    table(estoque)
    showItems();
}


//  --------------------------------- Renderizar Tabela ---------------------------------
function table(data) {

    const tbody = document.getElementById("tbody");
    tbody.innerHTML = "";
    console.log(data)
    data.forEach((e) => {

        const linha = tbody.insertRow();

        const cellCodigo = linha.insertCell(0);
        const cellProduto = linha.insertCell(1);
        const cellCor = linha.insertCell(2);
        const codigoCelula = linha.insertCell(3);
        const downloadCelula = linha.insertCell(4);
        const cellbtnzoom = linha.insertCell(5);

        // Cria QrCode
        const qrCode = new QRCode(codigoCelula, {
            text: e.Cod,
            width: 250,
            height: 250
        });

        // Cria o botão de download
        const botaoDownload = document.createElement('button');
        botaoDownload.innerHTML = '<i class="fa-solid fa-file-arrow-down"></i>';
        botaoDownload.setAttribute('class', 'download')
        botaoDownload.addEventListener('click', () => {
            const canvas = codigoCelula.querySelector('canvas');
            const link = document.createElement('a');
            link.download = `${e.Cod}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        });


        codigoCelula.style.display = "none"

        cellCodigo.innerHTML = e.Cod;
        cellProduto.innerHTML = e.Produto;
        cellCor.innerHTML = e.Cor;
        cellbtnzoom.innerHTML = `<button class="btn_zoom" id="btn_zoom-modal"><i class="fa-solid fa-magnifying-glass" id="btn_modal"></i></button>`
        downloadCelula.appendChild(botaoDownload);



        const modal = document.getElementById('exampleModal');
        const overlay = document.getElementById('overlay')

        cellbtnzoom.querySelector('#btn_zoom-modal').addEventListener('click', () => {

            // Abre o modal

            modal.style.display = 'block';
            overlay.style.display = 'block';

            // Preenche os valores dos inputs do modal com as informações capturadas    
            const codigoInput_tittle = modal.querySelector('#modal_codigo-tittle');
            const codigoInput = modal.querySelector('#modal_codigo');
            const produtoInput = modal.querySelector('#modal_produto');
            const corInput = modal.querySelector('#modal_cor');
            const pesoInput = modal.querySelector('#modal_peso');
            const cubInput = modal.querySelector('#modal_cub');

            const modal_comp_prod = modal.querySelector('#modal_comp_prod');
            const modal_larg_prod = modal.querySelector('#modal_larg_prod');
            const modal_prof_prod = modal.querySelector('#modal_prof_prod');

            const modal_comp_emb = modal.querySelector('#modal_comp_emb');
            const modal_larg_emb = modal.querySelector('#modal_larg_emb');
            const modal_prof_emb = modal.querySelector('#modal_prof_emb');

            codigoInput_tittle.innerHTML = e.Cod;
            codigoInput.value = e.Cod;
            produtoInput.value = e.Produto;
            corInput.value = e.Cor;
            pesoInput.value = e.Peso.toFixed(2);
            cubInput.value = e.Cub.toFixed(3);

            modal_comp_prod.value = e.CompProd;
            modal_larg_prod.value = e.LargProd;
            modal_prof_prod.value = e.ProfProd;
            modal_comp_emb.value = e.CompEmb;
            modal_larg_emb.value = e.LargEmb;
            modal_prof_emb.value = e.ProfEmb;


            const modal_delete = document.getElementById('modal_delete')

            modal_delete.addEventListener('click', () => {

                swal.fire({
                    title: `Excluir Produto?`,
                    text: `${modal.querySelector('#modal_produto').value}`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    cancelButtonText: 'Cancelar',
                    confirmButtonText: 'Confirmar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        db.collection("Estoque").doc(modal.querySelector('#modal_codigo-tittle').textContent).delete()

                        let timerInterval
                        Swal.fire({
                            title: 'Atualizando!',
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
                                window.location.replace('cadastro.html')
                            }
                        })
                    }
                })


            })


            const modal_edit = document.getElementById('modal_edit')

            modal_edit.addEventListener('click', () => {

                produtoInput.removeAttribute('readonly')
                corInput.removeAttribute('readonly')
                pesoInput.removeAttribute('readonly')
                cubInput.removeAttribute('readonly')
                modal_comp_prod.removeAttribute('readonly')
                modal_larg_prod.removeAttribute('readonly')
                modal_prof_prod.removeAttribute('readonly')
                modal_comp_emb.removeAttribute('readonly')
                modal_larg_emb.removeAttribute('readonly')
                modal_prof_emb.removeAttribute('readonly')

                produtoInput.classList.add('input_change')
                corInput.classList.add('input_change')
                pesoInput.classList.add('input_change')
                cubInput.classList.add('input_change')
                modal_comp_prod.classList.add('input_change')
                modal_larg_prod.classList.add('input_change')
                modal_prof_prod.classList.add('input_change')
                modal_comp_emb.classList.add('input_change')
                modal_larg_emb.classList.add('input_change')
                modal_prof_emb.classList.add('input_change')

                produtoInput.focus()

                const modal_footer = document.getElementById('modal_footer')
                modal_footer.style.display = 'none'

                const modal_footer_edit = document.getElementById('modal_footer_edit')
                modal_footer_edit.style.display = 'flex'

            })

            const modal_cancel = document.getElementById('modal_cancel')
            modal_cancel.addEventListener('click', () => {
                const modal_footer_edit = document.getElementById('modal_footer_edit')
                modal_footer_edit.style.display = 'none'
                const modal_footer = document.getElementById('modal_footer')
                modal_footer.style.display = 'flex'

                produtoInput.setAttribute('readonly', 'readonly')
                corInput.setAttribute('readonly', 'readonly')
                pesoInput.setAttribute('readonly', 'readonly')
                cubInput.setAttribute('readonly', 'readonly')
                modal_comp_prod.setAttribute('readonly', 'readonly')
                modal_larg_prod.setAttribute('readonly', 'readonly')
                modal_prof_prod.setAttribute('readonly', 'readonly')
                modal_comp_emb.setAttribute('readonly', 'readonly')
                modal_larg_emb.setAttribute('readonly', 'readonly')
                modal_prof_emb.setAttribute('readonly', 'readonly')

                produtoInput.classList.remove('input_change')
                corInput.classList.remove('input_change')
                pesoInput.classList.remove('input_change')
                cubInput.classList.remove('input_change')
                modal_comp_prod.classList.remove('input_change')
                modal_larg_prod.classList.remove('input_change')
                modal_prof_prod.classList.remove('input_change')
                modal_comp_emb.classList.remove('input_change')
                modal_larg_emb.classList.remove('input_change')
                modal_prof_emb.classList.remove('input_change')
            })

        });;

        const modal_close = document.getElementById('modal_close')
        modal_close.addEventListener('click', () => {

            const modal_footer_edit = document.getElementById('modal_footer_edit')
            modal_footer_edit.style.display = 'none'
            const modal_footer = document.getElementById('modal_footer')
            modal_footer.style.display = 'flex'

            modal.style.display = 'none';
            overlay.style.display = 'none';

            const produtoInput = modal.querySelector('#modal_produto');
            const corInput = modal.querySelector('#modal_cor');
            const pesoInput = modal.querySelector('#modal_peso');
            const cubInput = modal.querySelector('#modal_cub');

            const modal_comp_prod = modal.querySelector('#modal_comp_prod');
            const modal_larg_prod = modal.querySelector('#modal_larg_prod');
            const modal_prof_prod = modal.querySelector('#modal_prof_prod');

            const modal_comp_emb = modal.querySelector('#modal_comp_emb');
            const modal_larg_emb = modal.querySelector('#modal_larg_emb');
            const modal_prof_emb = modal.querySelector('#modal_prof_emb');

            produtoInput.classList.remove('input_change')
            corInput.classList.remove('input_change')
            pesoInput.classList.remove('input_change')
            cubInput.classList.remove('input_change')
            modal_comp_prod.classList.remove('input_change')
            modal_larg_prod.classList.remove('input_change')
            modal_prof_prod.classList.remove('input_change')
            modal_comp_emb.classList.remove('input_change')
            modal_larg_emb.classList.remove('input_change')
            modal_prof_emb.classList.remove('input_change')
        })

        const modal_save = document.getElementById('modal_save')

        modal_save.addEventListener('click', () => {

            const codigoInput = modal.querySelector('#modal_codigo');
            const produtoInput = modal.querySelector('#modal_produto');
            const corInput = modal.querySelector('#modal_cor');
            const pesoInput = modal.querySelector('#modal_peso');
            const cubInput = modal.querySelector('#modal_cub');

            const modal_comp_prod = modal.querySelector('#modal_comp_prod');
            const modal_larg_prod = modal.querySelector('#modal_larg_prod');
            const modal_prof_prod = modal.querySelector('#modal_prof_prod');

            const modal_comp_emb = modal.querySelector('#modal_comp_emb');
            const modal_larg_emb = modal.querySelector('#modal_larg_emb');
            const modal_prof_emb = modal.querySelector('#modal_prof_emb');

            const pesoInput_number = parseFloat(pesoInput.value)
            const cubInput_number = parseFloat(cubInput.value)


            const input_cadastro = document.querySelectorAll('[data-input="input_cadastro_change"]')

            let inputsValidos = true

            input_cadastro.forEach((e) => {

                if (e.value === "") {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Preencha todos os campos!'
                    })
                    e.classList.add('highlight')
                    inputsValidos = false

                }

                if (e.value !== "") {
                    e.classList.remove('highlight');
                }

            })

            if (inputsValidos) {
                swal.fire({
                    title: `Confirmar Alterações?`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    cancelButtonText: 'Cancelar',
                    confirmButtonText: 'Confirmar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        db.collection("Estoque").doc(codigoInput.value).update({
                            Codigo: codigoInput.value,
                            Produto: produtoInput.value.toUpperCase(),
                            Cor: corInput.value.toUpperCase(),
                            Peso: pesoInput_number,
                            Cubagem: cubInput_number,
                            CompEmb: modal_comp_emb.value,
                            LargEmb: modal_larg_emb.value,
                            ProfEmb: modal_prof_emb.value,
                            CompProd: modal_comp_prod.value,
                            LargProd: modal_larg_prod.value,
                            ProfProd: modal_prof_prod.value,
                        })

                        let timerInterval
                        Swal.fire({
                            title: 'Atualizando Cadastro!',
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
                                window.location.replace('cadastro.html')
                            }
                        })
                    }
                })
            }


        })

    });



}

//  --------------------------------- Download QrCode ---------------------------------
function downloadImage(url) {

    const link = document.createElement('a');
    link.href = url;
    link.download = 'qrcode.png';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

}


//  ------------------------ Tirar virgula input peso e cubamgem -------------------------------
const peso = document.getElementById('peso')

peso.addEventListener('blur', () => {
    const peso_virgula = peso.value.replace(",", ".")
    peso.value = peso_virgula
})
const cubagem = document.getElementById('cubagem')
cubagem.addEventListener('blur', () => {
    const cubagem_virgula = cubagem.value.replace(",", ".")
    cubagem.value = cubagem_virgula
})


//  --------------------------------- Enviar dados para Banco de Dados ---------------------------------
const submit_btn = document.getElementById('cadastro')

submit_btn.addEventListener('submit', (event) => {

    event.preventDefault()

    console.log(estoque)
    const cod = document.getElementById('codigo')
    const produto_value = document.getElementById('produto')
    const cor_value = document.getElementById('cor')
    const peso = document.getElementById('peso')
    const cubagem = document.getElementById('cubagem')

    const produto = produto_value.value.toUpperCase()
    const cor = cor_value.value.toUpperCase()

    const comp_produto = document.getElementById('comp_produto')
    const larg_produto = document.getElementById('larg_produto')
    const prof_produto = document.getElementById('prof_produto')

    const comp_emb = document.getElementById('comp_emb')
    const larg_emb = document.getElementById('larg_emb')
    const prof_emb = document.getElementById('prof_emb')

    const peso_number = Number(peso.value)
    const cub_number = Number(cubagem.value)

    console.log(peso_number + ">" + typeof (peso_number))
    console.log(cub_number + ">" + typeof (cub_number))
    const input_cadastro = document.querySelectorAll('[data-input="input_cadastro"]')

    let inputsValidos = true

    input_cadastro.forEach((e) => {

        if (e.value === "") {

            e.classList.add('highlight')
            inputsValidos = false

        } if (e.id === 'codigo' && e.value.length !== 3) {
            Swal.fire({
                title: 'Código deve possuir 3 caracteres!',
                icon: 'info',
            })
            inputsValidos = false
        }

        if (e.value !== "") {
            e.classList.remove('highlight');
        }

    })


    if (inputsValidos) {

        db.collection("Estoque").doc(cod.value).set({
            Codigo: cod.value,
            Produto: produto,
            Cor: cor,
            Peso: peso_number,
            Cubagem: cub_number,
            PesoTotal: 0,
            CubagemTotal: 0,
            Qtd: 0,
            CompEmb: comp_emb.value,
            LargEmb: larg_emb.value,
            ProfEmb: prof_emb.value,
            CompProd: comp_produto.value,
            LargProd: larg_produto.value,
            ProfProd: prof_produto.value,
        })


        // produto_value = ""
        // cor_value = ""
        // peso.value = ""
        // cubagem.value = ""

        cod.focus()
        read_db()
        submit_btn.reset()
    }

})



//  ------------------ Busca ----------------------------

const searchButton = document.getElementById('confirm_filter')
searchButton.addEventListener('click', () => {

    const searchInputCod = document.getElementById('filter_cod').value.toUpperCase()
    const searchInput = document.getElementById('filter_produto').value.toUpperCase()
    const searchInputCor = document.getElementById('filter_cor').value.toUpperCase()


    const filteredEstoque = estoque.filter((item) => {
        const cod = item.Cod.toUpperCase()
        const produto = item.Produto.toUpperCase()
        const cor = item.Cor.toUpperCase()
        return cod.includes(searchInputCod) && produto.includes(searchInput) && cor.includes(searchInputCor)
    })
    table(filteredEstoque)


})

const cancelButton = document.getElementById('cancel_filter')

cancelButton.addEventListener('click', () => {
    const searchInputCod = document.getElementById('filter_cod').value.toUpperCase()
    const searchInput = document.getElementById('filter_produto').value.toUpperCase()
    const searchInputCor = document.getElementById('filter_cor').value.toUpperCase()


    document.getElementById('filter_cod').value = ""
    document.getElementById('filter_produto').value = ""
    document.getElementById('filter_cor').value = ""

    table(estoque)

})


//  ------------------ Paginação table ----------------------------
const itemsPerPage = 15;
let currentPage = 1;

function showItems() {
    const rows = document.querySelectorAll("#tableProducts tbody tr");
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    for (let i = 0; i < rows.length; i++) {
        rows[i].style.display = i >= startIndex && i < endIndex ? "" : "none";
    }
}

document.getElementById("prevPage").addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        showItems();
    }
});

document.getElementById("nextPage").addEventListener("click", () => {
    const rows = document.querySelectorAll("#tableProducts tbody tr");
    if (currentPage < Math.ceil(rows.length / itemsPerPage)) {
        currentPage++;
        showItems();
    }
});





window.onload = function () {
    read_db();
}