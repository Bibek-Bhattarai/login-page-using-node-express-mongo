const express=require('express')
const mongoose=require('mongoose')
const path = require('path')
const bodyParser= require('body-parser') 
//const bcrypt =require('bcryptjs')
const passport=require('passport')
const config = require('./config/database');

mongoose.connect(config.database);
const db=mongoose.connection

//checking connection
db.once('open',()=>{
    console.log('Connection to database established...')
})
//checking errors
db.on('error',()=>{
    console.log('Error occured',error)
})

//Init app
const app=express()

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//home page
app.get('/',(req,res)=>{
    res.render('home')
})

let User=require('./models/user')

//register form
app.get('/users/register',(req,res)=>{
    res.render('register')
})

// Passport Config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Register post
app.post('/users/register',(req,res)=>{
    let name=req.body.name
    let email=req.body.email
    let username=req.body.username
    let password=req.body.password

    let newUser=new User({
        name:name,
        email:email,
        username:username,
        password:password
    })
    newUser.save(err => {
        if (err) {
            console.log('Error ', err)
        }
        else {

            res.redirect('login')
        }
    })

    // bcrypt.getSalt(10,(err,salt)=>{
    //     bcrypt.hash(newUser.password,salt,(err,hash)=>{
    //         if(err){
    //             console.log(err)
    //         }
    //         newUser.password=hash
    //         newUser.save(err=>{
    //             if(err){
    //                 console.log('Error ',err)
    //             }
    //             else{
                     
    //                 res.redirect('login')
    //             }
    //         })
          
    //     })
        
    // })

  
})


// login form
app.get('/users/login',(req,res)=>{
    res.render('login')
})

// Login Process
app.post('/users/login', function(req, res, next){
    passport.authenticate('local', {
      successRedirect:'/',
      failureRedirect:'/users/login',
       
    })(req, res, next);
  });

//checking login credentials
// app.post('/users/login',(req,res)=>{
//     let usr=JSON.stringify(req.body.user)
//     User.find(usr,(err,user)=>{
//         console.log(user)
//     })
    
   
     
//     //console.log(users.find({user:usr}))
    
     
// })


//Starting server
app.listen(3000,()=>{
    console.log('Server started at port 5000....')
})
