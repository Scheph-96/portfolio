// Build-in requirement
const express = require('express');
const util = require('util');
const ejs = require('ejs');

// Custom requirement
const ExperienceRessourceType = require('./models/enums/experience_ressource_type.js');
const AppServerResponse = require('./models/class/app_server_response.js');
const Email = require('./models/email.js');

const ExperienceCrud = require('./model_crud/experience.crud.js');
const RecommendationCrud = require('./model_crud/recommendation_crud.js');
const LanguageCrud = require('./model_crud/language.crud.js');
const {ActivityLogger} = require("./tools/util.tool.js");
const {ErrorLogger} = require("./tools/util.tool.js")

const app = express();

let experienceCrud = new ExperienceCrud();
let recommendationCrud = new RecommendationCrud();
let languageCrud = new LanguageCrud();


// // Create a transporter using custom SMTP settings
// const transporter = nodemailer.createTransport({
//     host: "smtp-relay.brevo.com",  // hosting provider's SMTP server
//     port: 587,  // the appropriate port (587 is a common one for secure connections)
//     secure: false,  // Set to true if using a secure connection (TLS)
//     auth: {
//         user: process.env.NODEMAILER_AUTH_EMAIL,  // email address on the hosting domain
//         pass: process.env.NODEMAILER_AUTH_PASSWORD  // email password
//     }
// });


app.get('/unknown-route', (req, res) => {
    res.render('notfound');
});

/////////////////////////////////////// ENDPOINTS ///////////////////////////////////////

app.get('/home', (req, res) => {
    Promise.all([experienceCrud.readAllFavoriteByType(ExperienceRessourceType.enum().html_css), recommendationCrud.readAllFavoriteWithPic()])
        .then((results) => {
            res.render('portfolio-pages/home', { experienceFavorite: { ressources: results[0], type: ExperienceRessourceType.enum().html_css }, recommendationFavorite: results[1] });
        })
        .catch((error) => {

            ErrorLogger.error(error.message, { ip: req.ip, url: req.url, method: req.method, stacktrace: util.inspect(error, { showHidden: false, depth: null, colors: true }) });

            return res.status(520).send({
                type: 'danger',
                message: 'Unexpected error. Please try again!',
            });
        });
});

/* 
 * Experiences route
 * This endpoint return all work of experience favorite by type
 * on the work menu with "html_css" "react" "nodejs" when the
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
            case ExperienceRessourceType.enum().html_css:
                results = await experienceCrud.readAllFavoriteByType(ExperienceRessourceType.enum().html_css);
                res.render('portfolio-pages/works-body', { experienceFavorite: { ressources: results, type: ExperienceRessourceType.enum().html_css } });

                break;

            case ExperienceRessourceType.enum().react:
                results = await experienceCrud.readAllFavoriteByType(ExperienceRessourceType.enum().react);
                res.render('portfolio-pages/works-body', { experienceFavorite: { ressources: results, type: ExperienceRessourceType.enum().react } });

                break;

            case ExperienceRessourceType.enum().nodejs:
                results = await experienceCrud.readAllFavoriteByType(ExperienceRessourceType.enum().nodejs);
                res.render('portfolio-pages/works-body', { experienceFavorite: { ressources: results, type: ExperienceRessourceType.enum().nodejs } });

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
            case ExperienceRessourceType.enum().html_css:
                results = await experienceCrud.readAllByType(ExperienceRessourceType.enum().html_css);
                res.render('portfolio-pages/more-experience', { experiences: { ressources: results, type: ExperienceRessourceType.enum().html_css } });
                break;

            case ExperienceRessourceType.enum().react:
                results = await experienceCrud.readAllByType(ExperienceRessourceType.enum().react);
                res.render('portfolio-pages/more-experience', { experiences: { ressources: results, type: "react" } });
                break;

            case ExperienceRessourceType.enum().nodejs:
                results = await experienceCrud.readAllByType(ExperienceRessourceType.enum().nodejs);
                res.render('portfolio-pages/more-experience', { experiences: { ressources: results, type: ExperienceRessourceType.enum().nodejs } });

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


/////////////////////////////////////// APP START POINT ///////////////////////////////////////

app.get(/^(?!\/(style|js|assets|fonts|experience)).*$/, async (req, res, next) => {

    try {

        let skeleton;

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

        languageCrud.readAll()
            .then((result) => {

                res.render('portfolio-pages/portfolio-layout', { skeleton: skeleton, languages: result });

            }).catch((error) => {

                ErrorLogger.error(error.message, { ip: req.ip, url: req.url, method: req.method, stacktrace: util.inspect(error, { showHidden: false, depth: null, colors: true }) });

                return res.status(520).send({
                    type: 'danger',
                    message: 'Unexpected error. Please try again!',
                });
            })

    } catch (error) {
        next(error);
    }
});


module.exports = app;

// Lorem ipsum dolor sit amet