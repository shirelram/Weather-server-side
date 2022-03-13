const mongoose = require('mongoose')

const adminSchema=mongoose.Schema({
    name:{
        type:String,
        require:true,
        trim:true
    },
    id:{
        type:Number,
        require:true,
        maxlength:9
    },
    phone:{
        type:Number,
        maxlength:10
    },
    salary:{
        type:Number,
    },
    users :[{
        type: mongoose.Schema.Types.ObjectId,ref:'users'
    }]   
})

module.exports=mongoose.model('admins',adminSchema)