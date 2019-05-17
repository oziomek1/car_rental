var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');

let singupHashedPassword = '';
let loginHashedPassword = '';

module.exports = function (passport, user) {

    let User = user;

    //serialize
    passport.serializeUser(function (user, done) {
        done(null, user.id)
    });
    
    //deserialize
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
                console.log('Hash', hash);
                return hash;
               // return bcrypt.hashSync(plainPassword, 8);
            };

            let compareHash = function (plainPassword, hashed) {
                let result = bcrypt.compareSync(plainPassword, hashed);
                console.log(result);
            }

            console.log(password, generateHash(password));

            User.findOne({
                where: {
                    email: email
                }
            }).then(function (user) {
                if (user) {
                    return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                } else {
                    var userPassword = generateHash(password);
                    compareHash(password, userPassword);
                    singupHashedPassword = userPassword;
                    var data = {
                        user_name: req.body.user_name,
                        email: email,
                        password: userPassword,
                    };

                    User.create(data).then(function (newUser, created) {
                        if (!newUser) {
                            return done(null, false);
                        } else {
                            console.log(newUser);
                            console.log(created);
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
                loginHashedPassword = user.password;

                console.log('singupHashedPassword', singupHashedPassword, singupHashedPassword.length);
                console.log('loginHashedPassword', loginHashedPassword, loginHashedPassword.length);
                if(!checkPasswordValidity(password, user.password)) {
                    return done(null, false, req.flash('loginMessage', 'Incorrect email/password.'))
                }

                return done(null, user.get());
            })
        }
    ));
}
