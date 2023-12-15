module.exports = app => {
    const portfolioController = require("../controllers/portfolio.controller");

    var router = require("express").Router();

    // Retrieve all Users Portfolio
    router.get("/", portfolioController.findAll);

    // Retrieve a single User Portfolio with Id
    router.get("/:UserId", portfolioController.get);

    app.use('/api/portfolio', router);
};