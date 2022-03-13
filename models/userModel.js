const { reject } = require('bluebird');
const mongoose = require('mongoose')
const nodemailer = require('nodemailer');
const { resolve } = require('path/posix');
const Weather=require('../models/weatherModel')
const Admin=require('../models/adminModel')

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const userSchema=mongoose.Schema({
    name:{
        type:String,
        require:true,
        trim:true
    },
    password:{
        type:Number,
        maxlength:4
    },
    email:{
        type: String,
        trim: true,
        lowercase: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
        //unique: true,
    },
    phone:{
        type:Number,
        maxlength:10
    },
    weathers :[{
        type: mongoose.Schema.Types.ObjectId,ref:'weathers'
    }]
    
})

const sendEmail =(sendTo) =>{
    return new Promise((resolve,reject)=>{
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'shirel012.012@gmail.com',
              pass: process.env.PASS
            }
          });
          
          const mailOptions = {
            from: 'shirel012.012@gmail.com',
            to: sendTo,
            subject: 'New User',
            text: 'ברוכים הבאים'
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
    })
}


userSchema.post('save', function (next) {
        console.log("post save!!!")
        sendEmail(this.email).then(resolve =>{
            console.log('Email sent ')
            next()
        }).catch(error=>{
            console.log(error)})
        
})

userSchema.pre('remove', async function (next) {
  try{
      console.log("pre remove user!!!")
      await Weather.deleteMany({ _id: { $in: this.weathers } })
      await Admin.updateMany({},{ $pull: { users:this._id } })
      next()
  }
  catch(err){
      console.log(err)
  } 
})

module.exports=mongoose.model('users',userSchema)