const jwt = require('jsonwebtoken')
const Auth = require('../models').Auth
const SECRET_KEY = 1

module.exports = (req,res,next)=>{
    const {authorization} = req.headers
    if(!authorization){
       return res.status(401).json({error:"you must be logged in"})
    }
    const token = authorization
    jwt.verify(token,SECRET_KEY,(err,payload)=>{
        if(err){
            console.log(err)
            return res.status(401).json({error:"you must be logged in"})
        }
        else{
            req.user = payload
            next()
        }        
    })
}