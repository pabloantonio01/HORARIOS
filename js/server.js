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

/* Configurar rutas y funciones necesarias del API REST*/
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
                req.session.role = row.role;
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
        'SELECT email, username, role FROM users',
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
    db.all(
        'SELECT name, url, category FROM videos',
        function(err, rows){
            res.json(rows);
        }
    )
};

router.post('/api/users', function(req, res){
    if(req.session.role != 'admin'){
        res.json({Error: 'No puede crear, eliminar o modificar usuarios'});
    }
    else{
        crearUsuarios(req, res, db);
    }
});

function crearUsuarios(req, res, db){
    var role = 'user';
    db.get(
        'INSERT INTO users (email, password, username, role) VALUES (?,?,?,?)', req.body.email, req.body.password, req.body.username, role,
        function(err){
            if(err == true || req.body.email == undefined || req.body.password == undefined || req.body.username == undefined){
                res.json({Error: 'Error al crear usuario'});
            }
            else{
                res.json({Bien: 'Usuario creado'});
            }
        }
    )
};

router.post('/api/categorias', function(req, res){
    if(req.session.role != 'admin'){
        res.json({Error: 'No puede crear, eliminar o modificar categorias'});
    }
    else{
        crearCategorias(req, res, db);
    }
});

function crearCategorias(req, res, db){
    var creator = req.session.username;
    var name = req.body.name;
    db.get(
        'INSERT INTO categorias (name, creator) VALUES (?,?)', name, creator,
        function(err){
            if(err == true || creator == undefined || name == undefined){
                res.json({Error: 'Error al crear categoría'})
            }
            else{
                res.json({Bien: 'Categoría creada'})
            }
        }
)};

router.post('/api/videos', function(req, res){
    if(req.session.role != 'admin'){
        res.json({Error: 'No puede crear, eliminar o modificar videos'});
    }
    else{
        crearVideos(req, res, db);
    }
});

function crearVideos(req, res, db){
    var name = req.body.name;
    var creator = req.session.username;
    var url = req.body.url;
    var category = req.body.category;

    db.get(
        'SELECT * FROM categorias WHERE name=?', category,
        function(err, row){
            if(err == true || row == undefined){
                res.json({Error: 'La categoría introducida no existe en la base de datos'});
            }
            else{
                db.get(
                    'INSERT INTO videos (name, creator, url, category) VALUES (?,?,?,?)', name, creator, url, category,
                    function(err){
                        if(name == undefined || url == undefined || creator == undefined){
                            res.json({Error: 'Error al crear vídeo'});
                        }
                        else{
                            res.json({Bien: 'Vídeo creado'});
                        }
                    }
                )
            }
        }
)};

router.put('/api/users', function(req, res){
    if(req.session.role != 'admin'){
        res.json({Error: 'No puede crear, eliminar o modificar usuarios'});
    }
    else{
        modificarUsuarios(req, res, db);
    }
});

function modificarUsuarios(req, res, db){
    var email = req.body.email;
    var contraseña = req.body.password;
    var new_name = req.body.new_name;
    var old_email = req.body.old_email;
    db.get(
        'SELECT * FROM users WHERE email=?', old_email,
        function(err, row){
            if(err || row == undefined){
                res.json({Error: 'Usuario inexistente en la base de datos'});
            }
            else{
                db.get(
                    'UPDATE users SET email=?, password=?, username=? WHERE email=?', email, contraseña, new_name, old_email,
                    function(err){
                        if(err == true || email == undefined || contraseña == undefined || new_name == undefined, old_email == undefined){
                            res.json({Error: 'Error al modificar usuario'});
                        }
                        else{
                            res.json({Bien: 'Usuario modificado'});
                        }
                    }
                )
            }
        }
)};

router.put('/api/categorias', function(req, res){
    if(req.session.role != 'admin'){
        res.json({Error: 'No puede crear, eliminar o modificar categorias'});
    }
    else{
        modificarCategorias(req, res, db);
    }
});

