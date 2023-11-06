const express = require('express');
const Order = require('./models/order');
const Service = require('./models/service');
const multer = require('multer');
const util = require('util');
const fs = require('fs');
const ejs = require('ejs');
const formidable = require('formidable');
const formidableObjectParser = require('./tools/util.tool.js');
const path = require('path');
const FileUploadError = require('./errors/file_upload.error.js');


const app = express();

// let storage = multer.diskStorage({
//     destination: (req, file, cb) => {

//         cb(null, `./uploads/specs/`);
//     },
//     filename: (req, file, cb) => {

//         // if (req.path === '/submit-order') {
//         cb(null, `specs_${file.originalname}`);
//         // }
//     },
// });

// const upload = multer({storage: storage});

const upload = multer();


async function fileHandler(req, res, files, subdir, objectId) {

    return new Promise((resolve, reject) => {
        if (!fs.existsSync(`./uploads/${subdir}`)) {
            fs.mkdirSync(`./uploads/${subdir}`);
        }

        console.log('IN FILE HANDLER REQ.FILE: ', req.file);
        console.log('IN FILE HANDLER files: ', files);

        req.file = files;

        const dynamicDestination = (req, file, cb) => {
            // let destination;

            // if (req.path === '/submit-order') {
            //    let destination = `./uploads/${subdir}/`;
            // }

            cb(null, `./uploads/${subdir}/`);
        }

        const dynamicFilename = (req, file, cb) => {

            // if (req.path === '/submit-order') {
            cb(null, `${subdir}_${objectId}_${file.originalname}`);
            // }
        }

        const fileFilter = (req, file, cb) => {
            let splittedFilename = file.originalname.split('.');
            const fileExtension = splittedFilename[splittedFilename.length - 1];

            console.log('FILE EXTENSION: ', fileExtension);

            if (fileExtension.toLowerCase() === "pdf") {
                cb(null, true);
            } else {
                cb(null, false);
            }
        }

        let storage = multer.diskStorage({
            destination: dynamicDestination,
            filename: dynamicFilename,
        });

        let dynamicUpload = multer({
            storage: storage,
            fileFilter: fileFilter,
            // limits: {
            //     fileSize: 10 * 1024 * 1024, // 10 MB
            // },
        });

        dynamicUpload.single('specifications')(req, res, (err) => {
            console.log('THE FILE IN SINGLE: ', req.file);
            if (err) {
                console.log(`\n THE FILE UPLOAD ERROR::${util.inspect(err, { showHidden: false, depth: null, colors: true })}\n`);

                reject({
                    type: 'danger',
                    message: 'Unexpected error. Please try again!',
                });
            }
            console.log('BE RESOLVE');
            resolve('done');
        });
    })
}


async function writeFile(form, subdir, files, orderId)  {
    return new Promise((resolve, reject) => {

        form.uploadDir = `./uploads/${subdir}`;

        let splitted = files.specifications[0].originalFilename.split('.');
        let fileExtension = splitted[splitted.length -1];
        
        if (fileExtension !== 'pdf') {
            reject(new FileUploadError('Only pdf files are allowed for specifications'));
            return;
        }

        let filePath = path.join(__dirname, 'uploads')+ '/specs/specs_' + orderId + '_.' + fileExtension;

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
    Service.find().exec()
        .then((services) => {
            res.render('portfolio-pages/home', { 'services': services });
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



// app.get('/req/*', (req, res) => {
//     switch (req.path) {
//         case '/req/order/:service':

//             break;

//         default:
//             break;
//     }
//     Service.find().exec()
//         .then((services) => {
//             res.render('portfolio-index', { 'services': services });
//         })
//         .catch((error) => {
//             console.log(`\n${util.inspect(error, { showHidden: false, depth: null, colors: true })}\n`);
//             req.session.message = {
//                 type: 'danger',
//                 message: 'Unexpected error. Please try again!',
//             }
//             // res.status(422)
//             // res.redirect('back');
//             return
//         });
// });

// app.get('/admin-dashboard', (req, res) => {
//     res.render('dashboard-index');
// });

// // Services page route
app.get('/load-order/:service', (req, res) => {
    let service = req.params.service;
    // console.log('LOCALS MESSAGE: ', res.locals.message);
    // if (res.locals.message) {
    //     res.locals.message = null;
    // }
    res.render('portfolio-pages/order', { 'service': service });
});

app.get('/load-order-success/order-success', (req, res) => {
    res.render('portfolio-pages/order-success');
});


// Orders route
app.post('/submit-order', (req, res) => {
    // console.log(`THE REQ BODY: ${req.body}`);

    const form = new formidable.IncomingForm();

    form.parse(req, (formidableErr, fields, files) => {

        const order = new Order(formidableObjectParser(fields));
        console.log('THE ORDER JUST CREATED: ', order);

        console.log('THE FILES: ', files);
        console.log('THE FILES ONE: ', files[0]);
        console.log('THE FILE: ', files.file);
        // console.log('THE FILE DETAIL: ', files.specifications[0].filepath);

        if (Object.keys(files).length) {
            console.log('There is a file');
            order.specifications = true;
        } else {
            order.specifications = false;
        }

        let modelError = order.validateSync();

        console.log(1);
        if (modelError) {
            console.log(2);
            console.log(`THE ERROR::${modelError}`);
            // req.session.message = {
            //     type: 'danger',
            //     message: error.errors[`${Object.keys(error.errors)[0]}`].message,
            //     order: order,
            // }

            // console.log(`THE SERVICE: ${order.service}`);
            // console.log('MODEL ERROR: ', Object.keys(modelError.errors));
            // console.log('MODEL ERROR ERRORS: ', modelError.errors);

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

        if (formidableErr) {
            console.log('FORM PARSE ERR:: ', formidableErr);
            return res.status(520).send({
                type: 'danger',
                message: 'Unexpected error. Please try again!',
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

        Service.findOne({ value: order.service }).exec()
            .then(async (service) => {
                console.log(`\nSERVICE FOUND: ${service}\n`);
                if (!service) {
                    // req.session.message = {
                    //     info: {
                    //         type: 'danger',
                    //         message: 'Unprocessable entity',
                    //     },
                    //     order: order,
                    // }
                    // res.status(422);
                    res.status(422).send({
                        type: 'danger',
                        message: 'Unprocessable entity',
                    });
                    return
                } else {


                    console.log(3);

                    if (files) {
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
                            // await fileHandler(req, res, files, 'specs', dbOrder._id);
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
                        // fileHandler(req, res, 'specs', dbOrder._id)
                        //     .then((result) => {})
                        //     .catch((error) => {
                        //         console.log('THE ERROR OF FILE HANDLER:: ', error);
                        //         return res.status(520).send(error);
                        //     });
                    }

                    console.log('BEFORE SAVE');
                    console.log(`THE Order Before Save: `, order);
                    order.save()
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

    // // try {


    console.log(9);
    // } else {
    //     // res.status(400).send('Bad Request');
    //     req.session.message = {
    //         type: 'danger',
    //         message: 'Bad Request',
    //     }
    //     res.redirect('/');
    // }
});

app.get(/^(?!\/(style|js|assets|fonts)).*$/, (req, res) => {
    // res.set('Content-Type', 'application/javascript');

    // res.setHeader(
    //     'Content-Security-Policy',
    //     "script-src 'http://127.0.0.1:3400/js/portfolio-js/main.js https://assets2.lottiefiles.com/private_files/lf30_kecMeI.json https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js'"
    // );
    res.render('portfolio-pages/layout');
});


module.exports = app;

// Lorem ipsum dolor sit amet