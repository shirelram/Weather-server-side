const user=require('../controllers/userController')
const weather=require('../controllers/weatherController')
const admin=require('../controllers/adminController')
const express=require('express')
const router=express.Router()

router.post('/createUser',user.createUser)
router.post('/loginUser/:name/:password',user.loginUser)
router.get('/getWeathersByUserId/:userId',user.getWeathersByUserId)
router.delete('/deleteWeatherByIdWeather/:userId/:weatherId',user.deleteWeatherByIdWeather)


router.get('/createWeatherByCity/:userId/:city',weather.createWeatherByCity)

router.post('/createAdmin',admin.createAdmin)
router.delete('/deleteUserByUserId/:adminId/:userId',admin.deleteUserByUserId)

module.exports=router