require("dotenv").config();

const Restaurant = require('./models').Restaurant
const Menu = require('./models').Menu
const OpenHour = require('./models').OpenHour
const User = require('./models').User
const Order = require('./models').Order

const restro = require("./data/restaurant_with_menu.json");
const users = require("./data/users_with_purchase_history.json");

// converting time (h:mm am/pm)in minutes
convertToMinutes = (tm) => {
    let n = tm.length, H = 0, MM = 0;
    let ind = tm.indexOf(':');
    if (ind == -1) {
        H = parseInt(tm.substr(0, n - 2))
    }
    else {
        H = parseInt(tm.substr(0, ind))
        MM = parseInt(tm.substr(ind + 1, n - 2))
    }
    if (tm[n - 2] == 'p' || tm[n - 2] == 'P') {
        H += 12;
    }
    MM += H * 60;
    return MM;
}

let weeks = ["Mon", "Tues", "Weds", "Thurs", "Fri", "Sat", "Sun"]
let i = 0

let menuData = [];
let openHourData = [];
let orderData = [];

//Inserting restaurants entries in Restaurants table and updating openHourData and menuData with restaurantId
updateRestaurant = async () => {

    for (i = 0; i < restro.length; i++) {
        //inserting in restaurant table
        await Restaurant.create({
            restaurantName: restro[i].restaurantName,
            cashBalance: restro[i].cashBalance
        }).then(async res => {
            let resID = res.dataValues.id;
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
                let from = convertToMinutes(openTime[0]), to = convertToMinutes(openTime[1]); 
                if (from > to) {
                    let tmp = to;
                    to = from;
                    from = tmp;
                }

                let obj = {} // will be inserted in OpenHour table
                let s = "", tmp = "";

                /*parsing all days 
                    For Mon-Thurs,Sat
                    Mon, Tues, Weds, Thurs, Sat will be inserted in openHourData
                */
                for (let k = 0; k <= openDay.length; k++) {
                    if (k == openDay.length || openDay[k] == ',') {
                        if (s == "Thu") {
                            s = "Thurs"
                        }
                        if (s == "Wed") {
                            s = "Weds"
                        }
                        if (tmp == "") {
                            obj = {
                                day: s,
                                from: from,
                                to: to,
                                restaurantId: resID
                            }
                            openHourData.push(obj);
                        }
                        else {
                            ind = 0;
                            while (ind < 7 && weeks[ind] != tmp) {
                                ind++;
                            }
                            while (ind < 7) {
                                obj = {
                                    day: weeks[ind],
                                    from: from,
                                    to: to,
                                    restaurantId: resID
                                }
                                openHourData.push(obj);
                                if (weeks[ind] == s) {
                                    break;
                                }
                                ind++;
                            }
                            if (ind == 7) {
                                ind = 0;
                                while (ind < 7) {
                                    obj = {
                                        day: weeks[ind],
                                        from: from,
                                        to: to,
                                        restaurantId: resID
                                    }
                                    openHourData.push(obj);
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
                        if (s == "Thu") {
                            s = "Thurs"
                        }
                        if (s == "Wed") {
                            s = "Weds"
                        }
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

async function updateModels() {

    // await updateRestaurant()
    // console.log("Inserted Restaurant table data")

    // Menu.bulkCreate(menuData).then(res =>
    //     console.log("Inserted Menus table data")
    // ).catch(err => console.log(err))

    // OpenHour.bulkCreate(openHourData).then(res =>
    //     console.log("Inserted OpenHours table data")
    // ).catch(err => console.log(err))

    // await updateUsers();
    // console.log("Inserted User table data");

    // Order.bulkCreate(orderData).then(res =>
    //     console.log("Inserted Order table data")
    // ).catch(err => console.log(err))
}

updateModels()