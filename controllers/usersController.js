const bcrypt = require('bcrypt');
const saltRounds = 10;
const User =require('../models/users')
const fs = require('fs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// get config vars
dotenv.config();
function generateAccessToken(email) {
    return jwt.sign(email, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
  }
  function authenticateToken(req, res) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    let result;
  
    if (token == null) result={email:null,status:401}

  
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
  
      if (err) {result= {email:null,status:403}}

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
            institusion_name: req.body.institusion_name,
            participants_data: req.body.participants_data,
            password: encryptedPassword,
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
            if(err){
                res.status(400).json({
                    status: "FAILED",
                    message: "email is not registered"
                })
            }
            
            
        })
        const comparison = await bcrypt.compare(password, user.password)
                if(!comparison){
                    res.status(400).json({
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
        const data= await authenticateToken(req,res);
        if(data.status==200){
        const user =  await User.findOne({email:data.email},(err,result)=>{
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
            
            
        })}
    else{
        res.status(data.status)
    }
}
}