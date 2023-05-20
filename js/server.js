'use strict';
// Cargamos el modulo de Express
const express = require('express');
// Creamos un objeto servidor HTTP
const server = express();
// Definimos el puerto a usar por el servidor HTTP
const port = 8080;
// Configuramos la ruta / en el servidor HTTP para que devuelva un saludo
server.get('/', (req, res) => {
res.send('Hello World!')
});
// Poner en marcha el servidor
server.listen(port, () => {
console.log(`Servidor corriendo en el puerto ${port}`);
});

// Cargamos el modulo
const session = require('express-session');
// Creamos el objeto con la configuración
var sesscfg = {
secret: 'inventa una buena contraseña aqui',
resave: true,
saveUninitialized: true,
cookie: {
secure: true,
sameSite: true,
maxAge: 8*60*60*1000 // 8 working hours
}
};
// Se le dice al servidor que use el modulo de sesiones con esa configuracion
server.use(session(sesscfg));
// Poner en marcha el servidor ...

// Obtener la referencia al módulo 'body-parser'
const bodyParser = require('body-parser');
// Configuring express to use body-parser as middle-ware.
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
// Poner en marcha el servidor

// Obtener el configurador de rutas
const router = express.Router();
// Configurar la accion asociada al login
router.post('/login', function(req, res) {
// Comprobar si la petición contiene los campos ('user' y 'passwd')
if (!req.body.user || !req.body.passwd) {
res.json({ errormsg: 'Peticion mal formada'});
return;
}
// La petición está bien formada -> procesarla
// TODO: procesar la peticón
processLogin(req, res);
});
// Configurar la accion asociada al listado de correos
router.get('/list', function (req, res) {
//TODO: verificar los parametros de la peticion
if (verificarParametrosListar(req)) {
// TODO: procesar la petición
processListar(req, res);
return;
}
res.json({ errormsg: 'Peticion mal formada'});
});
// Configurar la accion asociada a la petición del contenido de un correo
router.get('/email/:email_id',function (req, res) {
//TODO: verificar los parametros de la peticion
if (verificarParametrosEmail(req)) {
// TODO: procesar la petición
processEmail(req, res);
return;
}
res.json({ errormsg: 'Peticion mal formada'});
});
// Añadir las rutas al servidor
server.use('/', router);
// Poner en marcha el servidor

// Añadir las rutas estáticas al servidor.
server.use(express.static('.'));
// poner en marcha el servidor

// cargar el módulo para bases de datos SQLite
var sqlite3 = require('sqlite3').verbose();

// Abrir nuestra base de datos
var db = new sqlite3.Database(
    'emails.db', // nombre del fichero de base de datos
    function(err) { // funcion que será invocada con el resultado
    if (err) // Si ha ocurrido un error
    console.log(err); // Mostrarlo por la consola del servidor
    }
);

var login = req.body.user;
var passwd = req.body.passwd;
db.get(
// consulta y parámetros cuyo valor será usado en los '?'
'SELECT * FROM users WHERE login=?', login,
// funcion que se invocará con los datos obtenidos de la base de datos
function(err, row) {
if (row == undefined) {
// La consulta no devuelve ningun dato -> no existe el usuario
res.json({ errormsg: 'El usuario no existe'});
} else if (row.passwd === passwd) {
// La contraseña es correcta
// Asociar el userID a los datos de la sesión
req.session.userID = row.id; // solo el id del usuario registrado
// Preparar los datos a enviar al navegador (AngularJS)
var data = {
id: row.id,
login: row.login,
name: row.name,
email: row.email
};
// enviar en la respuesta serializado en formato JSON
res.json(data);
} else {
// La contraseña no es correcta -> enviar este otro mensaje
res.json({ errormsg: 'Fallo de autenticación'});
}
}
);