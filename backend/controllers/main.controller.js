const UserModel = require("../models/user");
const version = "v1";
const logger = require("../logger");
const fs = require('fs');
const path = require('path');


function wrapAsync(fn) {
    return function(req, res, next) {
        fn(req, res, next).catch(e => next(e));
    }
}


// En user.controller.js
exports.getMainPage = function(req, res) {
    const filePath = path.resolve(__dirname, '../../frontEnd/public/main.html');
    res.sendFile(filePath);
};

exports.getContactPage = function(req, res) {
    const filePath = path.resolve(__dirname, '../../frontEnd/public/contact.html');
    res.sendFile(filePath);
};


