'use strict';

/* Se genera el servidor */
const express = require('express');
const server = express();
const session = require('express-session');
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
        res = processLogin(req, res, db);
    }
});

function processLogin(req, res, db){
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
                req.session.username = row.username;
                var data = {
                    email: row.email,
                    username: row.username,
                    role: row.role
                }
                console.log('Registro correcto');
                return res.json(data);
            }
        }
)};

router.get('/api/users', function(req, res){
    listarUsuarios(req, res, db);
});

function listarUsuarios(req, res, db){
    var name = req.session.username;
    db.all(
        'SELECT email, username, role FROM users WHERE username=?', name,
        function(err, rows){
            res.json(rows);
        }
    )
};

router.get('/api/categorias', function(req, res){
    listarCategorias(req, res, db);
});

function listarCategorias(req, res, db){
    var name = req.session.username;
    console.log(name);
    db.all(
        'SELECT name FROM categorias WHERE creator=?', name,
        function(err, rows){
            res.json(rows);
        }
    )
};

router.get('/api/videos', function(req, res){
    listarVideos(req, res, db);
});

function listarVideos(req, res, db){
    var name = req.session.username;
    console.log(name);
    db.all(
        'SELECT name, url FROM videos WHERE creator=?', name,
        function(err, rows){
            res.json(rows);
        }
    )
};


server.use(express.static('.'));
server.use(router);

server.listen(port, function(){
    console.log(`Servidor corriendo por el puerto ${port}`);
});



