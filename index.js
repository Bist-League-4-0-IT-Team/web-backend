const express =require('express')
const mongoose = require('mongoose')
const userRouter= require('./route/users')
const fileUpload = require('express-fileupload')
const morgan = require('morgan');

const cors = require('cors');


const app=express()
// enable files upload
app.use(fileUpload({
  createParentPath: true
}));
app.use(cors({
  origin: 'http://localhost:3000'
}));
app.use(morgan('dev'));
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
app.get('/', (req, res) => res.send('Hello World!'))
app.post('/upload-avatar', async (req, res) => {
  try {
      if(!req.files) {
          res.send({
              status: false,
              message: 'No file uploaded'
          });
      } else {
          //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
          let avatar = req.files.avatar;

          
          //Use the mv() method to place the file in upload directory (i.e. "uploads")
          avatar.mv('./uploads/' + avatar.name);

          //send response
          res.send({
              status: true,
              message: 'File is uploaded',
              data: {
                  name: avatar.name,
                  mimetype: avatar.mimetype,
                  size: avatar.size
              }
          });
      }
  } catch (err) {
      res.status(500).send(err.message);
  }
});
app.listen(process.env.PORT || 5000,function(){
    console.log(`listening to port`)
})