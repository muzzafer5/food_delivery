const db = require('../models')
const { Op, fn, col } = require('sequelize')

const User = db.User
const Menu = db.Menu
const Order = db.Order
const Restaurant = db.Restaurant

function purchase(req, res){
    let authId = req.user._id
    let dishId = req.body.dishId
    User.findOne({
        where : {authId : authId}
    }).then(user=>{
        let userId = user.dataValues.id  
        let balance = user.dataValues.cashBalance
        Menu.findByPk(dishId).then(dish=>{
            let restaurantId = dish.dataValues.restaurantId;
            let price = dish.dataValues.price
            if(price > balance){
                return res.status(422).json("Insufficient balance");
            }
            else{
                Order.create({
                    transactionAmount : price,
                    userId : userId,
                    restaurantId : restaurantId,
                    dishId : dishId
                }).then(async order=>{
                    balance = balance - price;
                    User.update({cashBalance : balance}, {where : {id : userId}}).then(updatedUser=>{
                        return res.status(201).json("success")
                    }).catch(async err=>{
                        await order.destroy()
                        return res.status(400).json(err);
                    })
                }).catch(err => {
                    console.log(err)
                    return res.status(400).json(err);
                })
            }
        }).catch(err => {
            console.log(err)
            return res.status(400).json(err);
        })
    }).catch(err => {
        console.log(err)
        return res.status(400).json(err);
    })
}

module.exports = {purchase}