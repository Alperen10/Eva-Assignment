module.exports = (sequelize, DataTypes) => {
    const Share = sequelize.define("Shares", {
        Id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        ShareSymbol: {
            type: DataTypes.STRING(3),
            allowNull: false,
            unique: true
        },
        ShareCount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0
            }
        },
        Price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        LastUpdateDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    });

    return Share;
};