const express = require('express');
const Order = require('../models/order');
const util = require('util');

const router = express.Router();


router.get('/', (req, res) => {
    res.render('portfolio-index');
});

router.get('/admin-dashboard', (req, res) => {
    res.render('dashboard-index');
});

// Services page route
router.get('/page/order/:service', (req, res) => {
    let service = req.params.service;
    res.render('portfolio-pages/order', { 'service': service });
});

function validate(req, res, next) {

}

// Orders route
router.post('/submit-order', (req, res) => {
    console.log(req.body);
    if (req.body.constructor === Object && Object.keys(req.body).length !== 0) {
        const order = new Order(req.body);
        // try {

        if (req.file) {
            console.log('There is a file');
        } else {
            console.log('No File');
        }

            error = order.validateSync();
            // res.status(200).send(assert.equal(error.errors['email'].message, 'skfc is not a valid email'));

            // console.log(`\n${util.inspect(error, { showHidden: false, depth: null, colors: true })}\n`);

            // console.log(error.errors['description'].message);
        if (error) {
            console.log(error.errors[`${Object.keys(error.errors)[0]}`].message);
            
        res.send(error.errors[`${Object.keys(error.errors)[0]}`].message);
        }

        res.send();

        // } catch (err) {
        //     console.log(err);
        // }

        // order.save()
        //     .then((data) => {
        //         req.session.message = {
        //             type: 'success',
        //             message: 'Order send successfully. Please check your emails!',
        //         }
        //         res.redirect('/');
        //     })
        //     .catch((error) => {

        //     });
    } else {
        res.status(400).send('Bad Request');
    }
});


module.exports = router;