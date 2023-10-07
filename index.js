const express = require('express');
// const mongoose = require('mongoose');
const path = require('path');

require('dotenv').config();


const app = express();
const PORT = process.env.PORT


// set template engine
app.set('view engine', 'ejs');

// set public directory
app.use(express.static(path.join(__dirname, "public")));

// set routes
app.use('', require(path.join(__dirname, "routes/routes")));


app.listen(PORT, () => {
    console.log(`Server started at http:127.0.0.1:${PORT}`);
});