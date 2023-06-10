const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass


// list all dishes or filter id
function list(req, res) {
    const { dishId } = req.params;

    if (dishId) {
        const foundDish = dishes.find((dish) => dish.id === Number(dishId));

        if (foundDish) {
            res.json({ data: foundDish });
        } else {
            res.status(404).json({ error: `Dish id not found: ${dishId}` });
        }
    } else {
        res.json({ data: dishes });
    }
};

// verify dish

module.exports ={
    list,
}