module.exports = function (app) {
    var passport = require('passport');
    var LocalStratefy = require('passport-local').Strategy;
    var FacebookStrategy = require('passport-facebook').Strategy;
    var bkfd2Password = require('pbkdf2-password');
    var hasher = bkfd2Password();
    var db = require('../../config/orientdb/db')();

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function (user, done) {
        console.log('serializeUser', user);
        done(null, user.authId);
    });
    passport.deserializeUser(function (id, done) {
        console.log('deserializeUser', id);
        var sql = "SELECT FROM user WHERE authId=:authId";
        db.query(sql, { params: { authId: id } }).then(function (results) {
            if (results.length === 0) {
                done('There is no user.');
            } else {
                done(null, results[0]);
            }
        });
    });
    passport.use(new LocalStratefy(
        function (username, password, done) {
            var uname = username;
            var pwd = password;

            var sql = 'SELECT * FROM user WHERE authId=:authId';
            db.query(sql, {
                params: { authId: 'local:' + uname }
            }).then(function (results) {
                if (results.length === 0) {
                    return done(null, false);
                }
                var user = results[0];
                return hasher({ password: pwd, salt: user.salt }, function (err, pass, salt, hash) {
                    if (hash === user.password) {
                        console.log('LocalStratefy', user);
                        done(null, user);
                    } else {
                        done(null, false);
                    }
                });
            });
        }
    ));
    passport.use(new FacebookStrategy({
        clientID: '1963771450307168',
        clientSecret: '987cba5c59d8c21b74095fc0ff0e3c76',
        callbackURL: "/auth/facebook/callback",
        profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified', 'displayName']
    },
        function (accessTocken, refreshTocken, profile, done) {
            console.log(profile);
            var authId = 'facebook:' + profile.id;
            var sql = 'SELECT FROM user WHERE authId=:authId';
            db.query(sql, { params: { authId: authId } })
                .then(function (results) {
                    if (results.length === 0) {
                        var newuser = {
                            'authId': authId,
                            'displayName': profile.displayName,
                            'email': profile.emails[0].value
                        };
                        var sql = 'INSERT INTO user (authId, displayName, email) VALUES (:authId, :displayName, :email)';
                        db.query(sql, { params: newuser }).then(function () {
                            done(null, newuser);
                        }, function (error) {
                            console.log(error);
                            done('Error');
                        });
                    } else {
                        return done(null, results[0]);
                    }
                });
        }
    ));


    return passport;

};