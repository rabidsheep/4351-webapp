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
const reservation = require("../models/table.model");
const { should, expect } = require("chai");
// Import the exported function definitions from our functions/index.js file

describe("userAuthentication", () => {
  before(async () => {
    let Noah = await auth.createUserWithEmailAndPassword(
      authInst,
      "NoahRGori@gmail.com",
      "testing12"
    );
    uid = Noah.user.uid;
    token = await Noah.user.getIdToken();
  });
  after(() => {
    test.cleanup();
  });
  describe("Get Request", () => {
    before((done) => {
      user.create(
        {
          _id: uid,
          name: "Noah Gori",
          mailing: "test",
          billing: "test",
          preferred: 10,
          points: 10,
          paymentMethod: "test",
          phone: "test",
          email: "test",
        },
        (err) => {
          done();
        }
      );
    });
    after((done) => {
      user.deleteMany({}, () => {
        done();
      });
    });
    it("gets a user's info on login", () => {
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
  });
  describe("Put Request", () => {
    after((done) => {
      user.deleteMany({}, () => {
        done();
      });
    });
    it("Puts a new user into the database", () => {
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
