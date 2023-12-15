const db = require("../models/index");
const Transaction = db.Transaction;
const Users = db.Users;
const Share = db.Share;
const Portfolio = db.Portfolio;

// BUY-SELL Operation
shareOperation = async (newTransaction) => {
    return new Promise((resolve) => {
        Transaction.create(newTransaction)
            .then(async (data) => {
                if (newTransaction.Operation == "BUY") {
                    var TotalPriceWallet = -newTransaction.TotalPrice;
                    var TotalPrice = newTransaction.TotalPrice;
                    var ShareSizeShareTable = -newTransaction.ShareSize;
                    var ShareSize = newTransaction.ShareSize;
                } else {
                    var TotalPriceWallet = -newTransaction.TotalPrice;
                    var TotalPrice = newTransaction.TotalPrice;
                    var ShareSize = -newTransaction.ShareSize;
                    var ShareSizeShareTable = newTransaction.ShareSize;
                }
                Users.increment(
                    {
                        WalletBalance: TotalPriceWallet,
                    },
                    {
                        where: { Id: newTransaction.UserId },
                    }
                ).then(async (data) => {
                    Share.increment(
                        {
                            ShareCount: ShareSizeShareTable,
                        },
                        {
                            where: {
                                Id: newTransaction.ShareId,
                            },
                        }
                    )
                        .then(async (data) => {
                            const UserPortfolio = await Portfolio.findOne({
                                where: {
                                    UserId: newTransaction.UserId,
                                    ShareId: newTransaction.ShareId,
                                },
                            });
                            if (UserPortfolio == null) {
                                const newPortfolio = {
                                    UserId: newTransaction.UserId,
                                    ShareId: newTransaction.ShareId,
                                    ShareSize: newTransaction.ShareSize,
                                    TotalPrice: TotalPrice,
                                };
                                Portfolio.create(newPortfolio)
                                    .then((data) => {
                                        resolve("Success");
                                    })
                                    .catch((error) => {
                                        resolve(error);
                                    });
                            } else {
                                Portfolio.increment(
                                    {
                                        ShareSize: ShareSize,
                                        TotalPrice: TotalPrice,
                                    },
                                    {
                                        where: {
                                            Id: UserPortfolio.Id,
                                        },
                                    }
                                )
                                    .then((data) => {
                                        resolve("Success");
                                    })
                                    .catch((error) => {
                                        resolve(error);
                                    });
                            }
                        })
                        .catch((error) => {
                            resolve(error);
                        });
                }).catch((error) => {
                    resolve(error);
                });
            })
            .catch((error) => {
                resolve(error);
                console.error("Failed to create a new record : ", error);
            });
    });
};

exports.BulkInsert = async (UserId, ShareId, ShareSize, Operation) => {
    var ShareData = await Share.findByPk(ShareId);
    var UserData = await Users.findByPk(UserId);
    if (ShareData == null || UserData == null) {
        console.log("user or share not defined");
    } else {
        if (Operation == "BUY") {
            var TotalPrice = ShareData.Price * ShareSize;
            if (
                ShareData.ShareCount >= ShareSize &&
                UserData.WalletBalance >= TotalPrice
            ) {
                const newTransaction = {
                    UserId: UserId,
                    ShareId: ShareId,
                    ShareSize: ShareSize,
                    TotalPrice: TotalPrice,
                    Operation: Operation,
                };
                await shareOperation(newTransaction);
            } else {
                console.log(
                    "Share size have not bigger than Share Count or User wallet balance lower than TotalPrice"
                );
            }
        } else {
            const UserShare = await Portfolio.findOne({
                where: {
                    UserId: UserId,
                    ShareId: ShareId,
                },
            });
            if (UserShare !== null) {
                var TotalPrice = -ShareData.Price * ShareSize;
                if (UserShare.ShareSize >= ShareSize) {
                    const newTransaction = {
                        UserId: UserId,
                        ShareId: ShareId,
                        ShareSize: ShareSize,
                        TotalPrice: TotalPrice,
                        Operation: Operation,
                    };
                    await shareOperation(newTransaction);
                } else {
                    console.log("Share size have not bigger than Share Count");
                }
            } else {
                console.log("User Dont have this share");
            }
        }
    }
};
// Create and Save a new Transaction Data
exports.create = async (req, res) => {
    var ShareData = await Share.findByPk(req.body.ShareId);
    var UserData = await Users.findByPk(req.body.UserId);
    if (ShareData == null || UserData == null) {
        console.log("user or share not defined");
    } else {
        if (req.body.Operation == "BUY") {
            var TotalPrice = ShareData.Price * req.body.ShareSize;
            if (
                ShareData.ShareCount >= req.body.ShareSize &&
                UserData.WalletBalance >= TotalPrice
            ) {
                const newTransaction = {
                    UserId: req.body.UserId,
                    ShareId: req.body.ShareId,
                    ShareSize: req.body.ShareSize,
                    TotalPrice: TotalPrice,
                    Operation: req.body.Operation,
                };
                var result = await shareOperation(newTransaction);
                console.log("result", result);
                res.send({
                    message: result,
                });
            } else {
                res.send({
                    message:
                        "Share size have not bigger than Share Count or User wallet balance lower than TotalPrice",
                });
            }
        } else {
            const UserShare = await Portfolio.findOne({
                where: {
                    UserId: req.body.UserId,
                    ShareId: req.body.ShareId,
                },
            });
            if (UserShare !== null) {
                var TotalPrice = -ShareData.Price * req.body.ShareSize;
                if (UserShare.ShareSize >= req.body.ShareSize) {
                    const newTransaction = {
                        UserId: req.body.UserId,
                        ShareId: req.body.ShareId,
                        ShareSize: req.body.ShareSize,
                        TotalPrice: TotalPrice,
                        Operation: req.body.Operation,
                    };
                    var result = await shareOperation(newTransaction);
                    res.send({
                        message: result,
                    });
                } else {
                    res.send({
                        message: "Share size have not bigger than Share Count",
                    });
                }
            } else {
                res.send({
                    message: "User dont have this share",
                });
            }
        }
    }
};

// Retrieve all Transaction from the database.
exports.findAll = (req, res) => {
    Transaction.findAll()
        .then((data) => {
            res.send(data);
            console.log(data);
        })
        .catch((error) => {
            console.error("Failed to retrieve data : ", error);
        });
};

// Find a single Transaction with an id
exports.get = (req, res) => {
    const UserId = req.params.UserId;
    Transaction.findAll({
        where: { UserId: UserId },
    })
        .then((data) => {
            res.send(data);
        })
        .catch((error) => {
            res.send(error);
            console.error("Failed to create a new record : ", error);
        });
};