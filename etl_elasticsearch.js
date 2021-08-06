const restro = require("./data/restaurant_with_menu.json");
const client = require('./config/elasticsearch');

function createRestaurants(){

    let data = []

    for (let i = 0; i < restro.length; i++) {
        let indexData = {
            index: {
                _index: "restaurant",
                _id: i + 1
            }
        }
        let restaurantData = {
            name: restro[i].restaurantName
        }
        data.push(indexData);
        data.push(restaurantData);
    }
    client.bulk({body : data}).then(res=>{
        console.log(res)
    }).catch(err=>{
        console.log(err)
    })
}

function createDishes() {

    let data = []
    let cnt = 1

    for (let i = 0; i < restro.length; i++) {
        for(let j=0;j<restro[i].menu.length;j++){
            let indexData = {
                index: {
                    _index: "dish",
                    _id: cnt
                }
            }
            let dishData = {
                name: restro[i].menu[j].dishName
            }
            data.push(indexData);
            data.push(dishData);
            cnt+=1;
        }
    }
    client.bulk({ body: data }).then(res => {
        console.log(res)
    }).catch(err => {
        console.log(err)
    })
}

//create frenzy index if not exist
function checkIndices() {
    client.indices.exists({ index: 'frenzy' }, (err, res, status) => {
        if (res.body) {
            console.log("index already exist");
        } else {
            client.indices.create({ index: 'frenzy' }, (err, res, status) => {
                if (!err)
                    console.log("index created");
            })
        }
    })
}

//delete entry by query or whole index
function deleteData(){
    client.deleteByQuery({
        index: 'dish',
        body: {
            query: {
                match: { name: 'kawab' }
            }
        }
    }).then(res => {
        console.log(res)
    }).catch(err => {
        console.log(err)
    })

    client.indices.delete({
        index: 'dish'
    }, function (err, res) {

        if (err) {
            console.error(err.message);
        } else {
            console.log('Indexes have been deleted!');
        }
    });
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
        resDish = res.body.hits.hits
        console.log(res.body.hits.total)
        console.log(resDish.length)
    }).catch(err => {
        console.log(err)
    })
}

search()



