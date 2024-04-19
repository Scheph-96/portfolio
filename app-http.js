// Build-in requirement
const express = require('express');
const util = require('util');
const ejs = require('ejs');
const formidable = require('formidable');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const { serialize } = require('cookie');
const validator = require('validator');

// Custom requirement
const TempLink = require("./models/Schema/temp_link.js");
const Admin = require('./models/Schema/admin.js');
const AdminCrud = require('./model_crud/admin_crud.js');
const Email = require('./models/class/email.js');
const FileUploadError = require('./errors/file_upload.error.js');
const ExperienceRessourceType = require('./models/enums/experience_ressource_type.js');
const ServiceCrud = require('./model_crud/service.crud.js');
const OrderCrud = require('./model_crud/order.crud.js');
const ExperienceCrud = require('./model_crud/experience.crud.js');
const RecommendationCrud = require('./model_crud/recommendation_crud.js');
const appConfig = require('./dependencies.js');
const AppWebsocket = require('./app-websocket.js');


/////////////////////////////////////////////////////////////////////////////////////////
// **************************************************************************************
// ON REVIEW LINK GENERATION DON'T FORGET TO CHANGE THE URL BEFORE PRODUCTION
// **************************************************************************************
/////////////////////////////////////////////////////////////////////////////////////////

// Multiple import
const { Order, NewOrder } = require('./models/Schema/order.js');
const { formidableFormParser, generateUUID_V4, writeOnDisk, ErrorLogger, ActivityLogger, validatePassword, readOnDisk, getCookie } = require('./tools/util.tool.js');
const { Recommendation } = require('./models/Schema/recommendation.js');
// const socketLauncher = require('./app-websocket.js');


const app = express();

let serviceCrud = new ServiceCrud();
let orderCrud = new OrderCrud();
let experienceCrud = new ExperienceCrud();
let recommendationCrud = new RecommendationCrud();
let adminCrud = new AdminCrud();
let appWebsocket = new AppWebsocket();

// Create a transporter using custom SMTP settings
const transporter = nodemailer.createTransport({
    host: 'your_hosting_smtp_server.com',  // hosting provider's SMTP server
    port: 587,  // the appropriate port (587 is a common one for secure connections)
    secure: false,  // Set to true if using a secure connection (TLS)
    auth: {
        user: 'your_email@your_domain.com',  // email address on the hosting domain
        pass: 'your_email_password'   // email password
    }
});


app.get('/unknown-route', (req, res) => {
    res.render('notfound');
});

/////////////////////////////////////// PORTFOLIO ENDPOINTS ///////////////////////////////////////

app.get('/home', (req, res) => {
    Promise.all([serviceCrud.readAll(), experienceCrud.readAllFavoriteByType(ExperienceRessourceType.enum().web), recommendationCrud.readAllFavoriteWithPic()])
        .then((results) => {
            res.render('portfolio-pages/home', { services: results[0], experienceFavorite: { ressources: results[1], type: ExperienceRessourceType.enum().web }, recommendationFavorite: results[2] });
        })
        .catch((error) => {

            ErrorLogger.error(error.message, { ip: req.ip, url: req.url, method: req.method, stacktrace: util.inspect(error, { showHidden: false, depth: null, colors: true }) });

            return res.status(520).send({
                type: 'danger',
                message: 'Unexpected error. Please try again!',
            });
        });
});

app.get('/load-order/:service', (req, res) => {
    res.render('portfolio-pages/order', { service: req.params.service });
});

