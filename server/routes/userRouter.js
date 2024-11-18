const router = require('express').Router();
const User = require('../models/userModel')
const bcrypt = require('bcrypt');
const { raw } = require('express');
const jwt = require('jsonwebtoken');
router.get('/register', (req, res) => {
    res.send("Hi I am fron register")
})
router.post("/register", async (req, res) => {
    try {
        var emailExist = await User.findOne({ email: req.body.email });
        if (emailExist) {
            return res.status(400).json("email already exist");
        }
        var hash = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hash
        });
        
        var data = await user.save();
        res.status(200).json(data);
    } catch (err) {
        console.log(err);
        res.status(500).json("Server error");
    }
});

router.post("/login", async (req, res) => {
    try {
        var userData = await User.findOne({ email: req.body.email });
        if (!userData) {
            return res.status(400).json("user not found");
        }
        var validpassword = await bcrypt.compare(req.body.password, userData.password);
        if (!validpassword) {
            return res.status(400).json("password not match");
        }
        var userToken = jwt.sign({ email: req.body.email, password: req.body.password }, 'msblogjsonwebtoken');
        console.log(userToken)
        res.header('auth', userToken).send(userToken);
    } catch (err) {
        console.log(err);
        res.status(500).json("Server error");
    }
});
// middleware  add the token 
const validUser = (req, res, next) => {
    var token = req.header('auth');
    req.token = token;
    next();
}

router.get('/getAll', validUser, async (req, res) => {
    jwt.verify(req.token, 'msblogjsonwebtoken', async (err, decoded) => {
        if (err) {
            return res.sendStatus(403);
        } else {
            const users = await User.find(); 
            res.json(users);
        }
    });
});



module.exports = router