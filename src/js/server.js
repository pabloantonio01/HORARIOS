'use strict';

/* Se genera el servidor */
const express = require('express');
const server = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const sqlite3 = require('better-sqlite3');
const port = process.env.PORT || 3000;
const cors = require('cors');
server.use(cors());
const router = express.Router();
var username = null;

/* Configuración del servidor*/
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

// var db = new sqlite3.Database(
//     'datos.db',
//     function(err){
//         if (err) // Si ha ocurrido un error
//             console.log(err);
//     }       
// );

const db = new sqlite3('datos.db');


server.get('/', function(req, res) {
    res.send('Hola Mundo!');
  });



router.post('/api/horario', verifyToken, function(req, res) {
    console.log('Realizando');
    console.log('El resultado: ');

    jwt.verify(req.token, 'secretKey', (error, authData) => {

        console.log('Hasta aqui');
        if (error) {
            return res.sendStatus(403);  // Cambié a `return` para evitar continuar la ejecución.
        } 
        
        else {

            req.user = authData.username; 
            console.log(req.user); 

            console.log('Llegue aqui');
            // Validar que aula y hora estén presentes en la petición
            if (req.body.aula === undefined || req.body.hora === undefined) {
                return res.json({ Error: 'Petición mal formada' });
            } else {
                // Comprobar si el usuario ya está en la tabla horarios
                db.get(
                    'SELECT * FROM horarios WHERE usuario = ?',
                    [req.user],  // Asumiendo que req.user contiene el nombre del usuario
                    function(err, row) {
                        if (err) {
                            console.error('Error al consultar la base de datos:', err);
                            return res.status(500).json({ error: 'Error en el servidor' });
                        }
            

                        
                        if (row) {
                            // Si se encontró una fila, realizamos la segunda consulta para verificar el tipo de usuario
                            db.get(
                                'SELECT tipo FROM users WHERE nombre_usuario = ?', 
                                [req.user], 
                                function(err, userRow) {
                                    if (err) {
                                        console.error('Error al consultar el tipo de usuario:', err);
                                        return res.status(500).json({ error: 'Error en el servidor' });
                                    }
                        
                                    // Comprobamos si el tipo es 'admin'
                                    if (userRow && userRow.tipo === 'admin') {
                                        // Si el usuario es administrador, permitimos registrar la hora
                                        console.log('Es administrador, permitiendo el registro de hora');
                                        processHour(req, res, db);
                                    } else {
                                        // Si no es administrador, enviamos el mensaje de error
                                        return res.json({ error: 'Error: ya está guardado' });
                                    }
                                }
                            );
                        } else {
                            // Si el usuario no está en la tabla horarios, llamamos a processHour directamente
                            console.log(row);
                            console.log(req);
                            processHour(req, res, db);
                        }
                        
                        

                    }
                );
            }
            
        }
    });
});


function processHour(req, res, db) {
    // Supongamos que guardas la hora y aula en la base de datos
    const usuario= req.user; 
    const aula = req.body.aula;
    const hora = req.body.hora;
    db.get('INSERT INTO horarios (aula, hora, usuario) VALUES (?, ?, ?)', aula, hora, usuario, (error, results) => {
        if (error) {
            console.error('Error al insertar en la base de datos:', error);
            return res.status(500).json({ Error: 'Error en el servidor' });
        }

        // Responde con éxito
        res.json({ success: true, message: 'Hora registrada', data: { aula, hora, usuario } });
    });
}


router.get('/api/know/horario', verifyToken,function(req, res){
    jwt.verify(req.token, 'secretKey', (error, authData) => {
        if(error){
            res.sendStatus(403);
        }
        else{
            listarHorario(req, res, db);
        }
    })
});

function listarHorario(req, res, db){
    db.all(
        'SELECT aula, hora FROM horarios',
        function(err, rows){
            var data = rows;
            res.json(data);
        }
    )
};