// Orders route
app.post('/submit-order', (req, res) => {

    const form = new formidable.IncomingForm({ allowEmptyFiles: true, minFileSize: 0 });

    form.parse(req, async (formidableErr, fields, files) => {

        if (formidableErr) {
            ErrorLogger.error("FORMIDABLE ERROR", { ip: req.ip, url: req.url, method: req.method, stacktrace: util.inspect(formidableErr, { showHidden: false, depth: null, colors: true }) });

            return res.status(520).send({
                type: 'danger',
                message: 'Unexpected error. Please try again!',
            });
        }

        console.log("FIELDS: ", fields);

        let order = new NewOrder(formidableFormParser(fields));

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

            ErrorLogger.error(modelError.errors[`${Object.keys(modelError.errors)[0]}`].message, { ip: req.ip, url: req.url, method: req.method, stacktrace: util.inspect(modelError.errors[`${Object.keys(modelError.errors)[0]}`], { showHidden: false, depth: null, colors: true }) });
            return res.status(449).send({
                type: 'danger',
                message: modelError.errors[`${Object.keys(modelError.errors)[0]}`].message
            });
        }

        // Check if the service exist
        serviceCrud.read({ value: order.service })
            .then(async (service) => {
                if (!service) {
                    ErrorLogger.error("NO SERVICE FOUND ON THIS ORDER", { ip: req.ip, url: req.url, method: req.method });
                    return res.status(422).send({
                        type: 'danger',
                        message: 'Unprocessable entity',
                    });
                } else {

                    // Write the file on the disk if there is one
                    if (order.specifications) {
                        try {
                            let attr = await writeOnDisk('specs', files, order._id, order.constructor.collection.name);
                        } catch (error) {
                            ErrorLogger.error(error.message, { ip: req.ip, url: req.url, method: req.method, stacktrace: util.inspect(error, { showHidden: false, depth: null, colors: true }) });
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
                                    ErrorLogger.error(err.message, { ip: req.ip, url: req.url, method: req.method, stacktrace: util.inspect(err, { showHidden: false, depth: null, colors: true }) });
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
                            ErrorLogger.error(error.message, { ip: req.ip, url: req.url, method: req.method, stacktrace: util.inspect(error, { showHidden: false, depth: null, colors: true }) });
                            res.status(520).send({
                                type: 'danger',
                                message: 'Unexpected error. Please try again!',
                            });
                        });
                }
            })
            .catch((error) => {
                ErrorLogger.error(error.message, { ip: req.ip, url: req.url, method: req.method, stacktrace: util.inspect(error, { showHidden: false, depth: null, colors: true }) });
                return res.status(520).send({
                    type: 'danger',
                    message: 'Unexpected error. Please try again!',
                });

            });
    });
});

