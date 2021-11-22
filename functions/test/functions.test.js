const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const { FIREBASE_API_KEY } = require("../CloudConfig");
const admin = require("firebase-admin");
const test = require("firebase-functions-test")();
//Models
const myFunctions = require("../index");

const firebase = require("firebase/app");
const auth = require("firebase/auth");

const testApp = firebase.initializeApp(
  { projectId: "webapp-f22de", apiKey: FIREBASE_API_KEY },
  "test"
);
const authInst = auth.getAuth(testApp);
auth.connectAuthEmulator(authInst, "http://localhost:9099");

const user = require("../models/user.model");
const table = require("../models/table.model");
const reservation = require("../models/reservation.model");
const { should, expect } = require("chai");
const { ObjectId } = require("bson");
// Import the exported function definitions from our functions/index.js file

describe("Table", () => {
  before(() => {
    return table
      .create([{ size: 2 }, { size: 2 }, { size: 2 }, { size: 2 }, { size: 2 }])
      .then((docs) => {
        return reservation.create({
          name: "Noah",
          phone: "test",
          email: "test",
          date: new Date(2021, 0, 1, 20),
          tables: [docs[0], docs[1], docs[2]],
        });
      });
  });
  after(() => {
    return table.deleteMany({}).then(() => {
      return reservation.deleteMany({});
    });
  });
  it("GET /tables", () => {
    return chai
      .request(myFunctions.api)
      .get("/tables")
      .send({ date: new Date(2021, 0, 1, 20) })
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body[0]).to.have.property(
          "name",
          "Noah",
          "Incorrect Name on reservation"
        );
        expect(res.body[0].tables.length).to.be.equal(
          3,
          "Incorrect Number of tables"
        );
      });
  });
  it("PUT /tables", () => {
    return chai
      .request(myFunctions.api)
      .put("/tables")
      .send({ size: 3 })
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("size", 3);
      });
  });
  it("DELETE /tables", () => {
    return chai
      .request(myFunctions.api)
      .delete("/tables")
      .send({ size: 3 })
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.equal(
          "Deleted table of size: 3",
          "Wrong response message"
        );
      });
  });
  it("GET /tables/available", () => {
    return chai
      .request(myFunctions.api)
      .get("/tables/available")
      .send({ date: new Date(2021, 0, 1, 20), num: 3 })
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("available");
        expect(res.body.available.length).to.equal(2);
        expect(res.body.available[0]).to.have.property("size", 2);
      });
  });
});

describe("GET /traffic", () => {
  before(() => {
    return reservation
      .create([
        {
          name: "Noah",
          phone: "test",
          email: "test",
          date: new Date(2021, 0, 1),
          tables: [{ size: 2 }],
        },
        {
          name: "Noah",
          phone: "test",
          email: "test2",
          date: new Date(2021, 0, 1),
          tables: [{ size: 2 }],
        },
        {
          name: "Noah",
          phone: "test",
          email: "test2",
          date: new Date(2021, 0, 2),
          tables: [{ size: 2 }],
        },
      ])
      .catch((err) => {
        console.log(err);
      });
  });
  after(() => {
    return reservation.deleteMany({});
  });
  it("GET Traffic", () => {
    return chai
      .request(myFunctions.api)
      .get("/traffic")
      .send({ date: new Date(2021, 0, 5) })
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body[0]).to.equal(true);
        expect(res.body[1]).to.equal(false);
      });
  });
});

describe("GET /times", () => {
  before(() => {
    return table
      .create([{ size: 2 }, { size: 2 }, { size: 2 }, { size: 2 }])
      .then((docs) => {
        reservation
          .create({
            name: "Noah",
            phone: "test",
            email: "test",
            date: new Date(2021, 0, 1, 20),
            tables: docs,
          })
          .catch((err) => {
            console.log(err);
          });
      });
  });
  after(() => {
    return table.deleteMany({}).then(() => {
      reservation.deleteMany({});
    });
  });
  it("Response: 200", () => {
    time = new Date(2021, 0, 1, 0);
    return chai
      .request(myFunctions.api)
      .get("/times")
      .send({ date: time, num: 4 })
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body[0]).to.equal(true, "First time slot not available");
        expect(res.body[11]).to.equal(false, "Last time slot not unavailable");
      });
  });
});

describe("Reservation", () => {
  before(() => {
    return reservation.deleteMany({});
  });
  after(() => {
    return reservation.deleteMany({});
  });
  it("PUT /reservations", () => {
    firstName = "Noah";
    lastName = "Gori";
    phone = "555-555-5555";
    email = "test@gmail.com";
    date = new Date();
    tables = [{ _id: new ObjectId(), size: 2 }];
    paymentMethod = {
      name: "test",
      number: "test",
      expirationDate: new Date(),
      billing: "test",
    };
    return chai
      .request(myFunctions.api)
      .put("/reservations")
      .send({
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        email: email,
        date: date,
        tables: tables,
        payment: paymentMethod,
      })
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("id");
      });
  });
  it("GET /reservations", () => {
    return chai
      .request(myFunctions.api)
      .get("/reservations")
      .send({
        email: email,
      })
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body[0]).to.have.property("_id");
        expect(res.body[0].phone).to.equal(phone);
      });
  });
  it("DELETE /reservations", () => {
    return chai
      .request(myFunctions.api)
      .delete("/reservations")
      .send({
        email: email,
        phone: phone,
      })
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.equal("Reservation canceled!");
      });
  });
});

describe("User Authentication", () => {
  before(() => {
    return auth
      .createUserWithEmailAndPassword(
        authInst,
        "NoahRGori@gmail.com",
        "testing12"
      )
      .then((userC) => {
        uid = userC.user.uid;
        return userC.user
          .getIdToken()
          .then((idToken) => {
            token = idToken;
          })
          .catch((err) => {
            throw err;
          });
      })
      .catch((err) => {
        console.log(err);
      });
  });
  after(() => {
    test.cleanup();
  });
  describe("User Exists", () => {
    before(() => {
      return user
        .create({
          _id: uid,
          name: "Noah Gori",
          mailing: "test",
          billing: "test",
          preferred: 10,
          points: 10,
          paymentMethod: "test",
          phone: "test",
          email: "test",
        })
        .catch((err) => {
          console.log(err);
        });
    });
    after(() => {
      return user.deleteMany({}).catch((err) => {
        console.log(err);
      });
    });
    it("GET /user/login", () => {
      return chai
        .request(myFunctions.api)
        .get("/user/login")
        .send({ idToken: token })
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.deep.equal({
            _id: uid,
            name: "Noah Gori",
            mailing: "test",
            billing: "test",
            preferred: 10,
            points: 10,
            paymentMethod: "test",
            phone: "test",
            email: "test",
            reservations: [],
            __v: 0,
          });
        });
    });
    it("DELETE /user", () => {
      return chai
        .request(myFunctions.api)
        .delete("/user")
        .send({ idToken: token })
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.text).to.equal("Account deleted!")
        });
    });
  });
  describe("PUT /user/register", () => {
    after(() => {
      return user.deleteMany({}).catch((err) => {
        console.log(err);
      });
    });
    it("Response: 200", () => {
      return chai
        .request(myFunctions.api)
        .put("/user/register")
        .send({
          idToken: token,
          name: "Noah Gori",
          mailing: "test",
          billing: "test",
          preferred: 10,
          points: 10,
          paymentMethod: "test",
          phone: "test",
          email: "test",
        })
        .then((res) => {
          expect(res).to.have.status(200);
        });
    });
  });
});