router.get('/api/know/horario/completo', verifyToken, function(req, res) {
    jwt.verify(req.token, 'secretKey', (error, authData) => {
        if (error) {
            return res.sendStatus(403);
        } else {
            req.user = authData.username; // Guardar el nombre de usuario
            
            // Comprobación de tipo de usuario
            db.get(
                'SELECT tipo FROM users WHERE nombre_usuario = ?', 
                [req.user], 
                function(err, userRow) {
                    if (err) {
                        console.error('Error al consultar el tipo de usuario:', err);
                        return res.status(500).json({ error: 'Error en el servidor' });
                    }

                    // Comprobamos si el tipo es 'admin'
                    if (userRow.tipo === 'admin') {
                        // Si el usuario es admin, llamamos a listarHorarioCompleto
                        listarHorarioCompleto(req, res, db);
                    } else {
                        // Si no es admin, devolvemos un error o restringimos el acceso
                        res.status(403).json({ error: 'No tienes permisos para ver esta información' });
                    }
                }
            );
        }
    });
});


function listarHorarioCompleto(req, res, db){
    db.all(
        'SELECT aula, hora, usuario FROM horarios',
        function(err, rows){
            var data = rows;
            res.json(data);
        }
    )
};



router.get('/api/know/horariotuyo', verifyToken,function(req, res){
    jwt.verify(req.token, 'secretKey', (error, authData) => {

        req.user = authData.username;
        if(error){
            res.sendStatus(403);
        }
        else{
            listarHorariotuyo(req, res, db);
        }
    })
});

function listarHorariotuyo(req, res, db) {
    // Asegúrate de que req.user tenga el valor correcto
    db.all(
        'SELECT aula, hora FROM horarios WHERE usuario = ?',
        [req.user], // Aquí filtramos por el usuario
        function(err, rows) {
            if (err) {
                console.error('Error al consultar la base de datos:', err);
                return res.status(500).json({ error: 'Error en el servidor' });
            }

            var data = rows;
            res.json(data);
        }
    );
}



router.delete('/api/know/horario/borrar', verifyToken, function(req, res) {
    jwt.verify(req.token, 'secretKey', (error, authData) => {
        req.user = authData.username;
        if (error) {
            return res.sendStatus(403);
        } else {
            borrarHorario(req, res, db);
        }
    });
});

function borrarHorario(req, res, db) {
    db.run(
        'DELETE FROM horarios WHERE usuario = ?',
        [req.user], // Filtrar por el usuario
        function(err) {
            if (err) {
                console.error('Error al borrar de la base de datos:', err);
                return res.status(500).json({ error: 'Error en el servidor' });
            }

            // Si no hay errores, enviar un mensaje de éxito
            res.json({ message: 'Horario borrado correctamente' });
        }
    );
}











/* Configurar rutas y funciones necesarias del API REST*/
router.post('/api/auth/login', function(req, res){
    console.log('Realizando registro');
    console.log(req);
    if(req.body.email==undefined || req.body.password==undefined){
        res.json({Error: 'Petición mal formada'});
    }
    else{
        res = processLogin(req, res, db);
    }
});

function processLogin(req, res, db) {
    var email = req.body.email;
    var password = req.body.password;
    console.log(email);
    console.log(password);

    db.get('SELECT * FROM users WHERE correo = ?', [email], function(err, row) {
        if (err) {
            console.error('Error al consultar la base de datos:', err);
            return res.status(500).json({ Error: 'Error en el servidor' });
        }

        if (!row) {
            return res.json({ Error: 'Usuario no existe' });
        } else if (row.contraseña !== password) {
            return res.json({ Error: 'Contraseña mal introducida' });
        } else {
            const username = row.nombre_usuario;
            console.log(username);

            jwt.sign({ username }, 'secretKey', { expiresIn: '2h' }, (err, token) => {
                if (err) {
                    console.error('Error al generar el token:', err);
                    return res.status(500).json({ Error: 'Error al generar el token' });
                }

                var data = {
                    email: row.correo,
                    username: row.nombre_usuario,
                    role: row.tipo,
                    secret_token: token // Corregido: usar "token", no "tokens"
                };
                console.log('Login correcto');
                res.json(data);
            });
        }
    });
};




//Autorización necesaria para el token
function verifyToken(req, res, next){
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined'){
        const bearerToken = bearerHeader.split(" ")[1];
        req.token = bearerToken;
        next();
    }
    else{
        res.sendStatus(403);
    }
}

server.use(express.static('.'));
server.use(router);

server.listen(port, function(){
    console.log(`Servidor corriendo por el puerto ${port}`);
});



