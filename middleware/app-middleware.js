const express = require('express');
const util = require('util');
const path = require('path');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const AdminCrud = require('../model_crud/admin_crud.js');

const { ErrorLogger, ActivityLogger, readOnDisk, getCookie } = require('../tools/util.tool.js');
const AppServerResponse = require('../models/class/app_server_response.js');


/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 * @returns 
 */
function adminAuthMiddleware(req, res, next) {
    let adminCrud = new AdminCrud();

    let { cookie } = req.headers;

    if (!cookie) {
        ActivityLogger.info("NO COOKIE AT ALL: /sc-admin request attempt", { ip: req.ip, url: req.url, method: req.method });

        res.status(401);
        return res.send(new AppServerResponse(
            'warning',
            'Session terminated',
            '/sc-admin'
        ));
    }

    getCookie(cookie, 'authToken')
        .then(async (authToken) => {

            if (!authToken) {
                ActivityLogger.info("AUTHTOKEN COOKIE UNAVAILABLE: /sc-admin request attempt", { ip: req.ip, url: req.url, method: req.method });

                res.status(401);
                return res.send(new AppServerResponse(
                    'warning',
                    'Session terminated',
                    '/sc-admin'
                ));
            }

            jwt.verify(authToken, await readOnDisk(path.resolve(__dirname, '..') + '/keys/jwtRS256.key.pub'), (err, decoded) => {
                if (err) {

                    if (err.name === "TokenExpiredError") {
                        /** 
                         * IT'S FINE. KEEP THE ERRORLOGGER HERE. 
                         * IT'S ALREADY CALLED IN THE EXPRESS ERROR HANDLER
                         * PRE-SET IN index.js
                         * 
                         * NO NEED TO TAKE IT OUT OF THE IF BLOCK
                         */
                        ErrorLogger.error(err.message, { ip: req.ip, url: req.url, method: req.method, stacktrace: util.inspect(err, { showHidden: false, depth: null, colors: true }) });


                        res.status(401);
                        return res.send(new AppServerResponse(
                            'warning',
                            'Session terminated',
                            '/sc-admin'
                        ));
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
                    .then(async (matchedUser) => {
                        if (!matchedUser) {
                            ActivityLogger.info(`Admin "${user.username}" failed to log in! Admin not recognize on page load`, { ip: req.ip, url: req.url, method: req.method });

                            res.status(401);
                            return res.send(new AppServerResponse(
                                'warning',
                                'Session terminated',
                                '/sc-admin'
                            ));
                        }

                        ActivityLogger.info(`Admin "${user.username}" found!`, { ip: req.ip, url: req.url, method: req.method });

                        req.authenticateAdmin = user;
                        next();

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


module.exports = {
    adminAuthMiddleware: adminAuthMiddleware,
}