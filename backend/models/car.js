module.exports = function (sequelize, Datatypes) {
    let Car = sequelize.define('Car', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Datatypes.INTEGER
        },
        licensePlate: {
            type: Datatypes.STRING,
            unique: true,
        },
        make: {
            type: Datatypes.STRING,
            allowNull: false
        },
        model: {
            type: Datatypes.STRING
        },
        price: {
            type: Datatypes.DECIMAL(6,2),
            allowNull: false
        },
        imageUrl: {
            type: Datatypes.STRING
        }
    }, {
        timestamps: false
    });

    return Car;
};