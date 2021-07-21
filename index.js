const express =require('express')
const mongoose = require('mongoose')
const userRouter= require('./route/users')
const emailRouter= require('./route/emails')
const fileUpload = require('express-fileupload')
const morgan = require('morgan');

const cors = require('cors');


const app=express()
// enable files upload
app.use(fileUpload({
  createParentPath: true
}));
app.use(cors({
  origin: ['http://localhost:3000','https://bist-dev.herokuapp.com','https://bistleague.azurewebsites.net','https://bistleague.com']
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
app.use(emailRouter)
const { google }=require('googleapis');
const path = require('path');

const fs = require('fs');

const CLIENT_ID ='711930695819-519njs2qvp0l6iraanc89tt8ietorvl9.apps.googleusercontent.com';
const CLIENT_SECRET ='CuBLjh6U6NW5aKEVxAJ-MAdg';
const REDIRECT_URL= 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN ='1//040isARTu2CXtCgYIARAAGAQSNwF-L9IrVjDLLnhQgzy6Y1s2Ed-AhVH9ted087T8Mglr-wVEr-3hY2Vv04dAqiV3ShqpxkDA1Pc';

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URL
)

oauth2Client.setCredentials({refresh_token: REFRESH_TOKEN})

const drive = google.drive({
    version : 'v3',
    auth : oauth2Client
})
var fileId = '1rVBnP5h--U6ivGut-z_-xqQwp2UGkigg';
var dest = fs.createWriteStream('./uploads/photos.png');
app.get('/test',(req,res)=>{drive.files.get(
  {
    fileId: fileId,
    alt: "media"
  }
).then((result)=>res.send(result.data))});
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