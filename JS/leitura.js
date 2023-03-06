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



const input_cod = document.getElementById('input_cod')
const cam = document.getElementById('preview')
let scanner = new Instascan.Scanner(
    {
        video: document.getElementById('preview')
    }
);


scanner.addListener('scan', function (content) {
    input_cod.value = content
    cam.style.display = 'none'
});


Instascan.Camera.getCameras().then(cameras => {
    if (cameras.length > 0) {
        console.log(cameras)
        scanner.start(cameras[1]);
    } else {
        console.error("Não existe câmera no dispositivo!");
    }
});