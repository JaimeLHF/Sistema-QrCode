const botaoMenu = document.getElementById('cabecalho__menu')
const body = document.querySelector('body');
const menu = document.getElementById('menu_lateral')
const tbody = document.getElementById('tbody')
const qtdLinhas = tbody.rows.length

botaoMenu.addEventListener('click', () => {
    menu.classList.toggle('menu-lateral--ativo')
})

// Ir para relacao.htmml
const btn_inicio = document.getElementById('menuLateralInicio')

btn_inicio.addEventListener('click', function () {

    console.log(qtdLinhas)
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
            Swal.fire({
                icon: 'sucess',
            })

            setTimeout(() => {
                window.location.replace('relacao.html')
            }, 1000)

        }
    })

});


// Ir para input.htmml
const btn_input = document.getElementById('menuLateralVideos')

btn_input.addEventListener('click', function () {
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
                '',
                '',
                'success'
            )

            setTimeout(() => {
                window.location.replace('input.html')
            }, 1000)

        }
    })

});

// Ir para output.htmml
const btn_output = document.getElementById('menuLateralPicos')

btn_output.addEventListener('click', function () {
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

            Swal.fire({
                icon: 'sucess',
            })

            setTimeout(() => {
                window.location.replace('output.html')
            }, 1000)

        }
    })

});

// Ir para index.htmml
const logout = document.getElementById('menuLateralCamisas')

logout.addEventListener('click', function () {
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
            Swal.fire({
                icon: 'sucess',
            })

            setTimeout(() => {
                window.location.replace('index.html')
            }, 1000)

        }
    })

});

