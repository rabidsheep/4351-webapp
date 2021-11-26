const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { devMode } = require("./CloudConfig");

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
const { ObjectId } = require("bson");
admin.initializeApp();


const maxGuests = 54;
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
    var n = array[i];
    var remaining = array.slice(i + 1);
    //console.log("Remaining: ", remaining)
    var result = table_combo(remaining, num, partial.concat([n]), available);
    if (typeof result !== "undefined") {
      available = result;
    }
  }
  return available;
}

/*****************
** RESERVATIONS **
*****************/

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
      payment: req.body.payment,
      numGuests: req.body.numGuests,
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
    .find({ email: req.query.email })
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

/**********
** TIMES **
**********/

// Takes a date = YEAR-MM-DD and num = num of guest and returns object with key = hour and value = a bool of availability
api.get("/times", (req, res) => {

  time = new Date(req.query.date);
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


/***********
** TABLES **
***********/

// Takes date and gets all tables reserved for that hour
api.get("/tables", (req, res) => {
  return reservation
  .find({date: req.body.date})
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
  var char;

  switch(req.body.size) {
    case 2:
      char = 'A';
      break;
    case 4:
      char = 'B';
      break;
    case 6:
      char = 'C';
      break;
    case 8:
      char = 'D';
  }

  return table
  .count({ size: req.body.size })
  .exec()
  .then((count) => {
    let tid = char + count;
    return table
    .create({
      size: req.body.size,
      tid: tid
    })
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

  var guests = parseInt(req.query.guests);
  var date = new Date(req.query.date);
  var time = req.query.time;

  const tablesAggregate = [
    { $match: {
      date: date,
      time: time
    } },
    { $group: {
      _id: null,
      tables: { $addToSet: "$tables" },
      totalGuests: { $sum: "$numGuests" }
    } },
    { $project: {
      _id: 0,
      tables: { $reduce: {
        input: "$tables",
        initialValue: [],
        in: { $setUnion: ["$$value", "$$this"] }
      } },
      totalGuests: "$totalGuests",
    } }
  ]

  
  //Fetches the tables that are already reserved for that day
  return reservation
    .aggregate(tablesAggregate)
    .exec()
    .then((booked) => {
      if (booked.length > 0) {
        if (booked[0].totalGuests >= 46 || booked[0].totalGuests + guests > 46) {
          return res.status(200).send({ combos: [], selectable: [] });
        } else {
          return table.find({ tid: { $nin: booked[0].tables } }).sort('tid').exec();
        }
      } else {
        return table.find().sort('tid').exec();
      }
    })
    .then((tables) => {
      var selectable = [];
      var combos = [];
      for (var j = 0; j < 5; j++) {
        var available = table_combo(tables, guests + j);
        if (available.length > 0) {
          available.forEach((combo) => {
            if (combo.length > 1) {
              let tids = combo.map((table) => table.tid);
              combos.push(tids);
            } else {
              combos.push([combo[0].tid])
            }
          })

          tables.filter(table => !selectable.includes(table.tid)).map(table => selectable.push(table.tid))
          return res.status(200).send({ combos, selectable });
        }
      }
      return res.status(200).send({ combos, selectable });
    })
    .catch((error) => res.status(400).send(error));
});


/************
** TRAFFIC **
************/

// Send it a month and it will reply with a boolean array of days that have num of reservations > threshold
const threshold = 2;
api.get("/traffic", (req, res) => {
  let current = new Date(new Date(req.query.current).setUTCHours(24,0,0,0));
  let next = new Date(new Date(req.query.next).setUTCHours(24,0,0,0));

  const trafficAggregate = [
    { $match: {
      date: {
        $gte: current,
        $lt: next,
      }
    } },
    { $group: {
      _id: "$date" ,
      reservations: { $sum: 1 }
    }}
  ]

  return reservation
    .aggregate(trafficAggregate)
    .exec()
    .then((docs) => {
      let days = docs.length > 0 ? 
        docs.filter(doc => doc.reservations >= threshold).map(doc => doc._id.toISOString().substr(0, 10)) :
        [];
      return res.status(200).send(days)
    })
    .catch((error) => res.status(400).send(error));
});




/**********
** USERS **
**********/

// Takes id token from firebase auth and return database information for that user
api.get("/user", (req, res) => {
  var data = req.query;
  console.log(data);
  
  admin
  .auth()
  .verifyIdToken(data.token)
  .then((decodedToken) => user.findOne({ uid: decodedToken.uid }).exec() )
  .then((doc) => {
    console.log(doc);
    return res.status(200).send(doc)
  })
  .catch((error) => {
    console.log(error);
    return res.status(400).send(error);
  });
});

// Takes id token and relevant information and returns success or failure
api.post("/user", (req, res) => {
  var data = req.body.data;

  var account = {
    uid: data.uid,
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone,
    email: data.email,
    mailing: data.mailing,
    billing: data.billing,
    dinerId: new ObjectId().toString(),
    points: 0
  };
  
  if (data.paymentMethod !== null) {
    account = { ...account, paymentMethod: data.paymentMethod };
  }
  
  admin
  .auth()
  .verifyIdToken(req.body.token)
  .then(() => user.create(account))
  .then((data) => {
    console.log(data);
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
