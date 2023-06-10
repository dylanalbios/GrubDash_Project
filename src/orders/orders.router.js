const router = require("express").Router({ mergeParams: true });
const controller = require("./orders.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

// TODO: Implement the /orders routes needed to make the tests pass

router
    .route("/")
    .get()
    .post()
    .put()
    .delete()
    .all(methodNotAllowed);

router
    .route("/:orderId")
    .get()
    .post()
    .put()
    .delete()
    .all(methodNotAllowed);


module.exports = router;