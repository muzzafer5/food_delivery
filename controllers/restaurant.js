const Restaurant = require('../models').Restaurant
const Menu = require('../models').Menu
const OpenHour = require('../models').OpenHour
const Sequelize = require('sequelize')
const {Op,fn, col} = Sequelize

const weeks = ["Mon", "Tues", "Weds", "Thurs", "Fri", "Sat", "Sun"]

function restaurantOpenAtCertainTime(req, res) {
    var {day,time} = req.query;
    var split_time = time.split(':'), minutes = 0;
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



module.exports = {restaurantOpenAtCertainTime, topYRestaurant}