/* 
 * Experiences route
 * This endpoint return all work of experience favorite by type
 * on the work menu with "web" "uidesign" "poster" and "logo" when the
 * user click on each menu item the endpoint return the needed
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
        ErrorLogger.error(error.message, { ip: req.ip, url: req.url, method: req.method, stacktrace: util.inspect(error, { showHidden: false, depth: null, colors: true }) });

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

        ErrorLogger.error(error.message, { ip: req.ip, url: req.url, method: req.method, stacktrace: util.inspect(error, { showHidden: false, depth: null, colors: true }) });
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
            recommendationCrud.readAllWithPic()
                .then((result) => {
                    res.render('portfolio-pages/more-recommendation', { recommendations: result });
                })
                .catch((error) => {
                    ErrorLogger.error(error.message, { ip: req.ip, url: req.url, method: req.method, stacktrace: util.inspect(error, { showHidden: false, depth: null, colors: true }) });

                    return res.status(520).send({
                        type: 'danger',
                        message: 'Unexpected error. Please try again!',
                    });
                });
        } else {
            if (req.params.rate === "all") {
                recommendationCrud.readAllWithPic()
                    .then((result) => {
                        res.render('portfolio-pages/more-recommendation-body', { recommendations: result });
                    })
                    .catch((error) => {
                        ErrorLogger.error(error.message, { ip: req.ip, url: req.url, method: req.method, stacktrace: util.inspect(error, { showHidden: false, depth: null, colors: true }) });

                        return res.status(520).send({
                            type: 'danger',
                            message: 'Unexpected error. Please try again!',
                        });
                    });
            } else {
                let rate = parseInt(req.params.rate);
                // Convert the param to number
                recommendationCrud.readAllByRateWithPic(rate)
                    .then((result) => {
                        res.render('portfolio-pages/more-recommendation-body', { recommendations: result });
                    })
                    .catch((error) => {
                        ErrorLogger.error(error.message, { ip: req.ip, url: req.url, method: req.method, stacktrace: util.inspect(error, { showHidden: false, depth: null, colors: true }) });

                        return res.status(520).send({
                            type: 'danger',
                            message: 'Unexpected error. Please try again!',
                        });
                    });
            }
        }
    } catch (error) {
        ErrorLogger.error(error.message, { ip: req.ip, url: req.url, method: req.method, stacktrace: util.inspect(error, { showHidden: false, depth: null, colors: true }) });

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
        ErrorLogger.error(error.message, { ip: req.ip, url: req.url, method: req.method, stacktrace: util.inspect(error, { showHidden: false, depth: null, colors: true }) });

        return res.status(520).send({
            type: 'danger',
            message: 'Unexpected error. Please try again!',
        });
    }

});

// Render review page
app.get('/user/send/review/:token', async (req, res) => {
    try {
        let token = req.params.token;
        let result = await TempLink.findOne({ token: token }).exec();

        if (result) {
            res.render('portfolio-pages/send-review');
        } else {
            res.render('notfound');
        }

    } catch (error) {
        ErrorLogger.error(error.message, { ip: req.ip, url: req.url, method: req.method, stacktrace: util.inspect(error, { showHidden: false, depth: null, colors: true }) });

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
                if (tempLink) {
                    const form = new formidable.IncomingForm({ allowEmptyFiles: true, minFileSize: 0 });

                    form.parse(req, async (formidableErr, fields, files) => {
                        if (formidableErr) {
                            ErrorLogger.error("FORMIDABLE ERROR", { ip: req.ip, url: req.url, method: req.method, stacktrace: util.inspect(formidableErr, { showHidden: false, depth: null, colors: true }) });

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
                            ErrorLogger.error("VALIDATION ERROR", { ip: req.ip, url: req.url, method: req.method, stacktrace: util.inspect(validationError.errors[`${Object.keys(validationError.errors)[0]}`], { showHidden: false, depth: null, colors: true }) });

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

                                ErrorLogger.error(error.message, { ip: req.ip, url: req.url, method: req.method, stacktrace: util.inspect(error, { showHidden: false, depth: null, colors: true }) });

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
                                        ejs.renderFile(__dirname + '/views/portfolio-pages/review-success.ejs', { recommendation: recommendation }, (err, html) => {
                                            if (err) {
                                                ErrorLogger.error(err.message, { ip: req.ip, url: req.url, method: req.method, stacktrace: util.inspect(err, { showHidden: false, depth: null, colors: true }) });

                                                return res.status(520).send({
                                                    type: 'danger',
                                                    message: 'Unexpected error. Please try again!',
                                                });
                                            }

                                            res.status(201).send({
                                                type: "success",
                                                message: "Review submitted successfully",
                                                page: html
                                            });
                                        });
                                    })
                                    .catch((error) => {

                                        ErrorLogger.error(error.message, { ip: req.ip, url: req.url, method: req.method, stacktrace: util.inspect(error, { showHidden: false, depth: null, colors: true }) });

                                        return res.status(520).send({
                                            type: 'danger',
                                            message: 'Unexpected error. Please try again!',
                                        });

                                    })

                            }).catch((error) => {

                                ErrorLogger.error(error.message, { ip: req.ip, url: req.url, method: req.method, stacktrace: util.inspect(error, { showHidden: false, depth: null, colors: true }) });

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

                ErrorLogger.error(error.message, { ip: req.ip, url: req.url, method: req.method, stacktrace: util.inspect(error, { showHidden: false, depth: null, colors: true }) });

                return res.status(520).send({
                    type: 'danger',
                    message: 'Unexpected error. Please try again!',
                });
            });

    } catch (error) {

        ErrorLogger.error(error.message, { ip: req.ip, url: req.url, method: req.method, stacktrace: util.inspect(error, { showHidden: false, depth: null, colors: true }) });

        return res.status(520).send({
            type: 'danger',
            message: 'Unexpected error. Please try again!',
        });
    }
});

app.post('/user/contact', (req, res) => {
    try {

        const form = new formidable.IncomingForm({ allowEmptyFiles: true, minFileSize: 0 });

        form.parse(req, async (formidableErr, fields, files) => {
            if (formidableErr) {
                ErrorLogger.error("FORMIDABLE ERROR", { ip: req.ip, url: req.url, method: req.method, stacktrace: util.inspect(formidableErr, { showHidden: false, depth: null, colors: true }) });

                return res.status(520).send({
                    type: 'danger',
                    message: 'Unexpected error. Please try again!',
                });
            }

            let email = new Email(formidableFormParser(fields));

            // Email options
            const mailOptions = {
                from: 'your_email@your_domain.com',  // Sender's email address
                to: email.data.to, // Recipient's email address
                subject: email.data.subject,  // Email subject
                text: email.data.text  // Email body
            };

            // Send email
            transporter.sendMail(mailOptions, (error, info) => {
                /**
                 * The 'info' object has the following attributes:
                 * - messageId: String, the unique identifier assigned to the message by the mail server.
                 * - envelope: Object, the envelope information for the message.
                 * - accepted: Array, an array of recipient addresses that were accepted by the server.
                 * - rejected: Array, an array of recipient addresses that were rejected by the server.
                 * - pending: Array, an array of recipient addresses for which the delivery is still pending.
                 * - response: String, the entire raw response message from the mail server.
                 * - envelopeTime: Number, the time taken to send the envelope.
                 * - messageTime: Number, the time taken to send the message.
                 * - messageSize: Number, the size of the message in bytes.
                 * - responseCode: Number, the response code received from the mail server.
                 * - command: String, the last command sent by Nodemailer to the mail server.
                 * - rejectedErrors: Array, an array of error messages for rejected recipients.
                 * - rejectedRecipientStatus: Object, detailed status information for rejected recipients.
                 * - envelope: Object, the envelope information for the message.
                */

                if (error) {
                    ErrorLogger.error(error.message, { ip: req.ip, url: req.url, method: req.method, stacktrace: util.inspect(error, { showHidden: false, depth: null, colors: true }) });
                    return res.status(520).send({
                        type: 'danger',
                        message: 'Unexpected error. Please try again!',
                    });
                } else {
                    ActivityLogger.info(`Name: ${email.data.name}, From: ${email.data.to}, Subject: ${email.data.subject}:|:Response: ${info.response}`, { ip: req.ip, url: req.url, method: req.method });
                }

                // Close the transporter
                transporter.close();
            });

        });
    } catch (error) {
        ErrorLogger.error(error.message, { ip: req.ip, url: req.url, method: req.method, stacktrace: util.inspect(error, { showHidden: false, depth: null, colors: true }) });


    }
});

