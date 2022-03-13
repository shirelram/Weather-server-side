const Admin=require('../models/adminModel')
const User=require('../models/userModel')
const userController=require('../controllers/userController')


const createAdmin= async (req,res) =>{
    try {
    const newAdmin=new Admin(req.body)
    const usersArr=await User.find()
    let newArrId=[]
    for(let i in usersArr){
        newArrId.push(usersArr[i]._id)
    }
    newAdmin.users=newArrId
    const admin= await newAdmin.save()
   
    res.status(200).json({
        message:"sucsses create Admin",
        newAdmin: admin
    })
    }catch(err){
        res.status(400).json({
            errmessage: err.message
        })
    }
}


const deleteUserByUserId= async (req,res) =>{
    try{
        const {adminId,userId}=req.params
        
        const user=await User.findById(userId)
        const admin=await Admin.findByIdAndUpdate(adminId,{$pull:{users:userId}},{new:true})
        await user.remove()
        if (admin){
            res.status(200).json({ NewAdmin :admin})
         }
        else{
            res.status(400).send("admin Not Found")
        }
        
    }catch(err){
        res.status(500).send(err.message)
    }
}

module.exports={
    createAdmin,
    deleteUserByUserId
}

