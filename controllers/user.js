const db = require('../models');

const User = db.User;
const Menu = db.Menu;
const Order = db.Order;

function purchase(req, res){

    let authId = req.user._id; //user auth id
    let dishId = req.body.dishId;
    if(!dishId){
        return res.status(400).json({error : "invalid dish id"});
    }
    dishId = parseInt(dishId)
    if (isNaN(dishId)) {
        return res.status(400).json({ error: "invalid dish id"});
    }

    User.findOne({
        where : {authId : authId}
    }).then(user=>{
        let userId = user.dataValues.id;
        let balance = user.dataValues.cashBalance;
        Menu.findByPk(dishId).then(dish=>{
            if(dish){
                let restaurantId = dish.dataValues.restaurantId;
                let price = dish.dataValues.price;
                if (price > balance) {
                    return res.status(422).json("Insufficient balance");
                }
                else {
                    Order.create({
                        transactionAmount: price,
                        userId: userId,
                        restaurantId: restaurantId,
                        dishId: dishId
                    }).then(async order => {
                        balance = balance - price;
                        User.update({ cashBalance: balance }, { where: { id: userId } }).then(updatedUser => {
                            return res.status(201).json(order);
                        }).catch(async err => {
                            await order.destroy();
                            return res.status(500).json(err);
                        })
                    }).catch(err => {
                        return res.status(500).json(err);
                    })
                }
            }
            else{
                return res.status(400).json({ error: "invalid dish id" });
            }
        }).catch(err => {
            return res.status(400).json(err);
        })
    }).catch(err => {
        return res.status(400).json(err);
    })
}

module.exports = {purchase}