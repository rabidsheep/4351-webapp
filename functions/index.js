const functions = require("firebase-functions");
const admin = require("firebase-admin");

const async = require("async");
const express = require("express");
const cors = require("cors")({ origin: true });
const api = express();
api.use(express.json());
api.use(cors);

// MongoDb + Mongoose
const mongoDb = require("./db");
mongoDb().catch((error) => console.log(error));

//Models
const reservation = require("./models/reservation.model");
const table = require("./models/table.model");
const user = require("./models/user.model");

admin.initializeApp({ projectId: "webapp-f22de" });

const serviceHours = [
  "9:00am", "10:00am", "11:00am",
  "12:00pm", "1:00pm", "2:00pm",
  "3:00pm", "4:00pm", "5:00pm",
  "6:00pm", "7:00pm", "8:00pm"
]

// Function for finding optimal set of tables to accomadate a certain number of guests
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

// Takes date and gets all tables reserved for that hour
api.get("/tables", (req, res) => {
  return reservation
  .find({date: new Date(req.body.date)})
  .select('name tables')
  .exec()
  .then((docs) => {
    return res.status(200).send(docs);
  }).catch((err)=> {
    return res.status(400).send(err);
  })
});
// Takes size and creates a table in database
api.put("/tables", (req, res) => {
  return table.create({
    size: req.body.size
  }).then((data) => {
    return res.status(200).send(data);
  }).catch((err) => {
    return res.status(400).send(err);
  })
});
// Takes size and deletes a table from database
api.delete("/tables", (req, res) => {
  return table.deleteOne({size: req.body.size}).then(() => {
    return res.status(200).send("Deleted table of size: " + req.body.size)
  }).catch((err) => {
    return res.status(400).send(err);
  })
});

// Takes date and num of guests and responds with the table combination that can accomodate the group
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
        for (var j = 0; j < 5; j++) {
          var available = table_combo(docs, num + j);
          if (available.length > 0) {
            return res.status(200).send({available: available[available.length - 1]});
          }
        }
        return res.status(400).send("No tables available");
      });
    });
});

// Send it a month and it will reply with a boolean array of days that have num of reservations > threshold
const threshold = 2;
api.get("/traffic", (req, res) => {
  today = new Date(req.body.date);
  daysInMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  ).getDate();
  var calls = [];
  for (let i = 1; i < daysInMonth; i++) {
    calls.push((callback) => {
      reservation
        .find({
          date: {
            $gte: new Date(today.getFullYear(), today.getMonth(), i),
            $lt: new Date(today.getFullYear(), today.getMonth(), i + 1),
          },
        })
        .exec()
        .then((docs) => {
          if (docs.length >= threshold) {
            callback(null, true);
          } else {
            callback(null, false);
          }
        })
        .catch((err) => {
          callback(err, null);
        });
    });
  }
  return async.parallel(calls, (err, results) => {
    if (err) {
      return res.status(400).send(err);
    }
    return res.status(200).send(results);
  });
});
// Takes a date = YEAR-MM-DD and num = num of guest and returns object with key = hour and value = a bool of availability
api.get("/times", (req, res) => {
  time = new Date(req.body.date);
  var proms = [];
  for (let i = 9; i < 21; i++) {
    proms.push((callback) => {
      var hour = i;
      return reservation
        .find({ date: time.setHours(hour) })
        .select("tables -_id")
        .exec()
        .then((docs) => {
          var booked = [];
          for (var i = 0; i < docs.length; i++) {
            for (var j = 0; j < docs[i].tables.length; j++) {
              booked.push(docs[i].tables[j]._id);
            }
          }
          return booked;
          //Fetches all table combos that can accomadate the num of guests up to size 5 greater than num guests
        })
        .then(async (booked) => {
          return table
            .find({ _id: { $nin: booked } })
            .exec()
            .then((docs) => {
              var num = req.body.num;
              var total = 0;
              for (var h = 0; h < docs.length; h++) {
                total = total + docs[h].size;
                if (total >= num) {
                  return callback(null, true);
                }
              }
              return callback(null, false);
            })
            .catch((err) => {
              callback(err, null);
            });
        })
        .catch((err) => {
          callback(err, null);
        });
    });
  }
  return async.parallel(proms, (err, results) => {
    if (err) {
      return res.status(400).send(err);
    }
    return res.status(200).send(results);
  });
});

// Takes name, phone, email, date, tables and creates a reservation in the data base then responds with success or fail
api.put("/reservations", (req, res) => {
  return reservation
    .create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
      email: req.body.email,
      date: req.body.date,
      time: req.body.time,
      tables: req.body.tables,
      payment: req.body.payment
    })
    .then((data) => {
      return res.status(200).send({id: data._id});
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

// Takes an email and returns the reservations associated with that email
api.get("/reservations", (req, res) => {
  return reservation
    .find({ email: req.body.email })
    .exec()
    .then((docs) => {
      return res.status(200).send(docs);
    })
    .catch((err) => {
      return res.status(400).send(err);
    });
});

// Takes an email and phone number and deletes reservation from database
api.delete("/reservations", (req, res) => {
  return reservation.deleteOne({ email: req.body.email, phone: req.body.phone }, (err) => {
    if (err) {
      return res.status(400).send("Unable to delete reservation");
    }
    return res.status(200).send("Reservation canceled!");
  });
});

// Takes id token from firebase auth and return database information for that user
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

// Takes id token and relevant information and returns success or failure
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
    })
    .catch((error) => {
      return res.status(400).send(error);
    });
});

// Takes id token and deletes user from database
api.delete("/user", (req, res) => {
  return admin
    .auth()
    .verifyIdToken(req.body.idToken)
    .then((decodedToken) => {
      return user.deleteOne({ _id: decodedToken.uid }, (err) => {
        if (err) {
          return res.status(400).send("Unable to delete account");
        }
        return res.status(200).send("Account deleted!");
      });
    });
});
exports.api = functions.https.onRequest(api);
