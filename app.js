// Build-in requirement
const express = require('express');
const util = require('util');
const fs = require('fs');
const ejs = require('ejs');
const formidable = require('formidable');
const path = require('path');

// Custom requirement
const Order = require('./models/order');
const Service = require('./models/service');
const FileUploadError = require('./errors/file_upload.error.js');
const ExperienceRessourceType = require('./models/experience_ressource_type');
const ServiceCrud = require('./model_crud/service.crud');
const OrderCrud = require('./model_crud/order.crud');
const ExperienceCrud = require('./model_crud/experience.crud.js');
const RecommendationCrud = require('./model_crud/recommendation_crud.js');

// Multiple import
const { formidableObjectParser } = require('./tools/util.tool.js');


const app = express();

let serviceCrud = new ServiceCrud();
let orderCrud = new OrderCrud();
let experienceCrud = new ExperienceCrud();
let recommendationCrud = new RecommendationCrud();


async function writeFile(form, subdir, files, orderId) {
    return new Promise((resolve, reject) => {

        form.uploadDir = `./uploads/${subdir}`;

        let splitted = files.specifications[0].originalFilename.split('.');
        let fileExtension = splitted[splitted.length - 1];

        if (fileExtension !== 'pdf') {
            reject(new FileUploadError('Only pdf files are allowed for specifications'));
            return;
        }

        let filePath = path.join(__dirname, 'uploads') + '/specs/specs_' + orderId + '.' + fileExtension;

        let oldPath = files.specifications[0].filepath;
        let newPath = filePath;

        try {
            let rawData = fs.readFileSync(oldPath);

            fs.writeFileSync(newPath, rawData);
            resolve('done!')
        } catch (error) {
            reject(error);
        }
    });
}


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

app.get('/load-order-success/order-success', (req, res) => {
    res.render('portfolio-pages/order-success');
});

