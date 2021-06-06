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
       
    },
    participants_data:[
        {name:{
            type :String
            
        },
        major:{
            type :String
        },
        batch:{
            type:Number
        },
        phone:{
            type:String
        },
        email:{
            type:String
        },
        linkedin:{
            type: String
        },
        id_line:{
            type: String
        }
    }]
    
},{timestamps:true});

const User = mongoose.model('User',userSchema)

module.exports= User 