const botaoMenu = document.getElementById('cabecalho__menu')
const body = document.querySelector('body');
const menu = document.getElementById('menu_lateral')
const tbody = document.getElementById('tbody')

botaoMenu.addEventListener('click', () => {
    menu.classList.toggle('menu-lateral--ativo')
})

// Ir para relacao.htmml
const btn_inicio = document.getElementById('menuLateralInicio')


btn_inicio.addEventListener('click', function () {
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
});


// Ir para input.htmml
const btn_input = document.getElementById('menuLateralVideos')

btn_input.addEventListener('click', function () {
    if (tbody.rows.length == 0) {
        window.location.replace('input.html')
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
    }
});

// Ir para output.htmml
const btn_output = document.getElementById('menuLateralPicos')

btn_output.addEventListener('click', function () {
    if (tbody.rows.length == 0) {
        window.location.replace('output.html')
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
                    window.location.replace('output.html')
                }, 1000)

            }
        })
    }
});

// Ir para index.htmml
const logout = document.getElementById('menuLateralCamisas')

logout.addEventListener('click', function () {
    Swal.fire({
        title: 'Confirmar Logout?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Fechar',
        confirmButtonText: 'Confirmar'
    }).then((result) => {
        if (result.isConfirmed) {
            let timerInterval
            Swal.fire({
                // title: 'Auto close alert!',
                html: 'Loading...',
                timer: 3000,
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
});

