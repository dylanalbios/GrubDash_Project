const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass


// list all orders or filter id
function list(req, res) {
    const { orderId } = req.params;

    if (orderId) {
        const foundOrder = orders.find((order) => order.id === Number(orderId));

        if (foundOrder) {
            res.json({ data: foundOrder });
        } else {
            res.status(404).json({ error: `Order id not found: ${orderId}` });
        }
    } else {
        res.json({ data: orders });
    }
};

// verify order exists
function orderExists(req, res, next) {
    const { orderId } = req.params;
    const foundOrder = orders.find((order) => order.id === orderId);
    if (foundOrder) {
        res.locals.order = foundOrder;
        return next();
    }
    return res.status(404).json({ error: `Order id not found: ${orderId}` });
};

// read orders
function read(req, res, next) {
    res.json({ data: res.locals.order });
};

// has all body data required
function bodyDataHas(propertyName) {
    return function (req, res, next) {
        const { data = {} } = req.body;
        if (data[propertyName]) {
            if (propertyName === "status") {
                const validStatuses = ["pending", "preparing", "out-for-delivery", "delivered"];
                const status = data[propertyName];
                if (!validStatuses.includes(status)) {
                    return next({
                        status: 400,
                        message: `Invalid status: ${status}`,
                    });
                }
            }
            return next();
        }
        next({
            status: 400,
            message: `Must include a ${propertyName}`,
        });
    };
};

// delete an order
function destroy(req, res) {
    const { orderId } = req.params;
    const index = orders.findIndex((order) => order.id === orderId);
  
    if (index !== -1) {
        const order = orders[index];
        if (order.status !== "pending") {
            return res.status(400).json({
                error: `Order with id ${orderId} cannot be deleted as it is not in pending status.`,
            });
        }
        orders.splice(index, 1);
        return res.sendStatus(204);
    }
  
    return res
        .status(404)
        .json({ error: `Order id not found: ${orderId}` });
};
  
// check validity of dishes
function validateDishes(req, res, next) {
    const { data = {} } = req.body;
    const { dishes = [] } = data;

    if (!Array.isArray(dishes) || dishes.length === 0) {
        return res.status(400).json({
            error: "Dishes must be an array and have at least 1 dish",
        });
    }

    for (const dish of dishes) {
        if (!dish.hasOwnProperty("quantity")) {
            return res.status(400).json({
                error: "Dish 1 must have a quantity",
            });
        }

        if (dish.quantity === 0) {
            return res.status(400).json({
                error: "Dish must have a quantity greater than 0"
            });
        }
    }

    next();
};




module.exports ={
    create: [
        bodyDataHas("deliverTo"),
        bodyDataHas("mobileNumber"),
        bodyDataHas("status"),
        bodyDataHas("dishes"),
        validateDishes,
    ],
    list,
    read: [orderExists, read],
    update: [
        orderExists,
        bodyDataHas("deliverTo"),
        bodyDataHas("mobileNumber"),
        bodyDataHas("status"),
        bodyDataHas("dishes"),
        validateDishes,
    ],
    delete: [orderExists, destroy],
}