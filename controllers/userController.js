const User=require('../models/userModel')
const Admin=require('../models/adminModel')
const Weather=require('../models/weatherModel')
const jwt = require('jsonwebtoken')
const { findByIdAndUpdate, findById } = require('../models/weatherModel')

const createUser= async (req,res) =>{
    try {  
    const {name,password}=req.body
    const finduser=await User.findOne({name:name,password:password})
    console.log(finduser+" "+name+" "+password)
    if(finduser){
        res.status(400).json({
        message:"user is already exists",
        })
    }else{
    const newUser=new User(req.body)
    const user= await newUser.save()
    await Admin.updateMany({},{$push:{users:user._id}})
    const token = jwt.sign({ name: user.name , password : user.password }, process.env.SECRET_JWT)
    
    res.status(200).json({
        message:"sucsses create user",
        token: token,
        userId: user._id
    })
    }}catch(err){
        res.status(500).json({
            errmessage: err.message
        })
    }
}



// const loginJwt=(req,res)=>{
//     console.log(req.params.name)
//     console.log(req.params.password)
  
//     const token = jwt.sign({ name: req.params.name , password : req.params.password }, process.env.SECRET_JWT)
//     res.status(200).json({ message: 'create token', token: token })
// }

const loginUser= async (req,res) =>{
    try {
    const {name,password}=req.params
    const user=await User.findOne({name:name,password:password})
    if (user){
        const token = jwt.sign({ name: user.name , password : user.password }, process.env.SECRET_JWT)
        res.status(200).json({newtoken: token , userId: user._id })
    }else{
        res.status(400).json('user not found')
    }
    }catch(err){
        res.status(500).json({errmessage: err.message})
    }
}

const getWeathersByUserId=async (req,res)=>{
    try{
        console.log(req.params.userId)
        const weathers=await User.findById(req.params.userId).populate('weathers')
        if (weathers){
            res.status(200).json({ weathers:weathers})
         }
        else{
            res.status(400).send("User Not Found")
        }
    }catch(err){
        res.status(500).send(err.message)
    }
}

const deleteWeatherByIdWeather= async (req,res)=>{
    try{
        const {userId,weatherId}=req.params
        const weather=await Weather.findById(weatherId)
        const user=await User.findByIdAndUpdate(userId,{$pull:{weathers:weatherId}},{new:true})
        await weather.remove()
        if (user){
            res.status(200).json({ newUser :user})
         }
        else{
            res.status(400).send("User Not Found")
        }
        
    }catch(err){
        res.status(500).send(err.message)
    }
}

module.exports={
    createUser,
    loginUser,
    getWeathersByUserId,
    deleteWeatherByIdWeather
}

