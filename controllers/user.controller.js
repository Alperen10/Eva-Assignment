const db = require("../models/index");
const Users = db.Users;

// Create and Save a new User
exports.create = (req, res) => {
    const newUser = {
        Name: req.body.Name,
        WalletBalance: req.body.WalletBalance,
    };
    Users.create(newUser)
        .then((data) => {
            res.send({
                message: "User Created Succesfully",
            });
        })
        .catch((error) => {
            res.send(error);
            console.error("Failed to create a new record : ", error);
        });
};

// Retrieve all Users from the database.
exports.findAll = (req, res) => {
    Users.findAll()
        .then((data) => {
            res.send(data);
            console.log(data);
        })
        .catch((error) => {
            console.error("Failed to retrieve data : ", error);
        });
};

// Find a single User with an id
exports.get = (req, res) => {
    const Id = req.params.Id;
    Users.findByPk(Id)
        .then((data) => {
            res.send(data);
        })
        .catch((error) => {
            res.send(error);
            console.error("Failed to create a new record : ", error);
        });
};

// Update a User by the id in the request
exports.update = (req, res) => {
    const Id = req.params.Id;
    console.log(req.body);
    Users.update(req.body, {
        where: { Id: Id },
    })
        .then((result) => {
            if (result == 1) {
                res.send({
                    message: "User was updated successfully.",
                });
            } else {
                res.send({
                    message: "Cannot update User ",
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Error updating User with Id=" + Id,
            });
        });
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
    const Id = req.params.Id;

    Users.destroy({
        where: { Id: Id },
    })
        .then((num) => {
            if (num == 1) {
                res.send({
                    message: "User was deleted successfully!",
                });
            } else {
                res.send({
                    message: "Cannot delete User",
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Could not delete User with id=" + id,
            });
        });
};