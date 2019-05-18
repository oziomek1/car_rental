var bcrypt = require('bcrypt');

module.exports = function (sequelize, DataTypes) {
    let User = sequelize.define('User', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                len: [4,25]
            }
        },
        name: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        isAdmin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        timestamps: false
    });
    User.prototype.validPassword = function (password) {
        return bcrypt.compareSync(password, this.password);
    };

    return User;
};