

const firebase = require("firebase-admin")
const service = require("./key.json")




const app = {
  credential: firebase.credential.cert(service),
  apiKey: "AIzaSyAfr-4P9jN743VorYSlhhRo5aBwtaeH0KM",
  authDomain: "myapp-report.firebaseapp.com",
  databaseURL: "https://myapp-report-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "myapp-report",
  storageBucket: "myapp-report.appspot.com",
  messagingSenderId: "488757629796",
  appId: "1:488757629796:web:9c88aa112b27c1d1cc2071",
  measurementId: "G-4Q10ZYHC2Y"
}

firebase.initializeApp(app)

const db = firebase.firestore();
const auth = firebase.auth();

module.exports = {
  db: db,
  auth: auth
  //otherMethod: function() {},
}

// const fireDB = app.firestore();
// const user = fireDB.collection("user")

// module.exports = user;

// var firedbaseDB = firebase.database()

// //module.exports = app;
// firedbaseDB.ref("user").set("jenny")

// var playersRef = app.database().ref("players/");

