module.exports = function(passport) {
    
    var route = require('express').Router();
    var bkfd2Password = require('pbkdf2-password');
    var hasher = bkfd2Password();
    var db = require('../../config/orientdb/db')();
    route.post('/login',
        passport.authenticate(
            'local',
            {
                successRedirect: '/topic',
                failureRedirect: '/auth/login',
                faliureFlash: false
            }
        )
    );
    route.get('/facebook',
        passport.authenticate(
            'facebook',
            { scope: 'email' }
        )
    );
    route.get('/facebook/callback',
        passport.authenticate(
            'facebook',
            {
                successRedirect: '/topic',
                failureRedirect: '/auth/login'
            }
        )
    );
    var users = [
        {
            authId: 'local:egoing',
            username: 'egoing',
            password: 'NtaXUsnaAbUrAW8dsCratN3MhZkPs0qvp9ew5HwgLbm/dbI6sI91Xzr5h58//SV4IoqhPlI53JFoeVeo6ifdQetBXjVvc+AhBMEPv3c8c/9kD/RKn7Pfxwn+xJfQqh/MNhKcZUDkpD15a6LZb1AXUaiSQ8wLpXyFypVP5tuX6Mk=',
            salt: 'qAa8oRfF59K1N35PDhIQhL748mgcQ0VDg5fo01stP61j/0aHwe41CwJLvy4H1YP08rsgGhxy+ufACEiUQp2meQ==',
            displayName: 'Egoing'
        }
    ];
    route.post('/register', function (req, res) {
        hasher({ password: req.body.password }, function (err, pass, salt, hash) {
            var user = {
                authId: 'local:' + req.body.username,
                username: req.body.username,
                password: hash,
                salt: salt,
                displayName: req.body.displayName
            };
            var sql = 'INSERT INTO user (authId, username, password, salt, displayName) VALUES (:authId, :username, :password, :salt, :displayName)';
            db.query(sql, {
                params: user
            }).then(function (results) {
                req.login(user, function (err) {
                    req.session.save(function () {
                        res.redirect('/topic');
                    });
                });
            }, function (error) {
                console.log(error);
                res.status(500);
            });
        });
    });
    route.get('/register', function (req, res) {
        var sql = 'SELECT FROM topic';
        db.query(sql).then(function(topics) {
            res.render('auth/register', {topics:topics});
        });
    });
    route.get('/login', function (req, res) {
        var sql = 'SELECT FROM topic';
        db.query(sql).then(function(topics) {
            res.render('auth/login', {topics:topics});
        });
    });
    route.get('/logout', function (req, res) {
        req.logout();
        req.session.save(function () {
            res.redirect('/topic');
        });
    });
    return route;

};