'use strict';

/* Se genera el servidor */
const express = require('express');
const server = express();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const dotenv = require('dotenv');
const crypto = require('crypto');
const secret = process.env.secret;
const port = 3000;
const cors = require('cors');
const router = express.Router();

/* Configuración del servidor*/
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use('/html', express.static('.'));
server.use('/html', router);
server.use(cors)
dotenv.config();
const TOKEN_SECRET = process.env.TOKEN_SECRET;

var db = new sqlite3.Database(
    'datos.db',
    function(err){
        if (err) // Si ha ocurrido un error
            console.log(err);
    }       
);

/* Configurar rutas*/
router.post('/api/auth/login', function(req, res){
    if(!req.body.email || req.body.password){
        res.json({Error: 'Petición mal formada'});
    }
    else{
        processLogin(req, res, db);
    }
});

function processLogin(req, res, db){
    var email = req.body.email;
    var password = req.body.password;

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
                    token: generarTokenDeUsuario(row.username)
                }
                res.json(data);
            }
        }
)};

server.listen(port, function(){
    console.log(`Servidor corriendo por el puerto ${port}`);
});

/* PROCESAMIENTO DE DATOS */

function generarTokenDeUsuario(user) {
    return jwt.sign({user: user}, TOKEN_SECRET);
}



