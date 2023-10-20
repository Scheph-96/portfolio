const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const appConfig = require('./dependencies.js');


const app = express();
const PORT = appConfig.port;


mongoose.connect(appConfig.dbUri, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', (error) => console.log(`DB CONNEXION ERROR::${error}`));
db.once('open', () => console.log('Connected to database'));

// middleware
app.use(express.urlencoded({ extended: false }));
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
app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

// set template engine
app.set('view engine', 'ejs');

// set public directory
app.use(express.static(path.join(__dirname, "public")));

// set routes
app.use('', require(path.join(__dirname, "routes/routes")));



app.listen(PORT, () => {
    console.log(`Server started at ${appConfig.host}:${appConfig.port}`);
});

