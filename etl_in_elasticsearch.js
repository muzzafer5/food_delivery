const restro = require("./data/restaurant_with_menu.json");
const client = require('./config/elasticsearch');
const Restaurant = require('./models').Restaurant;
const Menu = require('./models').Menu;

async function createRestaurants(){

    let data = [];
    // fetching all restaurant
    await Restaurant.findAll({
        attributes: ["id", "restaurantName"]
    }).then(res => {
        for (let i = 0; i <res.length;i++){
            resDetail = res[i].dataValues;
            let indexData = {
                index: {
                    _index: "restaurant",
                    _id: resDetail.id
                }
            };
            let restaurantData = {
                name: resDetail.restaurantName
            };
            data.push(indexData);
            data.push(restaurantData);
        }
    })

    // updating restaurant data in elastic search
    client.bulk({body : data}).then(res=>{
        console.log(res);
    }).catch(err=>{
        console.log(err);
    })
}

async function createDishes() {

    let data = [];
    // fetching all dishes
    await Menu.findAll({
        attributes: ["id", "dishName"]
    }).then(res => {
        for (let i = 0; i < res.length; i++) {
            dishDetail = res[i].dataValues;
            let indexData = {
                index: {
                    _index: "dish",
                    _id: dishDetail.id
                }
            };
            let dishData = {
                name: dishDetail.dishName
            };
            data.push(indexData);
            data.push(dishData);
        }
    })

    // updating dish data in elastic search
    client.bulk({ body: data }).then(res => {
        console.log(res);
    }).catch(err => {
        console.log(err);
    })
}

//delete entry by query or whole index
function deleteData(){

    client.indices.delete({
        index: 'dish'
    }, function (err, res) {

        if (err) {
            console.error(err.message);
        } else {
            console.log('Indexes have been deleted!');
        }
    });

        // client.deleteByQuery({
    //     index: 'dish',
    //     body: {
    //         query: {
    //             match: { name: 'kawab' }
    //         }
    //     }
    // }).then(res => {
    //     console.log(res);
    // }).catch(err => {
    //     console.log(err);
    // });
}

// fuzzy search in restaurant table
function search() {
    let resDish = []
    client.search({
        index: 'dish',
        body: {
            query: {
                match: {
                    name: {
                        query: "blues",
                        fuzziness : "AUTO",
                        prefix_length: 0,
                        max_expansions : 30
                    }
                }
            }
        }
    }).then(res => {
        resDish = res.body.hits.hits;
        console.log(res.body.hits.total);
        console.log(resDish);
    }).catch(err => {
        console.log(err)
    })
}

console.log("elasticsearch");
createRestaurants();
createDishes();

