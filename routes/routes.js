const express = require('express');
const Order = require('../models/order');
const Service = require('../models/service');
const util = require('util');

const router = express.Router();


router.get('/', (req, res) => {
    Service.find().exec()
        .then((services) => {
            res.render('portfolio-index', {'services': services});
        })
        .catch((error) => {
            console.log(`\n${util.inspect(error, { showHidden: false, depth: null, colors: true })}\n`);
            req.session.message = {
                type: 'danger',
                message: 'Unexpected error. Please try again!',
            }
            // res.status(422)
            // res.redirect('back');
            return
        });
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
    try {
        console.log('THE REQ BODY: ', req.body);
        if (Object.keys(req.body).length) {
            const order = new Order(req.body);

            Service.findOne({ value: order.service }).exec()
                .then((service) => {
                    console.log(`\nSERVICE FOUND: ${service}\n`);
                    if (!service) {
                        req.session.message = {
                            type: 'danger',
                            message: 'Unprocessable entity',
                            order: order,
                        }
                        // res.status(422);
                        res.redirect('back');
                        return
                    } else {
                        if (req.file) {
                            console.log('There is a file');
                            order.specifications = true;
                        } else {
                            order.specifications = false;
                        }
            
                        error = order.validateSync();
                        
                        console.log(1);
                        if (error) {
                            console.log(2);
                            console.log(`THE ERROR::${error}`);
                            req.session.message = {
                                type: 'danger',
                                message: error.errors[`${Object.keys(error.errors)[0]}`].message,
                                order: order,
                            }
            
                            console.log(`THE SERVICE: ${order.service}`);
                            res.redirect('back');
                            return
            
                        }
                        console.log(3);
            
                        order.save()
                            .then((data) => {
                                req.session.message = {
                                    type: 'success',
                                    message: 'Order send successfully. Please check your emails!',
                                }
                                res.redirect('/');
                            })
                            .catch((error) => {
                                console.log(4);
                                console.log('BIG TOP ERROR!!!!!!!!!!!!!!!!');
                                console.log(5);
                                console.log(`\n${util.inspect(error, { showHidden: false, depth: null, colors: true })}\n`);
                                console.log(6);
                                // res.status(520).send('Unexpected error!');
                                req.session.message = {
                                    type: 'danger',
                                    message: 'Unexpected error. Please try again!',
                                }
                                console.log(7);
                                res.redirect('/');
                                console.log(8);
                            });
                    }
                })
                .catch((error) => {
                    console.log('ZE ERROR!!!!!!!!!!!!');
                    console.log(`\n${util.inspect(error, { showHidden: false, depth: null, colors: true })}\n`);
                    req.session.message = {
                        type: 'danger',
                        message: 'Unexpected error. Please try again!',
                        order: order,
                    }
                    // res.status(422)
                    res.redirect('back');
                    return

                });
            // // try {

            
            console.log(9);
        } else {
            // res.status(400).send('Bad Request');
            req.session.message = {
                type: 'danger',
                message: 'Bad Request',
            }
            res.redirect('/');
        }
    } catch (error) {
        console.log('BIG ERROR!!!!!!!!!!!!!!!!');
        console.log(`\n${util.inspect(error, { showHidden: false, depth: null, colors: true })}\n`);
        // res.status(520).send('Unexpected error!');
        req.session.message = {
            type: 'danger',
            message: 'Unexpected error. Please try again!',
        }
        res.redirect('/');
    }
});


module.exports = router;