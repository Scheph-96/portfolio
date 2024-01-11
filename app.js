// Build-in requirement
const express = require('express');
const util = require('util');
const fs = require('fs');
const ejs = require('ejs');
const formidable = require('formidable');
const path = require('path');
const luxon = require('luxon');

// Custom requirement
const Order = require('./models/order');
const TempLink = require("./models/temp_link.js");
const FileUploadError = require('./errors/file_upload.error.js');
const ExperienceRessourceType = require('./models/experience_ressource_type');
const ServiceCrud = require('./model_crud/service.crud');
const OrderCrud = require('./model_crud/order.crud');
const ExperienceCrud = require('./model_crud/experience.crud.js');
const RecommendationCrud = require('./model_crud/recommendation_crud.js');
const appConfig = require('./dependencies.js');


// Multiple import
const { formidableFormParser, generateUUID_V4, getFileExtension, writeOnDisk } = require('./tools/util.tool.js');
const { Recommendation } = require('./models/recommendation');


const app = express();

let serviceCrud = new ServiceCrud();
let orderCrud = new OrderCrud();
let experienceCrud = new ExperienceCrud();
let recommendationCrud = new RecommendationCrud();



app.get('/unknown-route', (req, res) => {
    res.render('notfound');
});

app.get('/home', (req, res) => {
    Promise.all([serviceCrud.readAll(), experienceCrud.readAllFavoriteByType(ExperienceRessourceType.enum().web), recommendationCrud.readAllFavoriteWithPic()])
        .then((results) => {
            res.render('portfolio-pages/home', { services: results[0], experienceFavorite: { ressources: results[1], type: ExperienceRessourceType.enum().web }, recommendationFavorite: results[2] });
        })
        .catch((error) => {
            console.log(`\n${util.inspect(error, { showHidden: false, depth: null, colors: true })}\n`);

            return res.status(520).send({
                type: 'danger',
                message: 'Unexpected error. Please try again!',
            });
        });
});

app.get('/load-order/:service', (req, res) => {
    res.render('portfolio-pages/order', { service: req.params.service });
});

// app.get('/load-order-success/order-success', (req, res) => {
//     res.render('portfolio-pages/order-success');
// });

// Orders route
app.post('/submit-order', (req, res) => {

    const form = new formidable.IncomingForm({ allowEmptyFiles: true, minFileSize: 0 });

    form.parse(req, async (formidableErr, fields, files) => {

        if (formidableErr) {
            return res.status(520).send({
                type: 'danger',
                message: 'Unexpected error. Please try again!',
            });
        }

        let order = new Order(formidableFormParser(fields));

        // Check if there is afile
        if (files.specifications.length !== 0 && files.specifications[0].originalFilename !== "" && files.specifications[0].size !== 0) {
            // there is a file
            order.specifications = true;
        } else {
            // there is no file
            order.specifications = false;
        }

        order.description = order.description.trim();

        let modelError = order.validateSync();

        if (modelError) {

            /**
             * modelError = ValidationError: description: Description is required
             * 
             * modelError.errors = {
             *                   properties: {
             *                       validator: [Function (anonymous)],
             *                       message: 'Description is required',
             *                       type: 'required',
             *                       path: 'description',
             *                       value: undefined
             *                   },
             *                   kind: 'required',
             *                   path: 'description',
             *                   value: undefined,
             *                   reason: undefined,
             *                   [Symbol(mongoose:validatorError)]: true
             *               }
             * 
             * To get the error message we have to do: modelError.errors['description'].message
             * 
             * We get the keys: Object.keys(modelError.errors) = ['description']
             * 
             * And: Object.keys(modelError.errors)[0] = 'description'
             * 
             * Finally: modelError.errors[`${Object.keys(modelError.errors)[0]}`].message = 'Description is required'
             *
            */

            console.log(`\n${util.inspect(modelError.errors[`${Object.keys(modelError.errors)[0]}`], { showHidden: false, depth: null, colors: true })}\n`);
            return res.status(449).send({
                type: 'danger',
                message: modelError.errors[`${Object.keys(modelError.errors)[0]}`].message
            });
        }

        // Check if the service exist
        serviceCrud.read({ value: order.service })
            .then(async (service) => {
                if (!service) {
                    return res.status(422).send({
                        type: 'danger',
                        message: 'Unprocessable entity',
                    });
                } else {

                    // Write the file on tge disk is there is one
                    if (order.specifications) {
                        try {
                            let attr = await writeOnDisk('specs', files, order._id, order.constructor.collection.name);
                        } catch (error) {
                            console.log(`\n${util.inspect(error, { showHidden: false, depth: null, colors: true })}\n`);

                            if (error.name === 'FileUploadError') {
                                return res.status(449).send({
                                    type: 'danger',
                                    message: error.message,
                                });
                            }
                            return res.status(520).send({
                                type: 'danger',
                                message: 'Unexpected error. Please try again!',
                            });

                        }
                    }

                    // Create the order
                    orderCrud.create(order)
                        .then((dbOrder) => {
                            ejs.renderFile(__dirname + '/views/portfolio-pages/order-success.ejs', dbOrder, (err, html) => {
                                if (err) {
                                    console.log(`\n${util.inspect(error, { showHidden: false, depth: null, colors: true })}\n`);
                                    return res.status(520).send({
                                        type: 'danger',
                                        message: 'Unexpected error. Please try again!',
                                    });
                                }

                                return res.status(201).send({
                                    type: 'success',
                                    message: 'Order send successfully',
                                    page: html,
                                });
                            });

                        })
                        .catch((error) => {
                            console.log(`\n${util.inspect(error, { showHidden: false, depth: null, colors: true })}\n`);
                            res.status(520).send({
                                type: 'danger',
                                message: 'Unexpected error. Please try again!',
                            });
                        });
                }
            })
            .catch((error) => {
                console.log(`\n${util.inspect(error, { showHidden: false, depth: null, colors: true })}\n`);
                return res.status(520).send({
                    type: 'danger',
                    message: 'Unexpected error. Please try again!',
                });

            });
    });
});

