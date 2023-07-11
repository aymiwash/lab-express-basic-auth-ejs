const router = require("express").Router();
const {isLoggedIn, isLoggedOut} = require("../middlewares/route-guard.middleware")

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});


//GET profile page when user logged in
router.get("/profile",isLoggedIn , (req, res, next)=>{
  res.render("profile", {user : req.session.currentUser})
})

router.get('/main',isLoggedIn, (req,res)=>{
  res.render("main")

})

router.get('/private',isLoggedIn, (req,res)=>{
  res.render("private")
})


module.exports = router;
