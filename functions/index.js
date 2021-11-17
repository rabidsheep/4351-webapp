const functions = require("firebase-functions");
const admin = require("firebase-admin");

const express = require("express");
const cors = require("cors")({ origin: true });
const api = express();
api.use(cors);

const serviceHours = [
    "9:00am", "10:00am", "11:00am",
    "12:00pm", "1:00pm", "2:00pm",
    "3:00pm", "4:00pm", "5:00pm",
    "6:00pm", "7:00pm", "8:00pm"
]

const mongoDb = require('./db');

admin.initializeApp();

api.put("/reservations", (req, res) => {
    /*var customer = req.body.customer;
    var payment = req.body.payment;
    var billing = req.body.billing;
    var reservation = req.body.reservation;*/
    console.log(req.body);

    return res.status(200).send("API call returned successfully");
});

api.get("/times", (req, res) => {
    // we'll need to go back and add something to figure out
    // how to determine available times by table size
    const dateAggregate = [
        { $match: { 
            'date': req.query.date
        } },
        { $group: {
            '_id': '$date',
            'times': { $addToSet: '$time' }
        } }
    ]

    return mongoDb()
    .then((client) =>
        client.db("4351")
        .collection("reservations")
        .aggregate(dateAggregate)
        .toArray()
    )
    .then((data) => {
        var availableTimes = [];

        if (data[0]) {
            let filledTimes = data[0].times;
            availableTimes = serviceHours.filter(hour => 
                !filledTimes.includes(hour));
        } else {
            availableTimes = serviceHours;
        }

        return res.status(200).send(availableTimes);
    })
    .catch((error) => res.status(400).send(error.toString()))
})

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