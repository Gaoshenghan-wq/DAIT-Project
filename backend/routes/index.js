var express = require('express');
var router = express.Router();

const { generateToken } = require('../utils/auth');
const { connectToDB, ObjectId} = require("../utils/db");
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* test connection */
router.post('/login', async function (req, res, next) {
  const db = await connectToDB();
  try {
    // check if the user exists
    var user = await db.collection("users").findOne({ email: req.body.email });
    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }
    if(user.password != req.body.password) {
      res.status(401).json({ message: 'Password is incorrect' });
      return;
    }
    console.log(user)
    // res.json(user);

    delete user.password;
    delete user.ip_address;

    // generate a JWT token
    const token = generateToken(user);

    // return the token
    res.json({ token: token });
    
  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    await db.client.close();
  }
});

router.post('/register', async function (req, res, next) {
  const db = await connectToDB();
  try {
    const existingUser = await db.collection("users").findOne({ email: req.body.email });
    if (existingUser) {
      res.status(409).json({ message: 'Email already exists' });
      return;
    }

    const newUser = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      gender: req.body.gender,
      ip_address: req.ip, 
      password: req.body.password
    };

    const result = await db.collection("users").insertOne(newUser);
    newUser._id = result.insertedId;

    const token = generateToken(newUser);

    delete newUser.password;

    res.json({ token: token, user: newUser });

  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    await db.client.close();
  }
});


module.exports = router;
