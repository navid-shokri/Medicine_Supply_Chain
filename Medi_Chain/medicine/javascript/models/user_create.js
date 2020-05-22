
var express = require('express');
var router = express.Router();
var enrollAdmin = require('./functions/enrollAdmin');
var registerUser = require('./functions/registerUser');
var query = require('./functions/query');
var invoke= require('./functions/invoke');
var createUser= require('../routes/functions/createUser');
var queryUser = require('../routes/functions/queryUser');
var bcrypt=require('bcrypt')
var csrf = require('csrf');
var csrfProtection=csrf();



var app=require("../app");
var loginRouter = require('./login');

router.use('/login', loginRouter);
//router.use(csrfProtection);

function makeid(length) {
   var result = '';
   var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for (var i = 0; i < length; i++) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
 }
 function enc_password(pass){
   return bcrypt.hashSync(pass,bcrypt.genSaltSnc(6),null);
}; 



/*router.get('/', function(req, res,next){
   res.render('signup');
});

router.post('/register',  async function(req, res,next){
   try{
   var   id= req.body.id;  
var name = req.body.name; 
var email =req.body.email; 
var pass = req.body.password; 

var phone =req.body.phone; 
var userType =req.body.userType; 

var key = makeid(15);

     await createUser(key, id,name,email, pass, phone,userType);

     res.send('Successfully registered');

   //console.log("You have been succesfully registered.");
   }catch(error) {
      //res.status(error.response.status)
      return res.send(error.message);
   }

});
*/
router.get('/', function(req, res,next){
    res.render('signup');
    //res.render('signup',{csrfToken: req.csrfToken()});
 });
 
 router.post('/', async function(req, res,next){
    try{
   if(!req.body.email || !req.body.password){
       res.status("400");
       res.send("Invalid details!");
    } 
   else {
     var result = await queryUser(req.body.email);
     const obj = JSON.parse(result);
     var x= obj.Password;
     console.log(obj.Name);
      if(obj.Email === req.body.email){
             res.render('signup', {
                message: "User Already Exists! Login or choose another user Email"});
          }
      else{
        
var   id= req.body.id;  
var name = req.body.name; 
var email =req.body.email; 
var pass=req.body.password;
//var pass = bcrypt.hashSync(req.body.password, 10);

var phone =req.body.phone; 
var userType =req.body.userType; 

var key = makeid(15);

     await createUser(key, id,name,email, pass, phone,userType);

   console.log("You have been succesfully registered.");
   
  req.session.name = obj.Name;
   req.session.id = obj.NID;
   res.redirect('/login');
   
      }
   
    }
   }catch(error) {
      //res.status(error.response.status)
      return res.send(error.message);
   }

 });


 module.exports = router;
