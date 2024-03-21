const express = require('express');
const session = require('express-session'); // En la configuración de express-session, el campo secret se utiliza para firmar la cookie de sesión y protegerla contra manipulaciones. Debes proporcionar una cadena única y segura como valor para este campo.
const passport = require('passport');
const multer = require('multer'); //Agregado para FireBase

const app = express();
const http = require('http');
const server = http.createServer(app);
const logger = require('morgan');
const cors = require('cors');

/**
 * Importar rutas
 */
const usersRoutes = require('./routes/userRoutes');

const port = process.env.PORT || 3000;

app.use(logger('dev'));  // log requests to the console DEBUG
app.use(express.json()); // support json encoded bodies
app.use(express.urlencoded({ 
    extended: true 
})); // support encoded bodies
app.use(cors());

// Configura express-session
app.use(session({
    secret: '3e1acd58068f2ba18699adc43e83808f5cb035aeca98386ec20cf1f304aba6b6',
    resave: false,
    saveUninitialized: false
  }));

// Configura Passport después de express-session
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.disable('x-powered-by'); // disable the X-Powered-By header in responses

app.set('port', port);

//Agregado para FireBase
const upload = multer({
    storage: multer.memoryStorage()
});

/**
 * Llamar a las rutas
 */
usersRoutes(app, upload);


/* Iniciar el servidor
*/
server.listen(port, '192.168.1.5' || 'localhost', function() {
    console.log('App Node.js ' + process.pid + ' ejecutando en ' + server.address().address + ':' + server.address().port);
});

/** RUTAS ***********************************************/
app.get('/', (req, res) => {
    res.send('Estas en la ruta raiz del backend.');
});

app.get('/test', (req, res) => {
    res.send('Estas en la ruta TEST');
});

//Manejo de errores ******************************************
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).send(err.stack);
});


//en package.json se cambio "passport": "^0.7.0", a "passport": "^0.4.1",