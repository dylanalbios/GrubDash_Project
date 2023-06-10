const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass


// get all dishes
function getAllDishes(req, res, next) {
    res.json({ data: dishes });
};

// get one dish based on id
function getOneDish(req, res) {
    const { dishId } = req.params;

    const foundDish = dishes.find((dish) => dish.id === Number(dishId));

    if (foundDish) {
        res.json({ data: foundDish });
    }   else {
        res.status(404).json({ error: `Dish id not found: ${dishId}`});
    }
};

module.exports ={
    getAllDishes,
    getOneDish,
}