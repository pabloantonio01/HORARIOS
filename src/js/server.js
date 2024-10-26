'use strict';

/* Se genera el servidor */
const express = require('express');
const server = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg'); // PostgreSQL
const port = process.env.PORT || 3000;
const cors = require('cors');

server.use(cors());
const router = express.Router();
var username = null;

/* Configuración del servidor */
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

// Configuración de la conexión a la base de datos
const DATABASE_USER = "default";
const DATABASE_HOST = "ep-misty-pine-a2eqdx6d-pooler.eu-central-1.aws.neon.tech";
const DATABASE_PASSWORD = "Dtbd4kjgL5VR";
const DATABASE_DATABASE = "verceldb"; // Nombre de la base de datos
const DATABASE_PORT = 5432;

// Configurar el pool de conexión a PostgreSQL
const pool = new Pool({
    user: DATABASE_USER,
    host: DATABASE_HOST,
    database: DATABASE_DATABASE,
    password: DATABASE_PASSWORD,
    port: DATABASE_PORT,
    ssl: { rejectUnauthorized: false }
});

// Probar la conexión a la base de datos
pool.connect((err) => {
    if (err) {
        console.error('Error al conectar con PostgreSQL:', err.stack);
    } else {
        console.log('Conexión exitosa a PostgreSQL');
    }
});

// Aquí va tu lógica de rutas y demás...




server.get('/', function (req, res) {
  res.send('Hola Mundo!');
});

// Aquí puedes agregar más rutas, reemplazando las consultas de SQLite con PostgreSQL



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
                pool.query(
                    'SELECT * FROM horarios WHERE nombre_usuario = $1',
                    [req.user],  // Asumiendo que req.user contiene el nombre del usuario
                    function(err, row) {
                        if (err) {
                            console.error('Error al consultar la base de datos:', err);
                            return res.status(500).json({ error: 'Error en el servidor' });
                        }
            

                        
                        if (row) {
                            // Si se encontró una fila, realizamos la segunda consulta para verificar el tipo de usuario
                            pool.query(
                                'SELECT tipo FROM users WHERE nombre_usuario = $1', 
                                [req.user], 
                                function(err, userRow) {
                                    if (err) {
                                        console.error('Error al consultar el tipo de usuario:', err);
                                        return res.status(500).json({ error: 'Error en el servidor' });
                                    }
                        
                                    // Comprobamos si el tipo es 'admin'
                                    if (userRow && userRow.rows[0].tipo === 'admin') {
                                        // Si el usuario es administrador, permitimos registrar la hora
                                        console.log('Es administrador, permitiendo el registro de hora');
                                        processHour(req, res, pool);
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
                            processHour(req, res, pool);
                        }
                        
                        

                    }
                );
            }
            
        }
    });
});


function processHour(req, res, pool) {
    const usuario = req.user; 
    const aula = req.body.aula;
    const hora = req.body.hora;

    // Inserta en la base de datos
    pool.query(
        'INSERT INTO horarios (aulas, horario, nombre_usuario) VALUES ($1, $2, $3)',
        [aula, hora, usuario], // Aquí se debe pasar un array con los parámetros
        (error, results) => {
            if (error) {
                console.error('Error al insertar en la base de datos:', error);
                return res.status(500).json({ Error: 'Error en el servidor' });
            }

            // Responde con éxito
            res.json({ success: true, message: 'Hora registrada', data: { aula, hora, usuario } });
        }
    );
}



router.get('/api/know/horario', verifyToken,function(req, res){
    jwt.verify(req.token, 'secretKey', (error, authData) => {
        if(error){
            res.sendStatus(403);
        }
        else{
            listarHorario(req, res, pool);
        }
    })
});

function listarHorario(req, res, pool) {
    pool.query('SELECT aulas, horario FROM horarios', (err, result) => {
        if (err) {
            console.error('Error al consultar la base de datos:', err);
            return res.status(500).json({ error: 'Error al consultar la base de datos' });
        }
        res.json(result.rows); // Asegúrate de enviar result.rows, no solo "rows"
    });
}




