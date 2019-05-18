module.exports = function (sequelize, Datatypes) {
    let Rental = sequelize.define('Rental', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Datatypes.INTEGER
        },
        rentStart: {
            type: Datatypes.DATEONLY,
            allowNull: false
        },
        rentEnd: {
            type: Datatypes.DATEONLY,
            allowNull: false
        },
        price: {
            type: Datatypes.DECIMAL(6,2),
            allowNull: false
        },
        status: {
            type: Datatypes.STRING,
            defaultValue: 'Pending'
        }
    }, {
        timestamps: false
    });
    Rental.associate = function(models) {
        Rental.belongsTo(models.Car);
        Rental.belongsTo(models.User);
    };

    return Rental;
};