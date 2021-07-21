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


const CLIENT_ID ='711930695819-519njs2qvp0l6iraanc89tt8ietorvl9.apps.googleusercontent.com';
const CLIENT_SECRET ='CuBLjh6U6NW5aKEVxAJ-MAdg';
const REDIRECT_URL= 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN ='1//040isARTu2CXtCgYIARAAGAQSNwF-L9IrVjDLLnhQgzy6Y1s2Ed-AhVH9ted087T8Mglr-wVEr-3hY2Vv04dAqiV3ShqpxkDA1Pc';

const Key_Path ="bist-league-test-1-b30d39fca9f4.json"

const SCOPES =['https://www.googleapis.com/auth/drive'];
const auth = new google.auth.GoogleAuth({
    keyFile: Key_Path,
    scopes: ['https://www.googleapis.com/auth/drive'],
  });

const drive = google.drive({
    version : 'v3',
   auth
})
async function drive_upload(item,body_name,file_name,path){
    return (await drive.files.create({
        requestBody:{
            name: item+'-'+body_name||"unknown",
            
            parents:[folderID]
        },
        media:{
            
            body: fs.createReadStream(path+file_name)
        }

    }))
}
function generateAccessToken(email) {
    return jwt.sign(email, process.env.TOKEN_SECRET, { expiresIn: '50000s' });
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
            institution_name: req.body.institution_name
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
                twibbon1:req.body.twibbon1,
                twibbon2:req.body.twibbon2,
                twibbon3:req.body.twibbon3,
                pop:req.body.pop,
                status:"Registered"
            
            },async (err,result)=>{
            if(err){
                res.status(400).json({
                    status: "FAILED",
                    message: err
                })
            }
            else{
                //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
                const path="./uploads/"
                    try{
                        let ktm_1 = req.files.ktm_1;
                        await ktm_1.mv('./uploads/' + ktm_1.name).then((res,err)=>{
                            drive_upload("KTM",req.body.name_1,ktm_1.name,path).then((response)=>{
                                User.updateOne({email:user.email},{ktm_1:"https://drive.google.com/file/d/"+response.data.id+"/view"}).then((data)=>{
                                fs.unlink(path+ktm_1.name,(err)=>{
                                    if(err){
                                        res.status(500).send(err.message);
                                    }
                                    
                                })    
                                
                                })
                            })
                        })

                    }
                    catch(e){

                    }
                    try{
                        let proof_1=req.files.proof_1;
                        await proof_1.mv('./uploads/' + proof_1.name).then((res,err)=>{
                            drive_upload("PROOF",req.body.name_1,proof_1.name,path).then((response)=>{
                                User.updateOne({email:user.email},{proof_1:"https://drive.google.com/file/d/"+response.data.id+"/view"}).then((data)=>{
                                fs.unlink(path+proof_1.name,(err)=>{
                                    if(err){
                                        res.status(500).send(err.message);
                                    }
                                    
                                })    
                                
                                })
                            })
                        })
                        
                    }
                    catch(e){
                        
                    }
                    try{
                        let photo_1=req.files.photo_1;
                        await photo_1.mv('./uploads/' + photo_1.name).then((res,err)=>{
                            drive_upload("PHOTO",req.body.name_1,photo_1.name,path).then((response)=>{
                                User.updateOne({email:user.email},{photo_1:"https://drive.google.com/file/d/"+response.data.id+"/view"}).then((data)=>{
                                fs.unlink(path+photo_1.name,(err)=>{
                                    if(err){
                                        res.status(500).send(err.message);
                                    }
                                    
                                })    
                                
                                })
                            })
                        })
                        
                    }
                    catch(e){
                        
                    }
                    try{
                        let ktm_2 = req.files.ktm_2;
                        await ktm_2.mv('./uploads/' + ktm_2.name).then((res,err)=>{
                            drive_upload("KTM",req.body.name_2,ktm_2.name,path).then((response)=>{
                                User.updateOne({email:user.email},{ktm_2:"https://drive.google.com/file/d/"+response.data.id+"/view"}).then((data)=>{
                                fs.unlink(path+ktm_2.name,(err)=>{
                                    if(err){
                                        res.status(500).send(err.message);
                                    }
                                    
                                })    
                                
                                })
                            })
                        })

                    }
                    catch(e){

                    }
                    try{
                        let proof_2=req.files.proof_2;
                        await proof_2.mv('./uploads/' + proof_2.name).then((res,err)=>{
                            drive_upload("PROOF",req.body.name_2,proof_2.name,path).then((response)=>{
                                User.updateOne({email:user.email},{proof_2:"https://drive.google.com/file/d/"+response.data.id+"/view"}).then((data)=>{
                                fs.unlink(path+proof_2.name,(err)=>{
                                    if(err){
                                        res.status(500).send(err.message);
                                    }
                                    
                                })    
                                
                                })
                            })
                        })
                        
                    }
                    catch(e){
                        
                    }
                    try{
                        let photo_2=req.files.photo_2;
                        await photo_2.mv('./uploads/' + photo_2.name).then((res,err)=>{
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

                    }
                    
                    try{
                        let ktm_3 = req.files.ktm_3;
                        await ktm_3.mv('./uploads/' + ktm_3.name).then((res,err)=>{
                            drive_upload("KTM",req.body.name_3,ktm_3.name,path).then((response)=>{
                                User.updateOne({email:user.email},{ktm_3:"https://drive.google.com/file/d/"+response.data.id+"/view"}).then((data)=>{
                                fs.unlink(path+ktm_3.name,(err)=>{
                                    if(err){
                                        res.status(500).send(err.message);
                                    }
                                    
                                })    
                                
                                })
                            })
                        })

                    }
                    catch(e){

                    }
                    try{
                        let proof_3=req.files.proof_3;
                        await proof_3.mv('./uploads/' + proof_3.name).then((res,err)=>{
                            drive_upload("PROOF",req.body.name_3,proof_3.name,path).then((response)=>{
                                User.updateOne({email:user.email},{proof_3:"https://drive.google.com/file/d/"+response.data.id+"/view"}).then((data)=>{
                                fs.unlink(path+proof_3.name,(err)=>{
                                    if(err){
                                        res.status(500).send(err.message);
                                    }
                                    
                                })    
                                
                                })
                            })
                        })
                        
                    }
                    catch(e){
                        
                    }
                    try{
                        let photo_3=req.files.photo_3;
                        await photo_3.mv('./uploads/' + photo_3.name).then((res,err)=>{
                            drive_upload("photo",req.body.name_3,photo_3.name,path).then((response)=>{
                                User.updateOne({email:user.email},{photo_3:"https://drive.google.com/file/d/"+response.data.id+"/view"}).then((data)=>{
                                fs.unlink(path+photo_3.name,(err)=>{
                                    if(err){
                                        res.status(500).send(err.message);
                                    }
                                    
                                })    
                                
                                })
                            })
                        })
                        
                    }
                    catch(e){
                        
                    }
                    try{
                        let pop=req.files.pop;
                        await pop.mv('./uploads/' + pop.name).then((res,err)=>{
                            drive_upload("PROOF",req.body.name_1,pop.name,path).then((response)=>{
                                User.updateOne({email:user.email},{pop:"https://drive.google.com/file/d/"+response.data.id+"/view"}).then((data)=>{
                                fs.unlink(path+pop.name,(err)=>{
                                    if(err){
                                        res.status(500).send(err.message);
                                    }
                                    
                                })    
                                
                                })
                            })
                        })
                        
                    }
                    catch(e){
                        
                    }
                    res.sendStatus(200)
                   
            }
            
            
        })
    }
    })
}
}