/* 
 * Experiences route
 * This endpoint return all work fo experience favprite by type
 * on the work menu with web uidesign poster and logo when the
 * user click on each menu item endpoint return the needed
 * ressources. I use to load all the favorites at the same time
 * causing a performance issue but now the idea is to load
 * the ressource only when it's needed
 * 
*/
app.get('/experience/favorite/ressource/:type', async (req, res) => {
    try {
        let results;
        switch (req.params.type) {
            case ExperienceRessourceType.enum().web:
                results = await experienceCrud.readAllFavoriteByType(ExperienceRessourceType.enum().web);
                res.render('portfolio-pages/works-body', { experienceFavorite: { ressources: results, type: ExperienceRessourceType.enum().web } });

                break;

            case ExperienceRessourceType.enum().ui_design:
                results = await experienceCrud.readAllFavoriteByType(ExperienceRessourceType.enum().ui_design);
                res.render('portfolio-pages/works-body', { experienceFavorite: { ressources: results, type: ExperienceRessourceType.enum().ui_design } });

                break;

            case ExperienceRessourceType.enum().poster:
                results = await experienceCrud.readAllFavoriteByType(ExperienceRessourceType.enum().poster);
                res.render('portfolio-pages/works-body', { experienceFavorite: { ressources: results, type: ExperienceRessourceType.enum().poster } });

                break;

            case ExperienceRessourceType.enum().logo:
                results = await experienceCrud.readAllFavoriteByType(ExperienceRessourceType.enum().logo);
                res.render('portfolio-pages/works-body', { experienceFavorite: { ressources: results, type: ExperienceRessourceType.enum().logo } });

                break;

            default:
                res.render('notfound');
                break;
        }
    } catch (error) {
        console.log(`\n${util.inspect(error, { showHidden: false, depth: null, colors: true })}\n`);

        return res.status(520).send({
            type: 'danger',
            message: 'Unexpected error. Please try again!',
        });

    }
});

