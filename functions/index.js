const functions = require("firebase-functions");
const admin = require("firebase-admin");

const express = require("express");
const cors = require("cors")({ origin: true });
const api = express();
api.use(express.json());
api.use(cors);


const serviceHours = [
    "9:00am", "10:00am", "11:00am",
    "12:00pm", "1:00pm", "2:00pm",
    "3:00pm", "4:00pm", "5:00pm",
    "6:00pm", "7:00pm", "8:00pm"
]

const mongoDb = require('./db');

admin.initializeApp();

// MongoDb + Mongoose
const mongoDb = require("./db");
mongoDb().catch((error) => console.log(error));

//Models
const reservation = require("./models/reservation.model");
const table = require("./models/table.model");
const user = require("./models/user.model");

const app = admin.initializeApp({ projectId: "webapp-f22de" });

function table_combo(array, num, partial = [], available = []) {
  var sum = 0;
  for (var i = 0; i < partial.length; i++) {
    sum += partial[i].size;
  }
  if (sum === num) {
    return available.indexOf([partial]) === -1
      ? available.concat([partial])
      : available;
  }
  if (sum > num) {
    return;
  }
  for (var i = 0; i < array.length; i++) {
    n = array[i];
    var remaining = array.slice(i + 1);
    //console.log("Remaining: ", remaining)
    var result = table_combo(remaining, num, partial.concat([n]), available);
    if (typeof result !== "undefined") {
      available = result;
    }
  }
  return available;
}

api.put("/reservations", (req, res) => {
  return reservation
    .create({
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      date: req.body.date,
      tables: req.body.tables,
    })
    .then((data) => {
      console.log(data);
      return res.status(200).send("API call returned successfully");
    })
    .catch((error) => {
      if (error.code == 11000) {
        return res
          .status(400)
          .send("It looks like you already have a reservation on that date.");
      }
      console.log(error);
      res.status(400).send(error);
    });
});

api.get("/tables/available", (req, res) => {
  //Fetches the tables that are already reserved for that day
  return reservation
    .find({ date: req.body.date })
    .select("tables -_id")
    .exec((err, docs) => {
      if (err) {
        return res.status(400).send(err);
      }
      // Converts retrieved documents to id values
      var booked = [];
      for (var i = 0; i < docs.length; i++) {
        for (var j = 0; j < docs[i].tables.length; j++) {
          booked.push(docs[i].tables[j]._id);
        }
      }
      //Fetches all table combos that can accomadate the num of guests up to size 5 greater than num guests
      return table.find({ _id: { $nin: booked } }).exec((err, docs) => {
        if (err) {
          return res.status(400).send(err);
        }
        var num = req.body.num;
        for (var i = 0; i < 5; i++) {
          var available = table_combo(docs, num + i);
          if (typeof available !== "undefined") {
            return res.status(200).send("" + available[available.length - 1]);
          }
        }
      });
    });
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
  return admin
    .auth()
    .verifyIdToken(req.body.idToken)
    .then((decodedToken) => {
      return user
        .findOne({ _id: decodedToken.uid })
        .then((doc) => {
          if (!doc) {
            throw "Can't find that user";
          }
          return res.status(200).send(doc);
        })
        .catch((error) => {
          throw error;
        });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).send(error);
    });
});

api.put("/user/register", (req, res) => {
  return admin
    .auth()
    .verifyIdToken(req.body.idToken)
    .then((decodedToken) => {
      return user
        .create({
          _id: decodedToken.uid,
          name: req.body.firstname + " " + req.body.lastname,
          mailing: req.body.mailing,
          billing: req.body.billing,
          preferred: req.body.preferred,
          points: req.body.points,
          paymentMethod: req.body.paymentMethod,
          phone: req.body.phone,
          email: req.body.email,
        })
        .then((data) => {
          return res.status(200).send("API call returned successfully");
        })
        .catch((error) => {
          if (error.code == 11000) {
            return res
              .status(400)
              .send("Looks like we already have an account");
          }
          return res.status(400).send(error);
        });
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

api.get("/user/info", (req, res) => {
  // api call to get customer info -- might not be necessary?
});

exports.api = functions.https.onRequest(api);
