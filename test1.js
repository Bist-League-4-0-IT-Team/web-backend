const { google }=require('googleapis');
const path = require('path');

const fs = require('fs');

const CLIENT_ID ='711930695819-1si951n2lepqf916te2moj29pff4ful7.apps.googleusercontent.com';
const CLIENT_SECRET ='3sRus-ASXXBkF-uKf6Yxslt4';
const REDIRECT_URL= 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN ='1//04V0smG87HADOCgYIARAAGAQSNwF-L9IrvZzJtRXXbKxa4aVlr8w_W4L0ZrtzSjuXNurBvdpiPFKxILmDgsPoj4Rb2T-9ta2-C6c';

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
drive.files.get(
  {
    fileId: fileId,
    alt: "media"
  },
  { responseType: "stream" },
  function(err, { data }) {
    data
      .on("end", () => {
        console.log("Done");
      })
      .on("error", err => {
        console.log("Error during download", err);
      })
      .pipe(dest);
  }
);