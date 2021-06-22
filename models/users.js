const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    email: {
        type :String,
        required: true,
        unique:true
    },
    team_name: {
        type :String,
        required: true,
        unique:true
    },
    password: {
        type :String,
        required: true
    },
    institusion_name: {
        type :String,
        required: true
    },
    name_1:{
        type :String
            
    },
    major_1:{
        type :String
    },
    batch_1:{
        type:Number
    },
    phone_1:{
        type:String
    },
    email_1:{
        type:String
    },
    linkedin_1:{
        type: String
    },
    id_line_1:{
        type: String
    },
    proof_1:{
        type: String
    },
    ktm_1:{
        type:String
    },
    photo_1:{
        type: String
    },
    name_2:{
        type :String
            
    },
    major_2:{
        type :String
    },
    batch_2:{
        type:Number
    },
    phone_2:{
        type:String
    },
    email_2:{
        type:String
    },
    linkedin_2:{
        type: String
    },
    id_line_2:{
        type: String
    },
    proof_2:{
        type: String
    },
    ktm_2:{
        type:String
    },
    photo_2:{
        type: String
    },
    name_3:{
        type :String
            
    },
    major_3:{
        type :String
    },
    batch_3:{
        type:Number
    },
    phone_3:{
        type:String
    },
    email_3:{
        type:String
    },
    linkedin_3:{
        type: String
    },
    id_line_3:{
        type: String
    },
    proof_3:{
        type: String
    },
    ktm_3:{
        type:String
    },
    photo_3:{
        type: String
    }
    
    
},{timestamps:true});

const User = mongoose.model('User',userSchema)

module.exports= User 