/////////////////////////////////////// DASHBOARD ENDPOINT ///////////////////////////////////////

// Admin Login
app.post('/sc-admin/login', (req, res) => {
    try {
        console.log("THA HEADER IN LOGIN: ", req.headers);
        console.log("THA HEADER CONTENT-TYPE IN LOGIN: ", req.headers['content-type']);
        const form = new formidable.IncomingForm({ allowEmptyFiles: true, minFileSize: 0 });

        form.parse(req, async (formidableErr, fields) => {

            if (formidableErr) {
                ErrorLogger.error("FORMIDABLE ERROR", { ip: req.ip, url: req.url, method: req.method, stacktrace: util.inspect(formidableErr, { showHidden: false, depth: null, colors: true }) });

                return res.status(520).send({
                    type: 'danger',
                    message: 'Unexpected error. Please try again!',
                });
            }

            let admin = new Admin(formidableFormParser(fields));
            let modelError = admin.validateSync();

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

                ErrorLogger.error(modelError.errors[`${Object.keys(modelError.errors)[0]}`].message, { ip: req.ip, url: req.url, method: req.method, stacktrace: util.inspect(modelError.errors[`${Object.keys(modelError.errors)[0]}`], { showHidden: false, depth: null, colors: true }) });
                return res.status(449).send({
                    type: 'danger',
                    message: modelError.errors[`${Object.keys(modelError.errors)[0]}`].message
                });
            }

            adminCrud.read({ email: admin.email })
                .then((adminUser) => {
                    if (!adminUser) {
                        ErrorLogger.error("NO ADMIN FOUND", { ip: req.ip, url: req.url, method: req.method });
                        return res.status(401).send({
                            type: 'danger',
                            message: 'Invalid Credentials!',
                        });
                    } else {

                        validatePassword(admin.password, adminUser.password)
                            .then(async (isMatched) => {
                                if (!isMatched) {
                                    ActivityLogger.info(`${adminUser.username} failed to log in!`, { ip: req.ip, url: req.url, method: req.method });

                                    return res.status(401).send({
                                        type: 'danger',
                                        message: 'Invalid Credentials!',
                                    });
                                }

                                jwt.sign({ username: adminUser.username }, await readOnDisk(__dirname + '/keys/jwtRS256.key'), { algorithm: 'RS256', expiresIn: "30 days" }, (err, token) => {

                                    if (err) {
                                        ErrorLogger.error(err.message, { ip: req.ip, url: req.url, method: req.method, stacktrace: util.inspect(err, { showHidden: false, depth: null, colors: true }) });
                                        return res.status(520).send({
                                            type: 'danger',
                                            message: 'Unexpected error. Please try again!',
                                        });
                                    }

                                    console.log("THE NEW GEN TOKEN: ", token);

                                    const serializedCookie = serialize('authToken', token, {
                                        httpOnly: true,
                                        secure: app.get('env') === 'production',
                                        sameSite: 'strict',
                                        maxAge: 60 * 60 * 24 * 30,
                                        path: '/sc-admin'
                                    });

                                    // res.status(200).send({
                                    //     type: 'success',
                                    //     message: `Welcome back, ${adminUser.username}`
                                    // });

                                    ActivityLogger.info(`${adminUser.username} logged in!`, { ip: req.ip, url: req.url, method: req.method });

                                    res.setHeader('Set-Cookie', serializedCookie);
                                    res.status(200).send({
                                        type: 'success',
                                        message: `Welcome back, ${adminUser.username}`,
                                        redirectionUrl: '/sc-admin'
                                    });

                                    return;
                                });


                            })
                            .catch((error) => {
                                ErrorLogger.error(error.message, { ip: req.ip, url: req.url, method: req.method, stacktrace: util.inspect(error, { showHidden: false, depth: null, colors: true }) });
                                return res.status(520).send({
                                    type: 'danger',
                                    message: 'Unexpected error. Please try again!',
                                });
                            })
                    }
                })
                .catch((error) => {
                    ErrorLogger.error(error.message, { ip: req.ip, url: req.url, method: req.method, stacktrace: util.inspect(error, { showHidden: false, depth: null, colors: true }) });
                    return res.status(520).send({
                        type: 'danger',
                        message: 'Unexpected error. Please try again!',
                    });
                });

        });

    } catch (error) {
        ErrorLogger.error(error.message, { ip: req.ip, url: req.url, method: req.method, stacktrace: util.inspect(error, { showHidden: false, depth: null, colors: true }) });

        return res.status(520).send({
            type: 'danger',
            message: 'Unexpected error. Please try again!',
        });
    }
});

