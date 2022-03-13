const Weather=require('../models/weatherModel')
const User=require('../models/userModel')
const jwt = require('jsonwebtoken')
const request= require('request')
const { resolve, reject } = require('bluebird')
const { response } = require('express')
const { receiveMessageOnPort } = require('worker_threads')

const requestApi=(city)=>{
    const option= {
        method:"get",
        url:'https://api.openweathermap.org/data/2.5/weather?q='+city+'&lang=he&appid=0505f0b91e7c763b62968aa886ef0fc9' 
    }
    return new Promise((resolve, reject)=>{
             request(option,(err,response,body)=>{
                resolve(JSON.parse(body));
                reject(err);
            })
    })
}

const createWeatherByCity= async (req,res) =>{
    try {
    // console.log(req.headers['authorization'] +','+ req.params.city)
    const { userId, city } = req.params
    const token = jwt.verify(req.headers['authorization'], process.env.SECRET_JWT)
    const data = await requestApi(city)
    let weather=''
    let user='' 
    if(data.message!='city not found') {
    const newWeather=new Weather({
        city: city, main: data.main, wind: data.wind, userId: userId
    })
    
    weather= await newWeather.save()
    user= await User.findByIdAndUpdate(userId,{$push:{weathers:weather._id}},{new:true})
} 
   if (user){
    res.status(200).json({
        message:"sucsses create Weather",
        newWeather: weather,
        user:user
    })
    }else{
        res.status(200).json({ message:"City Not Found"})
    }}catch(err){
        res.status(500).send(err.message)
    }
}

module.exports={
    createWeatherByCity
}

