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

const estoque =[]

const input_cod = document.getElementById('input_cod')
const camera = document.getElementById('camera')
const cam = document.getElementById('preview')

let scanner = new Instascan.Scanner(
    {
        video: document.getElementById('preview')
        
    }
);


scanner.addListener('scan', function (content) {
    
    camera.classList.toggle('camera_off')
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
        if (result.dismiss === Swal.DismissReason.timer) {
            input_cod.value = content
        }

        db.collection("Estoque").where("Codigo", '==', content)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        estoque.push({
                            Codigo: content,
                            Produtos: doc.data().Produto,
                            Cores: doc.data().Cor,
                            Quantidade: doc.data().Qtd,                           
                            Cubagem: doc.data().CubagemTotal,                          
                            Peso: doc.data().PesoTotal,
                        });
                        renderTable(estoque)
                        const table = document.getElementById('table')
                        table.classList.toggle('table--ativo')
                    });
                })
    })
    
});


Instascan.Camera.getCameras().then(cameras => {
    if (cameras.length > 0) {    
        scanner.start(cameras[1]);
    } else {
        alert("Não existe câmera no dispositivo!");
    }
});



function renderTable() {

    const tbody = document.getElementById('tbody')
    const newItem = document.createElement('tr')
    newItem.setAttribute('class', 'loading_table')
    newItem.appendChild(document.createTextNode('Loading...'))
    tbody.appendChild(newItem)


    tbody.innerHTML = ''

    estoque.forEach((data) => {
        const linha = tbody.insertRow(tbody.rows.length);
        const cellCodigo = linha.insertCell(0);
        const cellProduto = linha.insertCell(1);
        const cellCor = linha.insertCell(2);
        const cellQtd = linha.insertCell(3);
        const cellCub = linha.insertCell(4);
        const cellPeso = linha.insertCell(5);

        cellCodigo.innerHTML = `<h3>${data.Codigo}</h3>`;
        cellProduto.innerHTML = `Produto: ${data.Produtos}`;
        cellCor.innerHTML = `Cor: ${data.Cores}`;
        cellQtd.innerHTML = `Qtd: ${data.Quantidade}`;
        cellCub.innerHTML = `Cor: ${data.Cubagem}`;
        cellPeso.innerHTML = `Qtd: ${data.Peso}`;

    });

    newItem.style.display = 'none';
    
}