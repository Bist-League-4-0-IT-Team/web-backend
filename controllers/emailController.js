const User =require('../models/users')
var API_KEY = '06b5c3cfb4e5a0458ec53786dd6be151-1f1bd6a9-ab602065';
var DOMAIN = 'admin.bistleague.com';
var mailgun = require('mailgun-js')({apiKey: API_KEY, domain: DOMAIN});
module.exports={
    success : async (req,res)=>{ 
        const user =  await User.findOne({email:req.params.email},(err,result)=>{
            if(result===null){
                res.status(404).json({
                    status: "FAILED",
                    message: "email is not registered"
                })
            }
            
            
        })
         const data = {
                from: 'Admin Bist League <noreply@admin.bistleague.com>',
                to: req.params.email,
                cc:'rahmat.wibowo21@gmail.com,18218029@std.stei.itb.ac.id',
                subject: 'Accepted',
                text: `Dear ${(user.team_name).toUpperCase()},

    Congratulations, your team is successfully registered as one of the participants in BIST League 4.0 Business IT Case Competition. The preliminary case can be accessed at our official website from August 1, 2021.
All further information will be informed through BIST League 4.0’s official Instagram and official website. If you have any questions or need additional information, please don’t hesitate to contact the available contact person.

Alya Mizani (Head of Event)			Leony Angela (Competition Team Leader)
Line ID: alyamizani				Line ID: leonyyangela
WA: 0852 6047 8249				WA: 0821 2368 0227
              
We wish you the best of luck!
              
Regards,
Competition Committee, BIST League 4.0`
              };
              
              mailgun.messages().send(data, (error, body) => {
                res.send(body)
              });
        
        
    
    },
    failed : async (req,res)=>{ 
        const user =  await User.findOne({email:req.params.email},(err,result)=>{
            if(result===null){
                res.status(404).json({
                    status: "FAILED",
                    message: "email is not registered"
                })
            }
            
            
        })
         const data = {
                from: 'Admin Bist League <noreply@admin.bistleague.com>',
                to: req.params.email,
                cc:'rahmat.wibowo21@gmail.com,18218029@std.stei.itb.ac.id',
                subject: 'Rejected',
                text: `Dear ${(user.team_name).toUpperCase()},
              
                Thank you for registering to BIST League 4.0 Business IT Case Competition. We really appreciate your interest and we are grateful for the time and energy you invested in your registration.
                Unfortunately, your team does not fulfill all the registration requirements as stated in the Competition Guidebook so we couldn’t proceed with your registration. Your team will be declared as a resigning team. Our committee member will soon contact the team leader through Whatsapp regarding the refunding process.
                If you have any questions or need additional information, please don’t hesitate to contact the available contact person.
                
                Alya Mizani (Head of Event)			Leony Angela (Competition Team Leader)
                Line ID: alyamizani				Line ID: leonyyangela
                WA: 0852 6047 8249				WA: 0821 2368 0227
                
                We appreciate your time and wish you the best of luck!
                
                Regards,
                Competition Committee, BIST League 4.0                
              `
              };
              
              mailgun.messages().send(data, (error, body) => {
                res.send(body)
              });
        
        
    
    }
}