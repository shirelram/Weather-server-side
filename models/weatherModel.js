const mongoose = require('mongoose')
const Float = require('mongoose-float').loadType(mongoose);
const User=require('../models/userModel')

const weatherSchema=mongoose.Schema({

    city: { type: String },
    main: {
        temp: { type: Float },
        feels_like: { type: Float },
        temp_min: { type: Float },
        temp_max: { type: Float },
        pressure: { type: Float },
        humidity: { type: Float },
    },
    wind: {
        speed: { type: Float },
        deg: { type: Float },
        gust: { type: Float }
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" }

})

// weatherSchema.pre('remove', async function (next) {
//     try{
//         console.log("pre remove weather!!!")
//         await User.findByIdAndUpdate(this.userId, { $pull: { weathers:this.weatherId } })
//         next()
//     }
//     catch(err){
//         console.log(err)
//     } 
// })

module.exports=mongoose.model('weathers',weatherSchema)