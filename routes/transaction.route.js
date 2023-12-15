module.exports = app => {
    const transactionController = require("../controllers/transaction.controller");

    var router = require("express").Router();

    // Create a new Transaction BUY SELL Operation Data
    router.post("/", transactionController.create);

    // Retrieve all Transaction LOG
    router.get("/", transactionController.findAll);

    // Retrieve a single User Transaction LOG with Id
    router.get("/:UserId", transactionController.get);

    app.use('/api/transaction', router);
};