// Admin profile actions
app.get('/sc-admin/profile/actions/:action', async (req, res) => {
    try {
        switch (req.params.action) {
            case "my-profile":

                break;

            case "settings":

                break;

            case "logout":

                ActivityLogger.info(`SC-Admin-1 IS GOING OFFLINE...`, { ip: req.ip, url: req.url, method: req.method });

                const serializedCookie = serialize('authToken', null, {
                    httpOnly: true,
                    secure: app.get('env') === 'production',
                    sameSite: 'strict',
                    maxAge: -1,
                    path: '/sc-admin'
                });

                await adminCrud.update({ username: "SC-Admin-1" }, { online: false });
                appWebsocket.close();

                ActivityLogger.info(`SC-Admin-1 IS OFFLINE`, { ip: req.ip, url: req.url, method: req.method });


                res.setHeader('Set-Cookie', serializedCookie);
                return res.status(200).send({
                    type: 'success',
                    message: `Logged Out`,
                    redirectionUrl: '/sc-admin'
                });

                break;

            default:
                ErrorLogger.error("ADMIN PROFILE ACTIONS DEFAULT BLOCK REACHED", { ip: req.ip, url: req.url, method: req.method, stacktrace: util.inspect(error, { showHidden: false, depth: null, colors: true }) });

                break;
        }
    } catch (error) {
        ErrorLogger.error(error.message, { ip: req.ip, url: req.url, method: req.method, stacktrace: util.inspect(error, { showHidden: false, depth: null, colors: true }) });

        return res.status(520).send({
            type: 'danger',
            message: 'Unexpected error. Please try again!',
        });
    }
});