function modificarCategorias(req, res, db){
    var old_name = req.body.old_name;
    var new_name = req.body.new_name;
    var creator = req.session.username;
    
    db.get(
        'SELECT * FROM categorias WHERE name=?', old_name,
            function(err, row){
                if(err || row == undefined){
                    res.json({Error: 'Categoría inexistente en la base de datos'});
                }
                else{
                    db.get(
                        'UPDATE categorias SET name=?, creator=? WHERE name=?', new_name, creator, old_name,
                            function(err){
                                if(err == true || new_name == undefined){
                                    res.json({Error: 'Error al modificar categoría'});
                                }
                                else{
                                        res.json('Categoría modificada correctamente');
                                }
                            }
                    )
                }
            }
)};
    
router.put('/api/videos', function(req, res){
    if(req.session.role != 'admin'){
        res.json({Error: 'No puede crear, eliminar o modificar videos'});
    }
    else{
        modificarVideos(req, res, db);
    }
});

function modificarVideos(req, res, db){
    var old_name = req.body.old_name;
    var new_name = req.body.new_name;
    var url = req.body.url;
    var category = req.body.category;
    var creator = req.session.username;
    db.get(
        'SELECT * FROM categorias WHERE name=?', category,
            function(err, row){
                if(err || row == undefined){
                    res.json({Error: 'Categoría inexistente en la base de datos'});
                }
                else{
                    db.get(
                        'UPDATE videos SET name=?, creator=?, url=? WHERE name=?', new_name, creator, url, old_name,
                            function(err){
                                if(err == true || new_name == undefined || old_name == undefined || url == undefined){
                                    res.json({Error: 'Error al modificar vídeo'});
                                }
                                else{
                                        res.json('Vídeo modificado correctamente');
                                }
                            }
                    )
                }
            }

)};

router.delete('/api/users', function(req, res){
    if(req.session.role != 'admin'){
        res.json({Error: 'No puede crear, eliminar o modificar usuarios'});
    }
    else{
        eliminarUsuarios(req, res, db);
    }
});

function eliminarUsuarios(req, res, db){
    var email = req.body.email;
    db.get(
        'SELECT * FROM users WHERE email=?', email,
        function(err, row){
            if(err || row == undefined){
                res.json({Error: 'Usuario inexistente en la base de datos'});
            }
            else{
                db.get(
                    'DELETE FROM users WHERE email=?', email,
                    function(err){
                        if(err == true){
                            res.json({Error: 'Error al eliminar usuario'});
                        }
                        else{
                            res.json({Bien: 'Usuario eliminado'});
                        }
                    }
                )
            }
        }
)};

router.delete('/api/categorias', function(req, res){
    if(req.session.role != 'admin'){
        res.json({Error: 'No puede crear, eliminar o modificar categorias'});
    }
    else{
        eliminarCategorias(req, res, db);
    }
});

function eliminarCategorias(req, res, db){
    var name = req.body.name;
    db.get('DELETE FROM categorias WHERE name=?', name,
        function(err){
            if(err){
                res.json({Error: 'Error al eliminar categoría'});
            }
            else{
                res.json({Bien: 'Categoría eliminada'});
            }
        }
)};

router.delete('/api/videos', function(req, res){
    if(req.session.role != 'admin'){
        res.json({Error: 'No puede crear, eliminar o modificar vídeos'});
    }
    else{
        eliminarVideos(req, res, db);
    }
});

function eliminarVideos(req, res, db){
    var name = req.body.name;
    db.get('DELETE FROM videos WHERE name=?', name,
        function(err){
            if(err){
                res.json({Error: 'Error al eliminar vídeo'});
            }
            else{
                res.json({Bien: 'Vídeo eliminado'});
            }
        }
)};

server.use(express.static('.'));
server.use(router);

server.listen(port, function(){
    console.log(`Servidor corriendo por el puerto ${port}`);
});



