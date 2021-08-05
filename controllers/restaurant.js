const db = require('../models')
const { Op, fn, col } = require('sequelize')

const Restaurant = db.Restaurant
const Menu = db.Menu
const OpenHour = db.OpenHour

const weeks = ["Mon", "Tues", "Weds", "Thurs", "Fri", "Sat", "Sun"]

function restaurantOpenAtCertainTime(req, res) {
    let {day,time} = req.query;
    let split_time = time.split(':'), minutes = 0;
    minutes = parseInt(split_time[0]) * 60;
    if(split_time.length==2)
        minutes+=parseInt(split_time[1]);
    if(!weeks.includes(day)){
        return res.status(400).json({ error: "Incorrect day" });
    }
    if(minutes>1440 || minutes <0){
        return res.status(400).json({error : "Incorrect time format"});
    }
    OpenHour.findAll({ attributes: [], distinct: true, where: { day: day, from: { [Op.lte]: minutes }, to: { [Op.gte]: minutes } }, include: [{ model: Restaurant, attributes: ["restaurantName"]}]}).then(restro=>{
        return res.status(201).json( restro);
    })
}

function topYRestaurant(req, res) {

    let { y, x, min_price, max_price, lesser } = req.query;
    y = parseInt(y);
    if(min_price==undefined)
        min_price = 0;
    if (max_price == undefined)
        max_price = Number.MAX_SAFE_INTEGER;
    
    let compareFun;
    if(lesser==1){
        compareFun = Op.lt
    }
    else{
        compareFun = Op.gt
    }
    Menu.findAll({
        limit : y, 
        attributes: [[fn('count', col('restaurantId')), 'cnt']],
        where: { price: { [Op.lte]: max_price, [Op.gte]: min_price } }, 
        include :[{
            model : Restaurant,
            required : true,
            attributes: ['restaurantName']
        }],
        group : ['restaurantId'],
        having: { cnt : {[compareFun] : x}},
        logging: console.log
    }).then(restro => {
        return res.status(201).json(restro);
    }).catch(err=>{
        console.log(err)
        res.status(400).json(err);
    })
}

async function searchRestaurant(req, res){
    let {restaurantName} = req.params;
    // const restro = await db.sequelize.query('SELECT restaurantName,soundex(restaurantName),soundex("' + restaurantName + '") FROM Restaurants limit 20', {
    //     model: Restaurant,
    //     mapToModel: true // pass true here if you have any mapped fields
    // });
    // res.json(restro)
}

module.exports = {restaurantOpenAtCertainTime, topYRestaurant, searchRestaurant}
