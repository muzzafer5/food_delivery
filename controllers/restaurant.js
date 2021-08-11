const db = require('../models');
const { Op, fn, col } = require('sequelize');
const client = require('../config/elasticsearch');

const Restaurant = db.Restaurant;
const Menu = db.Menu;
const OpenHour = db.OpenHour;

const weeks = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];

function restaurantOpenAtCertainTime(req, res) {

    let { day, time } = req.query;
    let d, hh, mm=0;
    // if not day, then taken current day
    if (!day) {
        d = new Date();
        day = weeks[d.getDay()-1];
    }
    // validate day
    else{
        day = day.substring(0,2);
        day = day.toUpperCase();
        if (!weeks.includes(day)) {
            return res.status(400).json({ error: "Incorrect day" });
        }
    }
    // if not day, then taken current time
    if (!time) {
        d = new Date();
        hh = d.getHours();
        mm = d.getMinutes();
    }
    //validate time
    else{
        let split_time = time.split(':');
        hh = parseInt(split_time[0]);
        if (split_time.length > 1)
            mm = parseInt(split_time[1]);
        if(isNaN(hh) || isNaN(mm) || hh<0 || mm<0 || mm>60 || hh*60 +mm > 1440)
            return res.status(400).json({ error: "Incorrect time format" });
    }
    let minutes = hh*60 + mm;
    OpenHour.findAll({ 
        attributes: [], 
        distinct: true, 
        where: { day: day, from: { [Op.lte]: minutes }, to: { [Op.gte]: minutes } }, 
        include: [{ model: Restaurant, attributes: ["id","restaurantName"] }] 
    }).then(restro => {
        return res.status(200).json(restro);
    }).catch(err => {
        res.status(400).json(err);
    })
}

function topYRestaurant(req, res) {

    let { y, x, min_price, max_price, lesser } = req.query;
    // check for y, x and then parse integer from them
    if(!y || !x){
        return res.status(400).json({ error: "y or x missing" });
    }
    y = parseInt(y);
    x = parseInt(x);
    if (isNaN(y) || isNaN(x) ) {
        return res.status(400).json({ error: "y or x  invalid number" });
    }

    if(!min_price)
        min_price = 0;
    else
        min_price = parseFloat(min_price);
    if (!max_price)
        max_price = Number.MAX_SAFE_INTEGER; // if not assigning max price to INF
    else
        max_price = parseFloat(max_price);

    if (isNaN(min_price) || isNaN(max_price)) {
        return res.status(400).json({ error: "min_price or max_price invalid number" });
    }

    // compare func either less than or more than
    let compareFun;
    if(lesser){
        compareFun = Op.lt
    }
    else{
        compareFun = Op.gt
    }

    Menu.findAll({
        limit : y, 
        attributes: [[fn('count', col('restaurantId')), 'dishCount']],
        where: { price: { [Op.lte]: max_price, [Op.gte]: min_price } }, 
        include :[{
            model : Restaurant,
            required : true,
            attributes: ['id','restaurantName']
        }],
        group : ['restaurantId'],
        having: { dishCount : {[compareFun] : x}}
        //logging: console.log
    }).then(restro => {
        return res.status(200).json(restro);
    }).catch(err=>{
        return res.status(400).json(err);
    })
}

async function searchRestaurant(req, res){

    let {restaurantName} = req.params;
    if(!restaurantName){
        return res.status(400).json({ error: "restaurantName missing" });
    }

    // perform search in elasticsearch db
    client.search({
        index: 'restaurant',
        body: {
            query: {
                match: {
                    name: {
                        query: restaurantName,
                        fuzziness: "AUTO",
                        prefix_length: 0,
                        max_expansions: 50
                    }
                }
            }
        }
    }).then(restaurantData => {
        return res.status(200).json(restaurantData.body.hits.hits);
    }).catch(err => {
        return res.status(400).json(err);
    })
    // const restro = await db.sequelize.query('SELECT restaurantName,soundex(restaurantName),soundex("' + restaurantName + '") FROM Restaurants limit 20', {
    //     model: Restaurant,
    //     mapToModel: true // pass true here if you have any mapped fields
    // });
    // res.json(restro)
}

module.exports = {restaurantOpenAtCertainTime, topYRestaurant, searchRestaurant}
