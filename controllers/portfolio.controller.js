const db = require("../models/index");
const Portfolio = db.Portfolio;
const Users = db.Users;
const Share = db.Share;

// Retrieve User all Portfolio from the database.
exports.findAll = (req, res) => {
    Portfolio.findAll().then(data => {
        res.send(data);
        console.log(data);
    }).catch((error) => {
        console.error('Failed to retrieve data : ', error);
    });
};

// Find a single Portfolio with an id
exports.get = (req, res) => {
    const UserId = req.params.UserId;
    Portfolio.findAll({
        where: { UserId: UserId }
    }

    ).then(data => {
        res.send(data);
    }).catch((error) => {
        res.send(error);
        console.error('Failed to create a new record : ', error);
    });
};