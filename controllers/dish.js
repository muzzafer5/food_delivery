const client = require('../config/elasticsearch');

async function searchDish(req, res) {

    let { dishName } = req.params;
    if (!dishName) {
        return res.status(400).json({ error: "dishName missing" });
    }

    // perform search in elasticsearch db
    client.search({
        index: 'dish',
        body: {
            query: {
                match: {
                    name: {
                        query: dishName,
                        fuzziness: "AUTO",
                        prefix_length: 0,
                        max_expansions: 50
                    }
                }
            }
        }
    }).then(dishData => {
        return res.status(200).json(dishData.body.hits.hits);
    }).catch(err => {
        return res.status(400).json(err);
    })
}

module.exports = {searchDish}