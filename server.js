const express = require("express");
const app = express(); 
const port = 8080;
const bodyparse = require("body-parser");
app.use(bodyparse.json());
app.use(bodyparse.urlencoded({ extended: true }));

require("./routes/user.route")(app);
require("./routes/share.route")(app);
require("./routes/portfolio.route")(app);
require("./routes/transaction.route")(app);

const db = require("./models/index");
const Users = db.Users;
const Shares = db.Share;
const Transaction = db.Transaction;
const Portfolio = db.Portfolio;
const transactionController = require("./controllers/transaction.controller");
const portfolioController = require("./controllers/portfolio.controller");

db.sequelize
    .sync()
    .then(() => {
        console.log("Synced database.");
    })
    .catch((err) => {
        console.log("Failed to sync database: " + err.message);
    });

db.sequelize
    .authenticate()
    .then(() => {
        console.log("Connection has been established successfully.");
    })
    .catch((error) => {
        console.error("Unable to connect to the database: ", error);
    });

app.get("/", async function (req, res) {
    await Users.destroy({
        truncate: true,
    });
    const user1 = await Users.create({ Name: "Hans", WalletBalance: 3510.84 });
    const user2 = await Users.create({ Name: "Sergio", WalletBalance: 1654.89 });
    const user3 = await Users.create({ Name: "Mark", WalletBalance: 1058.41 });
    const user4 = await Users.create({ Name: "John", WalletBalance: 22168.58 });
    const user5 = await Users.create({ Name: "Mauro", WalletBalance: 2048.61 });

    await Shares.destroy({
        truncate: true,
    });
    const shareEUR = await Shares.create({ ShareSymbol: "EUR", ShareCount: 146, Price: 489.6 });
    const shareUSD = await Shares.create({ ShareSymbol: "USD", ShareCount: 25, Price: 10652.24 });
    const shareTRY = await Shares.create({ ShareSymbol: "TRY", ShareCount: 100, Price: 26.36 });

    await Transaction.destroy({
        truncate: true,
    });
    await Portfolio.destroy({
        truncate: true,
    });
    await transactionController.BulkInsert(UserId = user1.Id, ShareId = shareEUR.Id, ShareSize = 1, Operation = "BUY");
    await transactionController.BulkInsert(UserId = user1.Id, ShareId = shareTRY.Id, ShareSize = 2, Operation = "BUY");
    await transactionController.BulkInsert(UserId = user2.Id, ShareId = shareTRY.Id, ShareSize = 5, Operation = "BUY");
    await transactionController.BulkInsert(UserId = user3.Id, ShareId = shareEUR.Id, ShareSize = 2, Operation = "BUY");
    await transactionController.BulkInsert(UserId = user3.Id, ShareId = shareUSD.Id, ShareSize = 8, Operation = "BUY");
    await transactionController.BulkInsert(UserId = user4.Id, ShareId = shareEUR.Id, ShareSize = 5, Operation = "BUY");
    await transactionController.BulkInsert(UserId = user5.Id, ShareId = shareTRY.Id, ShareSize = 9, Operation = "BUY");
    await transactionController.BulkInsert(UserId = user4.Id, ShareId = shareEUR.Id, ShareSize = 2, Operation = "SELL");
    await transactionController.BulkInsert(UserId = user5.Id, ShareId = shareTRY.Id, ShareSize = 3, Operation = "SELL");

    res.send({
        message: "EvaExchange Trading Game Started",
    });
});

app.listen(port, () => {
    console.log(`Now listening on port http://localhost:${port}`);
});