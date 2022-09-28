//Enrutar archivo con el método ROUTER de Express.
/*const {Router}=require('express');
const router=Router();

module.exports=router;*/
const app = require('../app.js');
console.log(app);
console.log('hola');

const anuncio = document.querySelector('.anuncio');

if (app = 'usuario registrado') {
    alert('usuario regis');
    anuncio.style.color = "#F00";
} else if (app = 'usuario no registrado'){
    anuncio.style.color = "#FFF";
    alert('usuario no regis');

};