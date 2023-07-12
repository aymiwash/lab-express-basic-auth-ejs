const router = require("express").Router();
const bcrypt = require('bcryptjs');
const User = require("../models/User.model");
const e = require("express");


//GET to acces signup page
router.get("/signup", (req, res) => {
    res.render("auth/signup");
})

//POST to get all new user info from the form and store it in DB
router.post("/signup", async (req, res) => {
    //Makin a copy of the request body {username: "blabla", password: "123"}
    const payload = { ...req.body }

    //Deleting the password from the payload copy so we dont show it
    delete payload.password

    //generatiing a SALT to use it in "hashSync()" method to encrypt our pw
    const salt = bcrypt.genSaltSync(13)

    //encrypting the current password (from req.body) and asign it to a new property matching our data
    payload.passwordHash = bcrypt.hashSync(req.body.password, salt)

    try {
        const newUser = await User.create(payload)
        res.redirect("/")
    } catch (error) {
        console.log(error);
    }
})

router.get("/login", (req, res) => {
    res.render("auth/login");
})

router.post("/login", async (req, res) => {
    const currentUser = req.body;
    const errorMessage = "Unknown user or password"
    
    //session from user logged in
    console.log('SESSION =====> ', req.session)

    try {
        const checkedUser = await User.findOne({ username: currentUser.username })

        if (checkedUser) {
            //if the user exist in DB
            //use "compareSync" to compare a string with an encrypted string
            if(bcrypt.compareSync(currentUser.password, checkedUser.passwordHash )){
            
                const loggedUser = {...checkedUser._doc}
                delete loggedUser.passwordHash
                req.session.currentUser = loggedUser
                console.log(req.session);
                res.redirect("/profile")
            }
            else{
                res.render("auth/login", {username : currentUser.username, errorMessage})
            }
        } 
        else {
            //if user does not exist in DB
            console.log("unknown user");
            res.render("auth/login", {username : currentUser.username, errorMessage})
        }
    }
    catch (error) {
        console.log(error);
    }
})



module.exports = router;