// Load admin pages
app.get('/load-admin-pages/:page', (req, res) => {
    try {
        switch (req.params.page) {
            case "dashboard":
                res.render(`dashboard-pages/${req.params.page}`);
                break;

            case "order":
                Promise.all([orderCrud.readAndParseNewOrders(), orderCrud.readAll()])
                    .then((orders) => {
                        res.render(`dashboard-pages/${req.params.page}`, { newOrders: orders[0], orders: orders[1] });
                    })
                    .catch((error) => {

                        ErrorLogger.error(error.message, { ip: req.ip, url: req.url, method: req.method, stacktrace: util.inspect(error, { showHidden: false, depth: null, colors: true }) });

                        return res.status(520).send({
                            type: 'danger',
                            message: 'Unexpected error. Please try again!',
                        });
                    });
                break;

            case "projects":
                res.render(`dashboard-pages/${req.params.page}`);
                break;

            case "customers":
                res.render(`dashboard-pages/${req.params.page}`);
                break;

            case "mailbox":
                res.render(`dashboard-pages/${req.params.page}`);
                break;

            case "income":
                res.render(`dashboard-pages/${req.params.page}`);
                break;

            case "analytics":
                res.render(`dashboard-pages/${req.params.page}`);
                break;

            default:
                res.render('notfound');
                break
        }
    } catch (error) {
        ErrorLogger.error(error.message, { ip: req.ip, url: req.url, method: req.method, stacktrace: util.inspect(error, { showHidden: false, depth: null, colors: true }) });

        return res.status(520).send({
            type: 'danger',
            message: 'Unexpected error. Please try again!',
        });
    }
});

