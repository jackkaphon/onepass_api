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
    ConPassword: req.body.ConPassword,
    Imgurl: req.body.Imgurl,
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


app.post('/registerstore', async (req, res) => {
 
  const user = db.collection("shop")
  var docData = {
    Name: req.body.Name,
    TimeOpen: req.body.TimeOpen,
    OpenDay: req.body.OpenDay,
    Address: req.body.Address,
    Contact: req.body.Contact,
    Imgurl: req.body.Imgurl,
    OwnerID: req.body.OwnerID
    

  }
  user.doc().set(docData).then(() => {
    console.log("success")
  })
  
  // res.send(req.data)
  res.send("done")

})


app.post('/registerUser', async (req, res) => {
  const user = db.collection("user")
  var docData = {
    Fname: req.body.Fname,
    Lname: req.body.Lname,
    Gender: req.body.Gender,
    DoB: req.body.DoB,
    Address: req.body.Address,
    Password: req.body.Password,
    ConPassword: req.body.ConPassword,
    Imgurl: req.body.Imgurl,
    

  }
 user.doc(req.body.Phone).set(docData).then(() => {

    console.log("success")
  })

  const member = db.collection("member")
  var docmem ={
    MemberID: req.body.Phone,
    OwnerID: req.body.OwnerID
  }
  member.doc().set(docmem).then(() => {

    console.log("success")
  })

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

app.post('/getMember', async (req, res) => {
  var docRef = await db.collection("member").get();
  var newArray = []
  var owner_id = req.body.userPhone

  docRef.forEach((row) => {
    if(row.data().OwnerID === owner_id){
      newArray.push(row.data())
    }
  })

  var memRef = await db.collection("user")
  var memList = []

  for(const row of newArray){
    const contents = await memRef.doc(row.MemberID).get()
    memList.push(contents.data())
  }

  res.send(memList)
})

app.post('/getStores', async (req, res) => {
  var owner_id = req.body.owner_id
  var docRef = await db.collection("shop").get()
  var newArray = []

  docRef.forEach((row) => {
    if(row.data().OwnerID === owner_id){
      newArray.push(row.data())
    }
  })

  res.send(newArray)
})

app.get('/getAllStores', async (req, res) => {
  var docRef = await db.collection("shop").get()
  var newArray = []

  docRef.forEach((row) => {
      newArray.push(row.data())
  })
  res.send(newArray)
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

app.post('/getUserTimeLine', async (req, res) => {
  var userPhone = req.body.userPhone
  var docRef = await db.collection("Time").get()
  var newArray = []

  docRef.forEach((row) => {
    if(row.data().userPhone === userPhone){
      newArray.push(row.data())
      //console.log(row.data().timestamp.toString())
    }
      
  })

  res.send(newArray)
})



app.get('/checkin/:shopOwnerID/:shopname/:userPhone', async (req, res) => {
  //const userPhone = req.params.userPhone

  var docRef = await db.collection("Time")
  var timestamp = new Date()

  //console.log(timestamp.toString())

  var docData = {
    shopOwnerID: req.params.shopOwnerID,
    shopname: req.params.shopname,
    userPhone: req.params.userPhone,
    timestamp: timestamp
    

  }
  docRef.doc().set(docData).then(() => {


    console.log("success")
  })
  res.send('your in')

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

app.post('/addmember', (req, res) => {
    var docRef = db.collection("user").doc(req.body.Phone);
    

})





app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.listen(process.env.PORT || port)