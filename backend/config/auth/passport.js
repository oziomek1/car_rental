let LocalStrategy = require('passport-local').Strategy;
let bcrypt = require('bcrypt');

module.exports = function (passport, user) {

    let User = user;

    passport.serializeUser(function (user, done) {
        done(null, user.id)
    });

    passport.deserializeUser(function (id, done) {
        User.findByPk(id).then(function (user) {
            if (user) {
                done(null, user.get());
            } else {
                done(user.errors, null);
            }
        });
    });

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
        function (req, email, password, done) {
            let generateHash = function (plainPassword) {
                let salt = bcrypt.genSaltSync(10);
                let hash = bcrypt.hashSync(plainPassword, salt);
                return hash;
            };

            User.findOne({
                where: {
                    email: email
                }
            }).then(function (user) {
                if (user) {
                    return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                } else {
                    let userPassword = generateHash(password);
                    let data = {
                        username: req.body.username,
                        name: req.body.name,
                        email: email,
                        password: userPassword,
                    };

                    User.create(data).then(function (newUser, created) {
                        if (!newUser) {
                            return done(null, false);
                        } else {
                            return done(null, newUser);
                        }
                    });
                }
            });
        }
    ));

    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
        function (req, email, password, done) {
            let checkPasswordValidity = function (plainPassword, hashed) {
                return bcrypt.compareSync(plainPassword, hashed);
            };

            User.findOne({
                where: {
                    email: email
                }
            }).then(function (user) {
                if(!user) {
                    return done(null, false, req.flash('loginMessage', 'No user found.'));
                }
                if(!checkPasswordValidity(password, user.password)) {
                    return done(null, false, req.flash('loginMessage', 'Incorrect email/password.'))
                }

                return done(null, user.get());
            })
        }
    ));
}
