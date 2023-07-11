const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});


//GET profile page when user logged in
router.get("/profile", (req, res)=>{
  res.render("profile", {user : req.session.currentUser})
})




module.exports = router;
