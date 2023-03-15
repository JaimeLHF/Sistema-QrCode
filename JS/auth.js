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


var btnLogin = document.getElementById('btnLogin')
var email = document.getElementById('email')
var password = document.getElementById('password')


btnLogin.addEventListener('click', function () {
    login()   
});


document.getElementById('email')
    .addEventListener('keyup', function (event) {
        if (event.code === 'Enter') {
            event.preventDefault();
            login()
        }
    });


document.getElementById('password')
    .addEventListener('keyup', function (event) {
        if (event.code === 'Enter') {
            event.preventDefault();
            login()
        }
    });



function login() {
    
    if (firebase.auth().currentUser) {  
             
        firebase.auth().signOut()
    }
    btnLogin.classList.toggle('button--loading') 
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
           
            let timerInterval
            Swal.fire({
                icon: 'info',
                // title: '',
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
        })
        .catch((error) => {
            btnLogin.classList.toggle('button--loading')
            const erroCode = error.code

            switch (erroCode) {
                case "auth/wrong-password":
                    swal.fire({
                        icon: "error",
                        title: "Senha Inválida!",
                    })
                    break

                case "auth/invalid-email":
                    swal.fire({
                        icon: "error",
                        title: "Email Inválido!",
                    })
                    break

                default:
                    swal.fire({
                        icon: "error",
                        title: error.message,
                    })
            }
        })
}



