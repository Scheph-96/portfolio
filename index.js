const express = require('express');
const http = require("http");
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);

const app = require('./app.js');
const path = require('path');
const appConfig = require('./dependencies.js');


const server = http.createServer(app);
const PORT = appConfig.port;



// Mongo db connection
mongoose.connect(appConfig.dbUri, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', (error) => console.log(`DB CONNEXION ERROR::${error}`));
db.once('open', () => console.log('Connected to database'));

// app.use(function (req, res, next) {
//     res.setHeader(
//         'Content-Security-Policy',
//         "default-src 'https'; font-src 'self'; img-src 'self'; style-src 'self'; frame-src 'self'; script-src 'unsafe-eval'"
//     );
//     next();
// });

// Enable CORS for all routes
app.use(cors());

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// session attributes
let sess = {
    cookie: { maxAge: 3600000 },
    store: new MemoryStore({
        checkPeriod: 3600000
    }),
    resave: false,
    saveUninitialized: true,
    secret: 'MY SECRET',
}

// check environment    
if (app.get('env') === 'production') {
    sess.cookie.secure = true;
}

// enable session storage
app.use(session(sess));

// set local variables
// app.use((req, res, next) => {
//     res.locals.message = req.session.message;
//     delete req.session.message;
//     // console.log('\nRES LOCALS TOP:', res.locals);
//     // console.log('\nRES LOCALS MESSAGE TOP:', res.locals.message,'\n');
//     next();
// });


// set template engine
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

// set public directory
app.use(express.static(path.join(__dirname, "public"), { index: false }));
app.use(express.static('uploads'));

// app.use((req, res, next) => {
//     let hostname = req.headers.host;
//     let options = domainMap[hostname];
//     console.log('HOSTNAME: ', hostname);
//     console.log('OPTIONS: ', options);

//     if (options && options.publicDir) {
//         let middleware = express.static(path.join(__dirname), 'public', options.publicDir);
//         middleware(req, res, next);
//     } else {
//         next();
//     }
// })

// Web work static files
// app.use('/experience', express.static(path.join(__dirname, '/web-work')));

// Debugging middleware to log request URLs
app.use((req, res, next) => {
    console.log('Requested URL:', req.url);
    next();
});


app.use((err, req, res, next) => {
    console.log('do');
    console.error('MID ERR: ', err.stack);
    console.log('re');
    // req.session.message = {
    //     info: {
    //         type: 'danger',
    //         message: 'Unexpected error. Please try again!',
    //     }
    // };
    console.log('mi');
    // console.log('\nREQ SESSION:', req.session);
    // console.log('\nRES LOCALS:', res.locals);
    // console.log('\nRES LOCALS MESSAGE:', res.locals.message,'\n');
    console.log('mi 2');
    res.status(520).send({
        type: 'danger',
        message: 'Unexpected error. Please try again!',
    });
    // res.status(204).send();
    // res.redirect('back');
    console.log('fa');
    // res.locals.message = null;
    console.log('sol');
    // console.log('\nREQ SESSION:', req.session);
    // console.log('\nRES LOCALS:', res.locals);
    // console.log('\nRES LOCALS MESSAGE:', res.locals.message,'\n');
    console.log('la');
});

// app.use((err, req, res, next) => {
//     console.error(err.stack);

//     if (!Object.keys(req.body).length) {
//         req.session.message = {
//             type: 'danger',
//             message: 'Bad Request',
//         }
//         res.redirect('/');
//         res.locals.message = null;
//     }
// });



server.listen(PORT, () => {
    console.log(`Server started at ${appConfig.host}:${appConfig.port}`);
});