// Experiences route
app.get('/experience/ressource/:type', async (req, res) => {
    try {
        let results;
        switch (req.params.type) {
            case ExperienceRessourceType.enum().web:
                results = await experienceCrud.readAllByType(ExperienceRessourceType.enum().web);
                res.render('portfolio-pages/more-experience', { experiences: { ressources: results, type: ExperienceRessourceType.enum().web } });
                break;

            case ExperienceRessourceType.enum().ui_design:
                results = await experienceCrud.readAllByType(ExperienceRessourceType.enum().ui_design);
                res.render('portfolio-pages/more-experience', { experiences: { ressources: results, type: "ui design" } });
                break;

            case ExperienceRessourceType.enum().poster:
                results = await experienceCrud.readAllByType(ExperienceRessourceType.enum().poster);
                res.render('portfolio-pages/more-experience', { experiences: { ressources: results, type: ExperienceRessourceType.enum().poster } });

                break;

            case ExperienceRessourceType.enum().logo:
                results = await experienceCrud.readAllByType(ExperienceRessourceType.enum().logo);
                res.render('portfolio-pages/more-experience', { experiences: { ressources: results, type: ExperienceRessourceType.enum().logo } });

                break;

            default:
                res.render('notfound');
                break;
        }
    } catch (error) {
        console.log('ERROR CATCHED!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        console.log(error);
        res.status(520).send({
            type: 'danger',
            message: 'Unexpected error. Please try again!',
        });
    }
});

// Recommendationns route
app.get('/customers/recommendations/:rate?', (req, res) => {
    try {
        if (!req.params.rate) {
            console.log("NO PARAM");
            recommendationCrud.readAllWithPic()
                .then((result) => {
                    res.render('portfolio-pages/more-recommendation', { recommendations: result });
                })
                .catch((error) => {
                    console.log(`\n${util.inspect(error, { showHidden: false, depth: null, colors: true })}\n`);

                    return res.status(520).send({
                        type: 'danger',
                        message: 'Unexpected error. Please try again!',
                    });
                });
        } else {
            if (req.params.rate === "all") {
                console.log("ALL RESSOURCE");
                recommendationCrud.readAllWithPic()
                    .then((result) => {
                        res.render('portfolio-pages/more-recommendation-body', { recommendations: result });
                    })
                    .catch((error) => {
                        console.log(`\n${util.inspect(error, { showHidden: false, depth: null, colors: true })}\n`);

                        return res.status(520).send({
                            type: 'danger',
                            message: 'Unexpected error. Please try again!',
                        });
                    });
            } else {
                console.log("THE PARAM: ", req.params.rate);
                let rate = parseInt(req.params.rate);
                // Convert the param to number
                recommendationCrud.readAllByRateWithPic(rate)
                    .then((result) => {
                        res.render('portfolio-pages/more-recommendation-body', { recommendations: result });
                    })
                    .catch((error) => {
                        console.log(`\n${util.inspect(error, { showHidden: false, depth: null, colors: true })}\n`);

                        return res.status(520).send({
                            type: 'danger',
                            message: 'Unexpected error. Please try again!',
                        });
                    });
            }
        }
    } catch (error) {
        console.log(`\n${util.inspect(error, { showHidden: false, depth: null, colors: true })}\n`);

        return res.status(520).send({
            type: 'danger',
            message: 'Unexpected error. Please try again!',
        });
    }
});

// Generate link
app.get('/gen/review/link', async (req, res) => {
    try {
        let tempLink = new TempLink({ token: generateUUID_V4() });

        await tempLink.save();

        res.status(201).json({ type: "success", message: `127.0.0.1:${appConfig.port}/review/${tempLink.token}` });

    } catch (error) {
        console.log(`\n${util.inspect(error, { showHidden: false, depth: null, colors: true })}\n`);

        return res.status(520).send({
            type: 'danger',
            message: 'Unexpected error. Please try again!',
        });
    }

});

// Send review route
app.get('/user/send/review/:token', async (req, res) => {
    try {
        let token = req.params.token;
        console.log("THE TOKEN: ", token);
        let result = await TempLink.findOne({ token: token }).exec();
        console.log("THE TOKEN FIND RESULT: ", result);

        if (result) {
            console.log('VALID LINK');
            res.render('portfolio-pages/send-review');
            // res.render('portfolio-pages/layout', { skeleton: "send-review" });
        } else {
            console.log('INVALID LINK');
            res.render('notfound');
            // res.render('portfolio-pages/layout', { skeleton: "../notfound" });
        }
        console.log("END REVIEW");
    } catch (error) {
        console.log(`\n${util.inspect(error, { showHidden: false, depth: null, colors: true })}\n`);

        return res.status(520).send({
            type: 'danger',
            message: 'Unexpected error. Please try again!',
        });
    }
});

// Handle review upload
app.post('/user/review/post/:token', (req, res) => {
    try {

        TempLink.findOne({ token: req.params.token })
            .then((tempLink) => {
                console.log("FOUND TEMP LINK: ", tempLink);
                if (tempLink) {
                    const form = new formidable.IncomingForm({ allowEmptyFiles: true, minFileSize: 0 });
            
                    form.parse(req, async (formidableErr, fields, files) => {
                        if (formidableErr) {
                            console.log(`\n${util.inspect(formidableErr, { showHidden: false, depth: null, colors: true })}\n`);
            
                            return res.status(520).send({
                                type: 'danger',
                                message: 'Unexpected error. Please try again!',
                            });
                        }
            
                        let recommendation = new Recommendation(formidableFormParser(fields));
            
                        if (recommendation.rate === 0) {
                            return res.status(422).send({
                                type: 'warning',
                                message: 'Please provide a rate',
                            });
                        }

                        let validationError = recommendation.validateSync();
            
                        if (validationError) {
                            console.log(`\n${util.inspect(validationError.errors[`${Object.keys(validationError.errors)[0]}`], { showHidden: false, depth: null, colors: true })}\n`);
            
                            return res.status(422).send({
                                type: 'danger',
                                message: 'Unprocessable entity',
                            });
                        };

            
                        let result;
            
                        if (files.pic.length !== 0 && files.pic[0].originalFilename !== "" && files.pic[0].size !== 0) {
                            //  There is a file
                            try {
                                result = await writeOnDisk('recommendations_pic', files, recommendation._id, recommendation.constructor.collection.name);
                                recommendation.pic.path = result.path;
                                recommendation.pic.extension = result.extension;
                            } catch (error) {
            
                                console.log(`\n${util.inspect(error, { showHidden: false, depth: null, colors: true })}\n`);
            
                                return res.status(520).send({
                                    type: 'danger',
                                    message: error.message,
                                });
            
                            }
                        }
            
                        recommendationCrud.create(recommendation)
                            .then((dbRecommendation) => {
                                recommendationCrud.readWithPic(dbRecommendation._id)
                                    .then((recommendation) => {
                                        ejs.renderFile(__dirname + '/views/portfolio-pages/review-success.ejs', {recommendation: recommendation}, (err, html) => {
                                            if (err) {
                                                console.log(`\n${util.inspect(err, { showHidden: false, depth: null, colors: true })}\n`);
                            
                                                return res.status(520).send({
                                                    type: 'danger',
                                                    message: 'Unexpected error. Please try again!',
                                                });
                                            }
                                            console.log("REVIEW CREATED");
                                            res.status(201).send({
                                                type: "success",
                                                message: "Review submitted successfully",
                                                page: html
                                            });
                                        });
                                    })
                                    .catch((error) => {
            
                                        console.log(`\n${util.inspect(error, { showHidden: false, depth: null, colors: true })}\n`);
                    
                                        return res.status(520).send({
                                            type: 'danger',
                                            message: 'Unexpected error. Please try again!',
                                        });

                                    })
            
                            }).catch((error) => {
            
                                console.log(`\n${util.inspect(error, { showHidden: false, depth: null, colors: true })}\n`);
            
                                return res.status(520).send({
                                    type: 'danger',
                                    message: 'Unexpected error. Please try again!',
                                });
                            });
            
                    });
                } else {
                    ejs.renderFile(__dirname + '/views/notfound.ejs', (err, html) => {
                        if (err) {
                            return res.status(520).send({
                                type: 'danger',
                                message: 'Unexpected error. Please try again!',
                            });
                        }

                        return res.status(404).send({
                            type: 'danger',
                            message: 'The link has expired!',
                            page: html,
                        });
                    });
                }
            })
            .catch((error) => {

                console.log(`\n${util.inspect(error, { showHidden: false, depth: null, colors: true })}\n`);

                return res.status(520).send({
                    type: 'danger',
                    message: 'Unexpected error. Please try again!',
                });
            });

    } catch (error) {

        console.log(`\n${util.inspect(error, { showHidden: false, depth: null, colors: true })}\n`);

        return res.status(520).send({
            type: 'danger',
            message: 'Unexpected error. Please try again!',
        });
    }
});

// app.get('/user/review-success', (req, res) => {
//     res.render('portfolio-pages/review-success');

// })

app.get(/^(?!\/(style|js|assets|fonts|experience)).*$/, (req, res) => {
    // res.set('Content-Type', 'application/javascript');

    // res.setHeader(
    //     'Content-Security-Policy',
    //     "script-src 'http://127.0.0.1:3400/js/portfolio-js/main.js https://assets2.lottiefiles.com/private_files/lf30_kecMeI.json https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js'"
    // );
    console.log('REQ URL: ', req.url);
    let skeleton;

    if (req.url === "/") {
        skeleton = "skeletons/home.skeleton.ejs";
    } else if (req.url.includes("/order/")) {
        skeleton = 'skeletons/order.skeleton.ejs';
    } else if (req.url.includes("/works/")) {
        skeleton = 'skeletons/more-experience.skeleton.ejs';
    } else if (req.url === "/recommendations") {
        skeleton = 'skeletons/more-recommendation.skeleton.ejs';
    }

    res.render('portfolio-pages/layout', { skeleton: skeleton });
    // res.render('portfolio-pages/layout');
    // }
});


module.exports = app;

// Lorem ipsum dolor sit amet