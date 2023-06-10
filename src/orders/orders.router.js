const router = require("express").Router({ mergeParams: true });
const controller = require("./orders.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

// TODO: Implement the /orders routes needed to make the tests pass

router
    .route("/")
    .get(controller.list)
    .post()
    .put()
    .all(methodNotAllowed);

router
    .route("/:orderId")
    .get(controller.read)
    .post()
    .put()
    .delete(controller.delete)
    .all(methodNotAllowed);


module.exports = router;