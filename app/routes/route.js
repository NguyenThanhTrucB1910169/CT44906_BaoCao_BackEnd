const express = require('express');
const products = require("../controllers/products.controller");
const cart = require("../controllers/cart.controller");
const orders = require("../controllers/order.controller");
const account = require("../controllers/account.controller");

const router = express.Router();

router.route("/")
    .get(products.findAll)
    .post(products.create)
    .delete(products.deleteAll);


router.route("/cart/:id")
    .put(cart.update)
    .delete(cart.delete)

router.route("/cart")
    .get(cart.findAll)
    .post(cart.create)
    .delete(cart.deleteAll);


router.route("/orders")
    .get(orders.findAll)
    .post(orders.create)


router.route("/signup")
    // .get(account.findAll)
    .post(account.create)

router.route("/signup/auth")
    .post(account.login)

    
router.route("/:id")
    .get(products.findOne)
    .put(products.update)
    .delete(products.delete);

module.exports = router;




