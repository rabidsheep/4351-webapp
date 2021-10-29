const functions = require("firebase-functions");
const admin = require("firebase-admin");

const express = require("express");
const cors = require("cors")({ origin: true });
const api = express();
api.use(cors);

admin.initializeApp();

api.put("/reservations", (req, res) => {
    /*var customer = req.body.customer;
    var payment = req.body.payment;
    var billing = req.body.billing;
    var reservation = req.body.reservation;*/
    console.log(req.body);

    return res.status(200).send("API call returned successfully");
});

api.get("/traffic", (req, res) => {
    // api call for determining high traffic days?
});

api.get("/user/login", (req, res) => {
    // api call for logging in users
});

api.put("/user/register", (req, res) => {
    // api call for saving user registration
});

api.get("/user/info", (req, res) => {
    // api call to get customer info -- might not be necessary?
});

exports.api = functions.https.onRequest(api);