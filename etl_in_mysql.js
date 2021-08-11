require("dotenv").config();
const bcrypt = require("bcryptjs");

const Restaurant = require('./models').Restaurant;
const Menu = require('./models').Menu;
const OpenHour = require('./models').OpenHour;
const User = require('./models').User;
const Order = require('./models').Order;
const Auth = require('./models').Auth;

const restro = require("./data/restaurant_with_menu.json");
const users = require("./data/users_with_purchase_history.json");

const weeks = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];
let i = 0;

let menuData = [];
let openHourData = [];
let orderData = [];
let restaurantMap = new Map();

// converting time (hh:mm am/pm)in minutes
convertToMinutes = (tm) => {
    let n = tm.length, H = 0, MM = 0;
    let ind = tm.indexOf(':');
    if (ind == -1) {
        H = parseInt(tm.substr(0, n - 2));
    }
    else {
        H = parseInt(tm.substr(0, ind));
        MM = parseInt(tm.substr(ind + 1, n - 2));
    }
    if (tm[n - 2] == 'p' || tm[n - 2] == 'P') {
        H += 12;
    }
    MM += H * 60;
    return MM;
}

// return array of objects for OpenHour
openHourObj = (s, from, to, resID)=>{
    if(from > to){
        let obj1 = {
            day: s,
            from: from,
            to: 24*60,
            restaurantId: resID
        };
        let obj2 = {
            day: s,
            from: 0,
            to: to,
            restaurantId: resID
        };
        return [obj1, obj2];
    }
    else{
        let obj = {
            day: s,
            from: from,
            to: to,
            restaurantId: resID
        };
        return [obj];
    }
}

//Inserting restaurants entries in Restaurants table and updating openHourData and menuData with restaurantId
updateRestaurant = async () => {
    for (i = 0; i < restro.length; i++) {
        //inserting in restaurant table
        await Restaurant.create({
            restaurantName: restro[i].restaurantName,
            cashBalance: restro[i].cashBalance
        }).then(async res => {
            let resID = res.dataValues.id;
            restaurantMap.set(restro[i].restaurantName, resID);
            for (let j = 0; j < restro[i].menu.length; j++) {
                if (restro[i].menu[j].dishName.length > 255) {
                    restro[i].menu[j].dishName = restro[i].menu[j].dishName.substr(0, 255);
                }
                let tmp = {
                    dishName: restro[i].menu[j].dishName,
                    price: restro[i].menu[j].price,
                    restaurantId: resID
                }
                menuData.push(tmp);
            }

            //parsing opening hours
            let openHourDay = restro[i].openingHours.split("/");

            for (let j = 0; j < openHourDay.length; j++) {

                //removing whitespaces
                openHourDay[j] = openHourDay[j].split(' ').join("");

                //seprating days and time interval
                let ind = openHourDay[j].search(/\d/);

                let openTime = openHourDay[j].substr(ind, openHourDay[j].length).split("-"); // opening and ending time
                let openDay = openHourDay[j].substr(0, ind);// days

                // converting opening time and ending time in minutes
                let from = convertToMinutes(openTime[0]), to = convertToMinutes(openTime[1]); 4
                let end = 0;
                if (from > to) {
                    end = 24*60;
                }

                let s = "", tmp = "";

                /*parsing all days 
                    For Mon-Thurs,Sat
                    MO, TU, WE, TH, SA will be inserted in openHourData
                */
                for (let k = 0; k <= openDay.length; k++) {
                    if (k == openDay.length || openDay[k] == ',') {
                        s = s.substring(0, 2);
                        s = s.toUpperCase();
                        if (tmp == "") {
                            let obj = openHourObj(s, from, to, resID);
                            openHourData.push(...obj);
                        }
                        else {
                            ind = 0;
                            while (ind < 7 && weeks[ind] != tmp) {
                                ind++;
                            }
                            while (ind < 7) {
                                let obj = openHourObj(weeks[ind], from, to, resID);
                                openHourData.push(...obj);
                                if (weeks[ind] == s) {
                                    break;
                                }
                                ind++;
                            }
                            if (ind == 7) {
                                ind = 0;
                                while (ind < 7) {
                                    let obj = openHourObj(weeks[ind], from, to, resID);
                                    openHourData.push(...obj);
                                    if (weeks[ind] == s) {
                                        break;
                                    }
                                    ind++;
                                }
                            }
                        }
                        s = "";
                        tmp = "";
                    }
                    else if (openDay[k] == '-') {
                        s = s.substring(0, 2);
                        s = s.toUpperCase();
                        tmp = s;
                        s = "";
                    }
                    else {
                        s += openDay[k];
                    }
                }
            }
        }).catch(err => { console.log(err) })
    }
}

updateUsers = async ()=>{
    password = await bcrypt.hash("password", 10);
    for(i=0;i<users.length;i++){
        await Auth.create({
            username : users[i].id,
            password : password
        }).then(async auth=>{
            await User.create({
                name: users[i].name,
                cashBalance: users[i].cashBalance,
                authId : auth.dataValues.id
            }).then(async userTmp => {
                let userId = userTmp.dataValues.id;
                for (let j = 0; j < users[i].purchaseHistory.length;j++){
                    if (restaurantMap.has(users[i].purchaseHistory[j].restaurantName)){
                        let resID = restaurantMap.get(users[i].purchaseHistory[j].restaurantName);
                        await Menu.findOne({
                            attributes: ["id"],
                            where: {
                                restaurantId : resID,
                                dishName: users[i].purchaseHistory[j].dishName
                            }
                        }).then(async dish=>{
                            let dishId = dish.dataValues.id;
                            let obj = { 
                                transactionAmount: users[i].purchaseHistory[j].transactionAmount,
                                transactionDate: users[i].purchaseHistory[j].transactionDate,
                                userId : userId,
                                restaurantId : resID,
                                dishId : dishId
                            }
                            orderData.push(obj);
                        })
                    }
                }
            }).catch(err => {
                console.log(err);
            })
        }).catch(err=>console.log(err))
    }
}

async function updateModels() {

    await updateRestaurant();
    console.log("Inserted Restaurant table data");

    await Menu.bulkCreate(menuData).then(res =>
        console.log("Inserted Menus table data")
    ).catch(err => console.log(err))

    await OpenHour.bulkCreate(openHourData).then(res =>
        console.log("Inserted OpenHours table data")
    ).catch(err => console.log(err))

    await updateUsers();
    console.log("Inserted Auth table data");
    console.log("Inserted User table data");

    await Order.bulkCreate(orderData).then(res =>
        console.log("Inserted Order table data")
    ).catch(err => console.log(err))
}

console.log("mysql")
updateModels()