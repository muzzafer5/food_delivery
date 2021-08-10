const db = require('../models');

const User = db.User;
const Menu = db.Menu;
const Order = db.Order;

async function purchase(req, res){

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
        Menu.findByPk(dishId).then(async dish=>{
            if(dish){
                let restaurantId = dish.dataValues.restaurantId;
                let price = dish.dataValues.price;
                console.log(balance);
                if (price > balance) {
                    return res.status(422).json("Insufficient balance");
                }
                else {

                    // creating transaction for user purchasing dish
                    const orderTransaction = await db.sequelize.transaction()
                    try{

                        //either it will run whole transaction or none -> atomicity

                        let order = await Order.create({
                            transactionAmount: price,
                            userId: userId,
                            restaurantId: restaurantId,
                            dishId: dishId
                        }, { transaction: orderTransaction});
                        
                        balance = balance - price;

                        await user.update({ cashBalance: balance }, { transaction: orderTransaction});
                        await orderTransaction.commit();
                        console.log(user)
                        return res.status(201).json(order);

                    } catch (err) {
                        await orderTransaction.rollback();
                        console.log(err);
                        return res.status(500).json(err);
                    }
                    // Order.create({
                    //     transactionAmount: price,
                    //     userId: userId,
                    //     restaurantId: restaurantId,
                    //     dishId: dishId
                    // }).then(async order => {
                    //     balance = balance - price;
                    //     User.update({ cashBalance: balance }, { where: { id: userId } }).then(updatedUser => {
                    //         return res.status(201).json(order);
                    //     }).catch(async err => {
                    //         await order.destroy();
                    //         return res.status(500).json(err);
                    //     })
                    // }).catch(err => {
                    //     return res.status(500).json(err);
                    // })
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