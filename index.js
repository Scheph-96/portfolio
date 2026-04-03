// Build-in requirement
const express = require('express');
const http = require("http");
const mongoose = require('mongoose');
const cors = require('cors');
const util = require('util');
const cookieParser = require("cookie-parser");

// Custom requirement
const app = require('./app-http.js');
const path = require('path');
const { ErrorLogger } = require('./tools/util.tool.js');

require('dotenv').config()


const httpServer = http.createServer(app);
const PORT = process.env.PORT;

// Mongo db connection
mongoose.connect(process.env.DBURI);
const db = mongoose.connection;
db.on('error', (error) => console.log(`DB CONNEXION ERROR::${error}`));
db.once('open', () => {
    console.log('Connected to database');
});

// Enable CORS for all routes
app.use(cors());

// Cookie Parser
app.use(cookieParser());

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// set template engine
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

// set public directory
app.use(express.static(path.join(__dirname, "public"), { index: false }));
app.use(express.static('uploads'));

// EXPRESS ERROR HANDLER
app.use((err, req, res, next) => {
    ErrorLogger.error(err.message, { ip: req.ip, url: req.url, method: req.method, stacktrace: util.inspect(err, { showHidden: false, depth: null, colors: true }) });
    res.render('portfolio-pages/error');
});



httpServer.listen(PORT, () => {
    console.log(`Server started at ${process.env.BASEURL}`);
});


