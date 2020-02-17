const express = require("express");
const app = express();
const cors = require("cors");
const bcrypt = require("bcrypt");
const knex = require('knex');


const db = knex({
   client: 'pg',
   connection: {
     host : '127.0.0.1',
     user : 'leono',
     password : 'LTalfredo1!',
     database : 'smart-brain'
   }
 });


const database ={
   user :[
      {
         id : "123",
         name : "John",
         email: "john@gmail.com",
         password: "lala",
         entries: 0,
         joined: new Date()
      },
      {
         id : "124",
         name : "Sally",
         email: "sally@gmail.com",
         password: "bananas",
         entries: 0,
         joined: new Date()
      }
   ]
}

//middleware
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cors());

//Routes

app.get("/",(req,res)=>{
   res.send(database.user)
})

app.post("/signin",(req, res)=>{
      console.log(req.body.email," : ", req.body.password)
      if(req.body.email === database.user[0].email &&
         req.body.password === database.user[0].password){
         res.json(database.user[0]);
      }
      else{
         res.status(400).send("Usuario Incorrecto!");
      }
      
})

app.post("/register", (req,res)=>{
   const { name,email,password} = req.body;
   const hash = bcrypt.hashSync(password);
   return db('users')
   .returning('*')
   .insert(
      {name:name,
      email:email,
      joined: new Date()
      })
      
      .then(user => {
         res.json(user[0]);
      })
      .catch(err => res.status(400).json("Unable to register"))

})

app.get("/profile/:id", (req, res)=>{
   console.log(req.params);
   const { id } = req.params;
   
   db.select('*')
   .from('users')
   .where({
      id:id
   })   
   .then( user =>{
      if (user.length){
         res.json(user[0])
      }
      else{
         res.status(400).json('User not found')
      }
   })
   .catch(err => res.status(400).json('Error getting user'))
   // if(!found){
   //    res.status(404).json("User not found");
   // }
})

app.put("/image", (req,res)=>{
   const { id } = req.body;
   db('users').where('id', '=' , id)
   .increment('entries', 1)
   .returning('entries')
   .then(entries => {
      res.json(entries[0]);
   })
   .catch(err => res.status(400).json('unable to get entries'))
})

app.listen(3001, ()=>{
   console.log("Running fine on port 3001!");
})