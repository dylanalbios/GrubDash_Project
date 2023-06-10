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

// verify dish exists
function dishExists(req, res, next) {
    const { dishId } = req.params;
    const foundDish = dishes.find((dish) => dish.id === dishId);
    if (foundDish) {
        res.locals.dish = foundDish;
        return next();
    }
    return res.status(404).json({ error: `Dish id not found: ${dishId}` });
};

// read dishes
function read(req, res, next) {
    res.json({ data: res.locals.dish });
};

// has all body data required
function bodyDataHas(propertyName) {
    return function (req, res, next) {
        const { data = {} } = req.body;
        if (data[propertyName]) {
            return next();
        }
        next({
            status: 400,
            message: `Must include a ${propertyName}`
        });
    };
};

// verify price is a number and not less than zero
function verifyPrice(req, res, next) {
    const { data } = req.body;

    if (typeof data.price !== "number" || data.price < 0) {
        return next({
            status: 400,
            message: "price",
        });
    }
    next();
};

module.exports ={
    create: [
        bodyDataHas("name"),
        bodyDataHas("description"),
        bodyDataHas("price"),
        bodyDataHas("image_url"),
        verifyPrice,
    ],
    list,
    read: [dishExists, read],
    update: [
        dishExists,
        bodyDataHas("name"),
        bodyDataHas("description"),
        bodyDataHas("price"),
        bodyDataHas("image_url"),
        verifyPrice,
    ],
}