// Orders route
app.post('/submit-order', (req, res) => {
    // console.log(`THE REQ BODY: ${req.body}`);

    const form = new formidable.IncomingForm({ allowEmptyFiles: true, minFileSize: 0 });
    // form.options.minFileSize = 0;
    // form.options.allowEmptyFiles = true;


    console.log('THE FORM OBJECT: ', form.options);

    form.parse(req, async (formidableErr, fields, files) => {

        if (formidableErr) {
            console.log('FORM PARSE ERR:: ', formidableErr);
            return res.status(520).send({
                type: 'danger',
                message: 'Unexpected error. Please try again!',
            });
        }

        const order = new Order(formidableObjectParser(fields));
        console.log('THE ORDER JUST CREATED: ', order);

        console.log('THE FIeLdS: ', fields);
        console.log('THE FILES: ', files);
        console.log('THE FILES SIZE: ', files.specifications[0].size);
        console.log('THE FILES ONE: ', files[0]);
        console.log('THE FILE: ', files.file);
        console.log('THE FILE DETAIL LENGTH: ', files.specifications.length);

        if (files.specifications.length !== 0 && files.specifications[0].originalFilename !== "" && files.specifications[0].size !== 0) {
            console.log('There is a file');
            order.specifications = true;
        } else {
            console.log('There is no file');
            order.specifications = false;
        }
        console.log('THE FORM OBJECT AFTER: ', form.options);

        console.log('THE ORDER JUST CREATED AFTER: ', order);

        order.description = order.description.trim();

        let modelError = order.validateSync();

        console.log('THE MODEL ERROR: ', modelError);
        console.log(1);
        if (modelError) {
            console.log(2);
            console.log(`THE ERROR::${modelError}`);

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
            return res.status(449).send({
                type: 'danger',
                message: modelError.errors[`${Object.keys(modelError.errors)[0]}`].message
            });
        }

        console.log('THE REQ BODY: ', req.body);
        console.log('THE REQ FILE: ', req.file);
        console.log('THE FIELDS: ', fields);
        console.log('THE BODY PARSED: ', formidableObjectParser(fields));
        // console.log(`\n${util.inspect(fields, { showHidden: false, depth: null, colors: true })}\n`);
        console.log('AFTER!!!!!!!!!!!!!!!!!');
        // // if (Object.keys(req.body).length) {
        //     console.log('ZI SERVICE: ', fields.service[0]);
        // Service.findOne({ value: order.service }).exec()
        serviceCrud.read({ value: order.service })
            .then(async (service) => {
                console.log(`\nSERVICE FOUND: ${service}\n`);
                if (!service) {
                    res.status(422).send({
                        type: 'danger',
                        message: 'Unprocessable entity',
                    });
                    return
                } else {


                    console.log(3);

                    if (order.specifications) {
                        // writeFile(form, 'sepcs', files)
                        //     .then((result) => {
                        //         console.log('THE RESULT: ', result);
                        //     })
                        //     .catch((error) => {

                        //     console.log('THE ERROR OF FILE HANDLER:: ', error);
                        //     return res.status(520).send({
                        //         type: 'danger',
                        //         message: 'Unexpected error. Please try again!',
                        //     });
                        //     });

                        try {
                            console.log('THE FILE UPLOAD');
                            let attr = await writeFile(form, 'sepcs', files, order._id);
                            console.log(attr);
                            console.log('END FILE UPLOAD');
                        } catch (error) {
                            console.log('THE ERROR OF FILE HANDLER:: ', error);
                            console.log('TYPE OF: ', error.name);
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
                        console.log('AFTER WRITE');
                    }

                    console.log('BEFORE SAVE');
                    console.log(`THE Order Before Save: `, order);
                    // order.save()
                    orderCrud.create(order)
                        .then((dbOrder) => {
                            // req.session.message = {
                            //     type: 'success',
                            //     message: 'Order send successfully. Please check your emails!',
                            // }
                            console.log(`THE Order: `, order);
                            console.log(`THE dbOrder: `, dbOrder);
                            console.log(`\n${1}\n`);





                            console.log(`\n${2}\n`);
                            ejs.renderFile(__dirname + '/views/portfolio-pages/order-success.ejs', dbOrder, (err, html) => {
                                if (err) {
                                    console.log('ERR IN EJS RENDERING: ', err);
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

                            // res.status(201).send({
                            //     type: 'success',
                            //     message: 'Order send successfully. Please check your emails!',
                            // });
                            // res.redirect('/');
                        })
                        .catch((error) => {
                            console.log(4);
                            console.log('BIG TOP ERROR!!!!!!!!!!!!!!!!');
                            console.log(5);
                            console.log(`\n${util.inspect(error, { showHidden: false, depth: null, colors: true })}\n`);
                            console.log(6);
                            res.status(520).send({
                                type: 'danger',
                                message: 'Unexpected error. Please try again!',
                            });
                            // req.session.message = {
                            //     info: {
                            //         type: 'danger',
                            //         message: 'Unexpected error. Please try again!',
                            //     }
                            // }
                            console.log(7);
                            // res.redirect('/');
                            console.log(8);
                        });
                }
            })
            .catch((error) => {
                console.log('ZE ERROR!!!!!!!!!!!!');
                console.log(`\n${util.inspect(error, { showHidden: false, depth: null, colors: true })}\n`);
                // req.session.message = {
                //     info: {
                //         type: 'danger',
                //         message: 'Unexpected error. Please try again!',
                //     },
                //     order: order,
                // }
                res.status(520).send({
                    type: 'danger',
                    message: 'Unexpected error. Please try again!',
                })
                // res.redirect('back');
                return

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
                res.render('portfolio-pages/works-body', { experienceFavorite: { ressources: results, type: "ui design" } });

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

// Recommendations route
app.post('/submit-recommendation', (req, res) => {

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

app.get(/^(?!\/(style|js|assets|fonts|experience)).*$/, (req, res) => {
    // res.set('Content-Type', 'application/javascript');

    // res.setHeader(
    //     'Content-Security-Policy',
    //     "script-src 'http://127.0.0.1:3400/js/portfolio-js/main.js https://assets2.lottiefiles.com/private_files/lf30_kecMeI.json https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js'"
    // );
    console.log('REQ URL: ', req.url);
    // if (!req.url.includes("/web/") && !req.url.includes("/experience/")) {
    res.render('portfolio-pages/layout');
    // }
});


module.exports = app;

// Lorem ipsum dolor sit amet