app.get(/^(?!\/(style|js|assets|fonts|experience)).*$/, async (req, res, next) => {
    try {
        // logger.info(`[${req.method}] ${req.url}`);
        // logger.info({ip: req.ip, message: 'Request successful'});

        // try {
        //     throw new Error("BRUUUUUUUUHHHHHHHH")
        // } catch (error) {
        //     ErrorLogger.error(`${error.message}`, { ip: req.ip, url: req.url, method: req.method })   
        // }

        // res.set('Content-Type', 'application/javascript');

        // res.setHeader(
        //     'Content-Security-Policy',
        //     "script-src 'http://127.0.0.1:3400/js/portfolio-js/main.js https://assets2.lottiefiles.com/private_files/lf30_kecMeI.json https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js'"
        // );
        // console.log('REQ URL: ', req.url);
        let skeleton;

        if (!req.url.includes("/sc-admin")) {
            // app.use(express.static(path.join(__dirname, "public"), { index: false }));
            if (req.url === "/") {
                skeleton = 'skeletons/home.skeleton.ejs';
            } else if (req.url.includes("/order/")) {
                skeleton = 'skeletons/order.skeleton.ejs';
            } else if (req.url.includes("/works/")) {
                skeleton = 'skeletons/more-experience.skeleton.ejs';
            } else if (req.url === "/recommendations") {
                skeleton = 'skeletons/more-recommendation.skeleton.ejs';
            }
            ActivityLogger.info('PORTFOLIO LOAD', { ip: req.ip, url: req.url, method: req.method });

            res.render('portfolio-pages/portfolio-layout', { skeleton: skeleton });
        } else if (req.url.includes("/sc-admin")) {

            let { cookie } = req.headers;

            if (!cookie) {
                ActivityLogger.info("NO COOKIE AT ALL: /sc-admin request attempt", { ip: req.ip, url: req.url, method: req.method });
                
                res.status(401);
                return res.render('dashboard-pages/dashboard-login');
            }

            getCookie(cookie, 'authToken')
                .then(async (authToken) => {

                    if (!authToken) {
                        ActivityLogger.info("AUTHTOKEN COOKIE UNAVAILABLE: /sc-admin request attempt", { ip: req.ip, url: req.url, method: req.method });
                        res.status(401);
                        return res.render('dashboard-pages/dashboard-login');
                    }

                    jwt.verify(authToken, await readOnDisk(__dirname + '/keys/jwtRS256.key.pub'), (err, decoded) => {
                        if (err) {

                            if (err.name === "TokenExpiredError") {
                                /** 
                                 * IT'S FINE. KEEP THE ERRORLOGGER HERE. 
                                 * IT'S ALREADY CALLED IN THE EXPRESS ERROR HANDLER
                                 * PRE-SET IN index.js
                                 */
                                ErrorLogger.error(err.message, { ip: req.ip, url: req.url, method: req.method, stacktrace: util.inspect(err, { showHidden: false, depth: null, colors: true }) });

                                res.status(401);
                                return res.render('dashboard-pages/dashboard-login');
                            }

                            // ERRORLOGGER ALREADY EXIST HERE. WHEN WE CALL EXPRESS ERROR HANDLER
                            next(err);
                            return
                        }

                        /**
                         * THE DECODED TOKEN LOOK LIKE THIS:
                         * decoded = { username: string, iat: timestamp, exp: timestamp }
                         * 
                         * It was the admin username that we signed in the token
                         * 
                         * In the JSON Web Token (JWT) standard, the "iat" (issued at)
                         * claim is a timestamp that indicates the time at which the
                         * JWT was issued. This is the time at which the JWT was created,
                         * and can be used to determine the age of the JWT.
                         */
                        decoded = validator.escape(decoded.username);
                        let user = { username: decoded };

                        adminCrud.read(user)
                            .then((matchedUser) => {
                                if (!matchedUser) {
                                    ActivityLogger.info(`Admin '${user.username}' failed to log in! Admin not recognize on page load`, { ip: req.ip, url: req.url, method: req.method });

                                    res.status(401);
                                    return res.render('dashboard-pages/dashboard-login');
                                }

                                ActivityLogger.info(`Admin '${user.username}' found!`, { ip: req.ip, url: req.url, method: req.method });

                                if (!matchedUser.online) {
                                    ActivityLogger.info(`Admin '${user.username}' IS OFFLINE. SETTING IT ONLINE...`, { ip: req.ip, url: req.url, method: req.method });

                                    adminCrud.update({ username: user.username }, { online: true })
                                        .then((result) => {
                                            appWebsocket.connection();
                                            ActivityLogger.info(`Admin '${user.username}' IS ONLINE`, { ip: req.ip, url: req.url, method: req.method });
                                        })
                                        .catch((error) => {
                                            next(error);
                                        });
                                } else {
                                    ActivityLogger.info(`Admin '${user.username}' IS ALREADY ONLINE`, { ip: req.ip, url: req.url, method: req.method });

                                    appWebsocket.connection();
                                }

                                ActivityLogger.info('ADMIN PAGE LOAD', { ip: req.ip, url: req.url, method: req.method });
                                res.status(200);
                                return res.render('dashboard-pages/dashboard-layout', { user: user });

                            })
                            .catch((error) => {
                                next(error);
                            });

                    });

                })
                .catch((error) => {
                    // Call express error handler define in index.js
                    next(error);
                });
        }
    } catch (error) {
        next(error);
    }
});


module.exports = app;

// Lorem ipsum dolor sit amet