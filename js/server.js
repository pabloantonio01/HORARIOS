'use strict';

/* Se genera el servidor */
const express = require('express');
const server = express();
const session = require('express-session')
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const port = 3000;
const router = express.Router();
const sesscfg = {
    secret: 'practicas-lsi-2023',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 8*60*60*1000 } // 8 working hours
};
server.use(session(sesscfg));

/* Configuración del servidor*/
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

var db = new sqlite3.Database(
    'datos.db',
    function(err){
        if (err) // Si ha ocurrido un error
            console.log(err);
    }       
);

server.get('/', function(req, res) {
    res.send('Hola Mundo!');
  });

/* Configurar rutas*/
router.post('/api/auth/login', function(req, res){
    console.log('Realizando registro');
    if(req.body.email==undefined || req.body.password==undefined){
        res.json({Error: 'Petición mal formada'});
    }
    else{
        processLogin(req, res, db);
    }
});

function processLogin(req, res, db){
    var id = req.body.user_id
    var email = req.body.email;
    var password = req.body.password;
    console.log(email);
    console.log(password);
    db.get(
        'SELECT * FROM users WHERE email=?', email,
        function(err, row){
            if(row == undefined){
                res.json({Error: 'Usuario no existe'});
            }
            else if(row.password != password){
                res.json({Error: 'Contraseña mal introducida'});
            }
            else{
                var data = {
                    id: row.id,
                    email: row.email,
                    username: row.username,
                }
                res.json(data);
                console.log('Registro correcto');
            }
        }
)};

server.use(express.static('.'));
server.use(router);

server.listen(port, function(){
    console.log(`Servidor corriendo por el puerto ${port}`);
});



