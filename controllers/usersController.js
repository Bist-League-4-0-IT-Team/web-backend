const bcrypt = require('bcrypt');
const saltRounds = 10;
const User =require('../models/users')
const fs = require('fs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// get config vars
dotenv.config();

const { google }=require('googleapis');
const path = require('path');
const folderID = '17cfgNSm6_ogJShRxdkwRj41yoS4KiKFP';


const CLIENT_ID ='711930695819-1si951n2lepqf916te2moj29pff4ful7.apps.googleusercontent.com';
const CLIENT_SECRET ='3sRus-ASXXBkF-uKf6Yxslt4';
const REDIRECT_URL= 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN ='1//04UvSgW4s2MHeCgYIARAAGAQSNwF-L9IrWyrijqjhQAHbS8igBboaQLe3pXsXit-8BVdswUZQbVqcYR-He047mSRnuhWI3OqFCjM';

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
async function drive_upload(item,body_name,file_name,path){
    return (await drive.files.create({
        requestBody:{
            name: item+'-'+body_name,
            
            parents:[folderID]
        },
        media:{
            
            body: fs.createReadStream(path+file_name)
        }

    }))
}
function generateAccessToken(email) {
    return jwt.sign(email, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
  }
  async function authenticateToken(req, res) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    let result;
  
    if (token == null) result={email:null,status:401}

  
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
  
      if (err) {result= {email:null,status:403}}
      console.log(user)

      result = {email:user.email,status:200}

    })
    return result
  }
module.exports ={
    
    create: async (req,res)=>{
        const password = req.body.password;    
        const encryptedPassword = await bcrypt.hash(password, saltRounds)
        const user =new User({
            email:req.body.email,
            team_name: req.body.team_name,
            password: encryptedPassword,
            institusion_name: req.body.institusion_name
        })
        await user.save((err,result)=>{
                if(err){
                    res.status(400).json({
                        status: "FAILED",
                        message: err
                    })
                }
                else{
                    res.status(200).json({
                        status:"SUCCESS",
                        message:"User Successfully created",
                        data:result
                    })
                }
            })

      
    },
    login: async (req,res)=>{
        const password = req.body.password;    
        const user =  await User.findOne({email:req.body.email},(err,result)=>{
            if(result===null){
                res.status(404).json({
                    status: "FAILED",
                    message: "email is not registered"
                })
            }
            
            
        })
        const comparison = await bcrypt.compare(password, user.password)
                if(!comparison){
                    res.status(401).json({
                        status: "FAILED",
                        message: "email and password didn't match"
                    })  
                }
                else{
                    const token = generateAccessToken({ email: req.body.email });
                    res.status(200).json({
                        status: "SUCCESS",
                        message: "user is successfully login",
                        token:token
                    })
                }

      
    },
    get : async (req,res)=>{
        
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(',')[0]
          
        if (token == null) res.sendStatus(401)

    
        jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    
        if (err) {res.sendStatus(403)}

        else{
            User.findOne({email:user.email},(err,result)=>{
                if(err){
                    res.status(400).json({
                        status: "FAILED",
                        message: "email is not registered"
                    })
                }
                else{
                    res.status(200).json({
                        status: "SUCCESS",
                        data:result
                    })
                }
                
                
            })
        }
        })
},

