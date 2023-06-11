const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass


// create new dish
function create(req, res) {
    const { data: { name, description, price, image_url } = {} } = req.body;
    const newDish = {
        id: nextId(),
        name: name,
        description: description,
        price: price,
        image_url: image_url,
    };
    dishes.push(newDish);
    res.status(201).json({ data: newDish });
};

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
function priceIsValid(req, res, next) {
    const { data } = req.body;

    if (typeof data.price !== "number" || data.price < 0) {
        return next({
            status: 400,
            message: "price",
        });
    }
    next();
};

// update
function update(req, res) {
    const dish = res.locals.dish;
    const { data: { id, name, description, price, image_url } = {} } = req.body;

    if (id && id !== dish.id) {
        return res.status(400).json({
            error: "The dish ID in the request body must match the dishId in the URL.",
        });
    }

    dish.name = name;
    dish.description = description;
    dish.price = price;
    dish.image_url = image_url;

    res.json({ data: dish });
};

// validate ID
function validateId(req, res, next) {
    const { data } = req.body;
    const { dishId } = req.params;

    if (data.id && data.id !== dishId) {
        return res.status(400).json({
            error: `The dish ID in the request body must match the id in the URL. Received: ${data.id}`,
        });
    }

    data.id = dishId;

    next();
};

module.exports ={
    create: [
        bodyDataHas("name"),
        bodyDataHas("description"),
        bodyDataHas("price"),
        bodyDataHas("image_url"),
        priceIsValid,
        create,
    ],
    list,
    read: [dishExists, read],
    update: [
        dishExists,
        validateId,
        bodyDataHas("name"),
        bodyDataHas("description"),
        bodyDataHas("price"),
        bodyDataHas("image_url"),
        priceIsValid,
        update,
    ],
}