router.get('/api/know/horario/completo', verifyToken, function(req, res) {
    jwt.verify(req.token, 'secretKey', (error, authData) => {
        if (error) {
            return res.sendStatus(403);
        } else {
            req.user = authData.username; // Guardar el nombre de usuario
            
            // Comprobación de tipo de usuario
            pool.query(
                'SELECT tipo FROM users WHERE nombre_usuario = $1', 
                [req.user], 
                function(err, userRow) {
                    if (err) {
                        console.error('Error al consultar el tipo de usuario:', err);
                        return res.status(500).json({ error: 'Error en el servidor' });
                    }

                    // Comprobamos si se encontró el usuario
                    if (userRow.rows.length === 0) {
                        return res.status(404).json({ error: 'Usuario no encontrado' });
                    }

                    // Comprobamos si el tipo es 'admin'
                    if (userRow.rows[0].tipo === 'admin') { // Accede a la primera fila
                        // Si el usuario es admin, llamamos a listarHorarioCompleto
                        listarHorarioCompleto(req, res, pool);
                    } else {
                        // Si no es admin, devolvemos un error o restringimos el acceso
                        res.status(403).json({ error: 'No tienes permisos para ver esta información' });
                    }
                }
            );
        }
    });
});



function listarHorarioCompleto(req, res, pool) {
    pool.query('SELECT aulas, horario, nombre_usuario FROM horarios')
        .then(result => {
            res.json(result.rows);
        })
        .catch(err => {
            console.error('Error al consultar la base de datos:', err);
            res.status(500).json({ error: 'Error en el servidor' });
        });
}





router.get('/api/know/horariotuyo', verifyToken,function(req, res){
    jwt.verify(req.token, 'secretKey', (error, authData) => {

        req.user = authData.username;
        if(error){
            res.sendStatus(403);
        }
        else{
            listarHorariotuyo(req, res, pool);
        }
    })
});

function listarHorariotuyo(req, res, pool) {
    pool.query(
        'SELECT aulas, horario FROM horarios WHERE nombre_usuario = $1',
        [req.user]
    ).then(result => {
        res.json(result.rows);
    }).catch(err => {
        console.error('Error al consultar la base de datos:', err);
        res.status(500).json({ error: 'Error en el servidor' });
    });
}




router.delete('/api/know/horario/borrar', verifyToken, function(req, res) {
    jwt.verify(req.token, 'secretKey', (error, authData) => {
        req.user = authData.username;
        if (error) {
            return res.sendStatus(403);
        } else {
            borrarHorario(req, res, pool);
        }
    });
});

function borrarHorario(req, res, pool) {
    pool.query(
        'DELETE FROM horarios WHERE nombre_usuario = $1',
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
    console.log(req.body); // Cambié a req.body para ver el contenido
    if(req.body.email === undefined || req.body.password === undefined){
        return res.json({Error: 'Petición mal formada'});
    }
    processLogin(req, res, pool); // Eliminado el res = porque processLogin ya lo maneja
});

function processLogin(req, res, pool) {
    const email = req.body.email;
    const password = req.body.password;
    console.log(email);
    console.log(password);

    pool.query('SELECT * FROM users WHERE correo = $1', [email], (err, result) => { // Cambié ? por $1
        if (err) {
            console.error('Error al consultar la base de datos:', err);
            return res.status(500).json({ Error: 'Error en el servidor' });
        }

        if (result.rows.length === 0) { // Cambié row por result y verifiqué la longitud
            return res.json({ Error: 'Usuario no existe' });
        } 
        
        const row = result.rows[0]; // Obtengo la primera fila de los resultados
        if (row.contrasena !== password) {
            return res.json({ Error: 'Contraseña mal introducida' });
        } 
        
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
                secret_token: token
            };
            console.log('Login correcto');
            res.json(data);
        });
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

// Iniciar el servidor
server.listen(port, (err) => {
    if (err) {
        console.error(`Error al iniciar el servidor en el puerto ${port}:`, err);
        process.exit(1); // Termina el proceso si hay un error
    }
    console.log(`Servidor escuchando en el puerto ${port}`);
});




