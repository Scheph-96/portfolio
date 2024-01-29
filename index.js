// Build-in requirement
const express = require('express');
const http = require("http");
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const util = require('util');

// Custom requirement
const app = require('./app.js');
const path = require('path');
const appConfig = require('./dependencies.js');
const { ErrorLogger } = require('./tools/util.tool.js');


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
//   });

app.use((err, req, res, next) => {
    ErrorLogger.error(err.message, { ip: req.ip, url: req.url, method: req.method, stacktrace: util.inspect(err, { showHidden: false, depth: null, colors: true }) });
    return res.render('portfolio-pages/error');
});


// set template engine
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

// set public directory
app.use(express.static(path.join(__dirname, "public"), { index: false }));
app.use(express.static('uploads'));

// app.use((req, res, next) => {
//     // Log IP and URL for each request
//     req.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
//     console.log("THA IP: ", req.ip);
  
//     next();



server.listen(PORT, () => {
    console.log(`Server started at ${appConfig.host}:${appConfig.port}`);
});

