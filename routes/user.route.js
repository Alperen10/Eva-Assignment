module.exports = app => {
    const usersController = require("../controllers/user.controller");

    var router = require("express").Router();

    // Create a new User
    router.post("/", usersController.create);

    // Retrieve all Users
    router.get("/", usersController.findAll);

    // Retrieve a single User with id
    router.get("/:Id", usersController.get);

    // Update a User with id
    router.put("/:Id", usersController.update);

    // Delete a User with id
    router.delete("/:Id", usersController.delete);

    app.use('/api/user', router);
};