completeReg : async (req,res)=>{
        
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(',')[0]
      
    if (token == null) res.sendStatus(401)


    jwt.verify(token, process.env.TOKEN_SECRET, async (err, user) => {

    if (err) {res.sendStatus(403)}

    else{
        User.updateOne({email:user.email},
            {
                name_1:req.body.name_1,
                major_1:req.body.major_1,
                batch_1:req.body.batch_1,
                phone_1:req.body.phone_1,
                email_1:req.body.email_1,
                linkedin_1:req.body.linkedin_1,
                id_line_1:req.body.id_line_1,
                name_2:req.body.name_2,
                major_2:req.body.major_2,
                batch_2:req.body.batch_2,
                phone_2:req.body.phone_2,
                email_2:req.body.email_2,
                linkedin_2:req.body.linkedin_2,
                id_line_2:req.body.id_line_2,
                name_3:req.body.name_3,
                major_3:req.body.major_3,
                batch_3:req.body.batch_3,
                phone_3:req.body.phone_3,
                email_3:req.body.email_3,
                linkedin_3:req.body.linkedin_3,
                id_line_3:req.body.id_line_3,
            
            },async (err,result)=>{
            if(err){
                res.status(400).json({
                    status: "FAILED",
                    message: "email is not registered"
                })
            }
            else{
                //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
                try{
                    let ktm_1 = req.files.ktm_1;
                    let proof_1=req.files.proof_1;
                    let photo_1=req.files.photo_1;
                    ktm_1.mv('./uploads/' + ktm_1.name);
                    proof_1.mv('./uploads/' + proof_1.name);
                    photo_1.mv('./uploads/' + photo_1.name);
                    let ktm_2 = req.files.ktm_2;
                    let proof_2=req.files.proof_2;
                    let photo_2=req.files.photo_2;
                    ktm_2.mv('./uploads/' + ktm_2.name);
                    proof_2.mv('./uploads/' + proof_2.name);
                    photo_2.mv('./uploads/' + photo_2.name);
                    let file_3=true;
                    try{
                        let ktm_3 = req.files.ktm_3;
                    let proof_3=req.files.proof_3;
                    let photo_3=req.files.photo_3;
                    ktm_3.mv('./uploads/' + ktm_3.name);
                    proof_3.mv('./uploads/' + proof_3.name);
                    photo_3.mv('./uploads/' + photo_3.name);
                    }
                    catch(e){
                        file_3=true
                    }
                    
                    const path='./uploads/';
                    const upload_type=['KTM','PROOF','PHOTO']

                    try{
                        drive_upload("KTM",req.body.name_1,ktm_1.name,path).then((response)=>{
                            User.updateOne({email:user.email},{ktm_1:"https://drive.google.com/file/d/"+response.data.id+"/view"}).then((data)=>{
                            fs.unlink(path+ktm_1.name,(err)=>{
                                if(err){
                                    res.status(500).send(err.message);
                                }
                                
                            })    
                            
                            })
                        })
                        drive_upload("KTM",req.body.name_2,ktm_2.name,path).then((response)=>{
                            User.updateOne({email:user.email},{ktm_2:"https://drive.google.com/file/d/"+response.data.id+"/view"}).then((data)=>{
                            fs.unlink(path+ktm_2.name,(err)=>{
                                if(err){
                                    res.status(500).send(err.message);
                                }
                                
                            })    
                            
                            })
                        })
                        drive_upload("PROOF",req.body.name_1,proof_1.name,path).then((response)=>{
                            User.updateOne({email:user.email},{proof_1:"https://drive.google.com/file/d/"+response.data.id+"/view"}).then((data)=>{
                            fs.unlink(path+proof_1.name,(err)=>{
                                if(err){
                                    res.status(500).send(err.message);
                                }
                                
                            })    
                            
                            })
                        })
                        drive_upload("PROOF",req.body.name_2,proof_2.name,path).then((response)=>{
                            User.updateOne({email:user.email},{proof_2:"https://drive.google.com/file/d/"+response.data.id+"/view"}).then((data)=>{
                            fs.unlink(path+proof_2.name,(err)=>{
                                if(err){
                                    res.status(500).send(err.message);
                                }
                                
                            })    
                            
                            })
                        
                        drive_upload("PHOTO",req.body.name_1,photo_1.name,path).then((response)=>{
                            User.updateOne({email:user.email},{photo_1:"https://drive.google.com/file/d/"+response.data.id+"/view"}).then((data)=>{
                            fs.unlink(path+photo_1.name,(err)=>{
                                if(err){
                                    res.status(500).send(err.message);
                                }
                                
                            })    
                            
                            })
                        })
                        drive_upload("PHOTO",req.body.name_2,photo_2.name,path).then((response)=>{
                            User.updateOne({email:user.email},{photo_2:"https://drive.google.com/file/d/"+response.data.id+"/view"}).then((data)=>{
                            fs.unlink(path+photo_2.name,(err)=>{
                                if(err){
                                    res.status(500).send(err.message);
                                }
                                
                            })    
                            
                            })
                        })
                        
                    
                    
                    })
                }
                    catch (e){
                        res.status(500).send(e.message);

                    }
                }
                catch(err){
                    res.status(500).send(err);
                }
                res.sendStatus(200)
                
                
            }
            
            
        })
    }
    })
}
}