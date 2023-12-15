module.exports = (sequelize, DataTypes) => {
    const Transaction = sequelize.define("Transactions", {
        Id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        UserId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        ShareId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        ShareSize: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        TotalPrice: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        Operation: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    return Transaction;
};