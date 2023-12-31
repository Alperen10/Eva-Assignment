const db = require("../models/index");
const moment = require("moment");
const Share = db.Share;

// Create and Save a new Share
exports.create = (req, res) => {
    const newShare = {
        ShareSymbol: req.body.ShareSymbol,
        ShareCount: req.body.ShareCount,
        Price: req.body.Price,
    };
    Share.create(newShare)
        .then((data) => {
            res.send({
                message: "Share Created Succesfully",
            });
            console.log(res);
        })
        .catch((error) => {
            res.send(error);
            console.error("Failed to create a new record : ", error);
        });
};

// Retrieve all Shares from the database.
exports.findAll = (req, res) => {
    Share.findAll()
        .then((data) => {
            res.send(data);
            console.log(data);
        })
        .catch((error) => {
            console.error("Failed to retrieve data : ", error);
        });
};

// Find a single Share with an id
exports.get = (req, res) => {
    const Id = req.params.Id;
    Share.findByPk(Id)
        .then((data) => {
            res.send(data);
        })
        .catch((error) => {
            res.send(error);
            console.error("Failed to create a new record : ", error);
        });
};

// Update a Share by the id in the request
exports.update = async (req, res) => {
    const Id = req.params.Id;
    Share.update(req.body, {
        where: { Id: Id },
    })
        .then((result) => {
            if (result == 1) {
                res.send({
                    message: "Share was updated successfully.",
                });
            } else {
                res.send({
                    message: "Cannot update Share ",
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Error updating Share with Id=" + Id,
            });
        });
};

exports.updatePrice = async (req, res) => {
    const Id = req.params.Id;
    var ShareData = await Share.findByPk(Id);
    if (moment(ShareData.LastUpdateDate).add(moment.duration(1, 'hours')) < moment()) {
        Share.update({
            Price: req.body.Price
        }, {
            where: { Id: Id },
        })
            .then((result) => {
                if (result == 1) {
                    res.send({
                        message: "Share was updated successfully.",
                    });
                } else {
                    res.send({
                        message: "Cannot update Share ",
                    });
                }
            })
            .catch((err) => {
                res.status(500).send({
                    message: "Error updating Share with Id=" + Id,
                });
            });
    }
    else {
        res.send({
            message: "Share not updated.",
        });
    }
};

// Delete a Share with the specified id in the request
exports.delete = (req, res) => {
    const Id = req.params.Id;

    Share.destroy({
        where: { Id: Id },
    })
        .then((num) => {
            if (num == 1) {
                res.send({
                    message: "Share was deleted successfully!",
                });
            } else {
                res.send({
                    message: "Cannot delete Share",
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Could not delete Share with id=" + id,
            });
        });
};