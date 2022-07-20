const express = require('express')
const {db, auth} = require('./firebase_con')
const app = express()
const bodyParser = require('body-parser')
const port = 3002


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', async (req, res) => {
  // var user = doc(db, "users", FirebaseAuth.instance.currentUser.uid)

  auth.listUsers().then(data=>{
    console.log(data.users)
})
  // res.send('hello')


  // await user.add({
  //   name: 'Jen',
  //   age: 21,
  // })


  //await user.doc("Rzs6W3iK0BLu0Xf3AH9I").set({name:"jen"})


  //await user.doc("Rzs6W3iK0BLu0Xf3AH9I").update({name:"lalita", age: 20 })
  
  // await user.doc("Rzs6W3iK0BLu0Xf3AH9I").delete()


  res.send('Save done uuuu')
  //   res.send(firebase)
})

app.post('/refresh', async (req, res) => {
    res.send(req.body.phone)
  
})

app.post('/register', async (req, res) => {
  const user = db.collection("user")
  var docData = {
    Fname: req.body.Fname,
    Lname: req.body.Lname,
    Gender: req.body.Gender,
    DoB: req.body.DoB,
    Address: req.body.Address,
    Password: req.body.Password,
    ConPassword: req.body.ConPassword, //owner status
  }

 user.doc(req.body.Phone).set(docData).then(() => {
    console.log("success")
  })
  // user.doc("12345678").set(docData).then(() => {
  //   console.log("success")
  // })

  // await user.add({
  //   Fname: req.body.Fname,
  //   Lname: req.body.Lname,
  //   Gender: req.body.Gender,
  //   DoB: req.body.DoB,
  //   Address: req.body.Address,
  //   // //Phone: req.body.Phone,
  //   Password: req.body.Password,
  //   ConPassword: req.body.ConPassword,
  //   // Img: req.body.Img,
  // })

  res.send(req.body.Phone)

})

// app.get('/listMember', async (req, res) => {
 
//   const user = firebase.collection("user")
//   await user.SetDataSource({
//     Fname: res.body.Fname,
//     Lname: res.body.Lname,
//     Gender: res.body.Gender,
//     DoB: res.body.DoB,
//     Address: res.body.Address,
//     Password: res.body.Password,
//     ConPassword: res.body.ConPassword,
  
//   })

//   res.send(res.body)

// })
app.post('/login', async (req, res) => {
    const phone = req.body.Phone;
    const password = req.body.Password;
    var docRef = db.collection("user").doc(phone)

    docRef.get().then((doc) => {
        if (doc.exists) {
            if(doc.data().Password === password){
                res.send({
                    status:'2',
                    userInfo: doc.data()
                })
            }else{
                res.send({status:'1'})
            }
        } else {
            res.send({status: '0'})
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
})

// app.post('/login', async (req, res) => {
//   const  user = firebase.collection("user")
//   const Phone = req.body.Phone
//   const Password = req.body.Password
//   await user.send({
    


//   })
// })

// app.post("/savedata/", function(req){
//     firebase.saveData(req.body,function(err,data))
// })
// assign value to the particular refrence.

app.get('/data', async (req, res) => {
  // var docRef = firebase.collection("user").doc("XCt1E3OZPx90hUzDzUXZ");
  var docRef = db.collection("user");

  docRef.get().then((doc) => {
      // if (doc.exists) {
      //     console.log("Document data:", doc.data());
      // } else {
      //     // doc.data() will be undefined in this case
      //     console.log("No such document!");
      // }
      
      doc.forEach((row) => {
        console.log(row.data())

      })
  }).catch((error) => {
      console.log("Error getting document:", error);
  });
  res.send("success")
  // res.send(req.body.doc)
  // console.log(docRef)
})

app.post('/getUserInfo', async (req, res) => {
    const userPhone = req.body.userPhone

    var docRef = db.collection("user").doc(userPhone)

    docRef.get().then((doc) => {
        if (doc.exists) {
            res.send(doc.data())
        } else {
            console.log("No user info")
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });

})



app.get('/home', async(req, res) => {

  const Fname = req.body.Fname
  console.log(Fname)

  db.collection("user").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} `);
        console.log('Name:', doc.data().Fname);
        console.log('Lastname:', doc.data().Lname);
    });

  
  

  // var docRef = firebase.collection("user")
  

  // docRef.get().then((doc) => {
  //     // if (doc.exists) {
  //     //     console.log("Document data:", doc.data());
  //     // } else {
  //     //     // doc.data() will be undefined in this case
  //     //     console.log("No such document!");
  //     // }
      
  //     doc.forEach((row) => {
  //       // console.log(row.data(Fname))
  //       // res.send("success")
  //       console.log(row.data().docData(Fname))

  //     })
  }).catch((error) => {
      console.log("Error getting document:", error);
  });
  res.send("success")
})

app.post('/checkuser', async (req, res) => {
  var docRef = db.collection("user").doc(req.body.Phone);

  docRef.get().then((doc) => {
      if (doc.exists) {
          res.send('yes')
      } else {
          
          res.send('no')
        //   console.log(req.body.Phone)
      }
  }).catch((error) => {
      console.log("Error getting document:", error);
  });
})


app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.listen(process.env.PORT || port)
