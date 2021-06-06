const express =require('express')
const mongoose = require('mongoose')
const userRouter= require('./route/users')

const app=express()
//established mongoose connection
mongoose.connect("mongodb+srv://dbMain:nop4ssword@cluster0.nopmf.mongodb.net/dbMain?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("We are connected")
});
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use(userRouter)


app.listen(process.env.PORT || 5000,function(){
    console.log(`listening to port`)
})