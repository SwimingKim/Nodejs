var express = require('express');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var bodyParser = require('body-parser');
var bkfd2Password = require('pbkdf2-password');
var passport = require('passport');
var LocalStratefy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var hasher = bkfd2Password();

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'afdfa@!#324',
    resave: false,
    saveUninitialized: true,
    store: new FileStore()
}));
app.use(passport.initialize());
app.use(passport.session());
app.get('/count', function (req, res) {
    if (req.session.count) {
        req.session.count++;
    } else {
        req.session.count = 1;
    }
    res.send('count : ' + req.session.count);
});
app.get('/auth/logout', function (req, res) {
    req.logout();
    req.session.save(function () {
        res.redirect('/welcome');
    });
});
app.get('/welcome', function (req, res) {
    if (req.user && req.user.displayName) {
        res.send(`
        <h1>Hello, ${req.user.displayName}</h1>
        <a href="/auth/logout">Log out</a>
        `);
    } else {
        res.send(`
        <h1>Welcome</h1>
        <ul>
        <li><a href="/auth/login">Login</a></li>
        <li><a href="/auth/register">Register</a></li>
        </ul>
        `);
    }
});
passport.serializeUser(function (user, done) {
    console.log('serializeUser', user);
    done(null, user.authId);
});
passport.deserializeUser(function (id, done) {
    console.log('deserializeUser', id);
    for (var i = 0; i < users.length; i++) {
        var user = users[i];
        if (user.authId === id) {
            return done(null, user);
        }
    }
    done('There is no user.');
});
passport.use(new LocalStratefy(
    function (username, password, done) {
        var uname = username;
        var pwd = password;

        for (var i = 0; i < users.length; i++) {
            var user = users[i];
            if (uname == user.username) {
                return hasher({ password: pwd, salt: user.salt }, function (err, pass, salt, hash) {
                    if (hash === user.password) {
                        console.log('LocalStratefy', user);
                        done(null, user);
                    } else {
                        done(null, false);
                    }
                });
            }
        }
        done(null, false);
    }
));
passport.use(new FacebookStrategy({
        clientID: '1963771450307168',
        clientSecret: '987cba5c59d8c21b74095fc0ff0e3c76',
        callbackURL: "/auth/facebook/callback",
        profileFields:['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified', 'displayName']
    },
    function(accessTocken, refreshTocken, profile, done) {
        console.log(profile);
        var authId = 'facebook:'+profile.id;
        for (var i=0; i<users.length; i++) {
            var user = users[i];
            if (user.authId == authId) {
                return done(null, user);
            }
        }
        var newuser = {
            'authId':authId,
            'displayName':profile.displayName,
            'email': profile.emails[0].value
        };
        users.push(newuser);
        done(null, newuser);
    }
));
app.post('/auth/login',
    passport.authenticate(
        'local',
        {
            successRedirect: '/welcome',
            failureRedirect: '/auth/login',
            faliureFlash: false
        }
    )
);
app.get('/auth/facebook',
    passport.authenticate(
        'facebook',
        {scope: 'email'}
    )
);
app.get('/auth/facebook/callback',
    passport.authenticate(
        'facebook',
        {
            successRedirect: '/welcome',
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
app.post('/auth/register', function (req, res) {
    hasher({ password: req.body.password }, function (err, pass, salt, hash) {
        var user = {
            authId: 'local:'+req.body.username,
            username: req.body.username,
            password: hash,
            salt: salt,
            displayName: req.body.displayName
        };
        users.push(user);
        req.login(user, function (err) {
            req.session.save(function () {
                res.redirect('/welcome');
            });
        });
    });
});
app.get('/auth/register', function (req, res) {
    var output = `
    <h1>Register</h1>
    <form action="/auth/register" method="post">
        <p>
            <input type="text" name="username" placeholder="username">
        </p>
        <p>
            <input type="password" name="password" placeholder="password">
        </p>
        <p>
            <input type="text" name="displayName" placeholder="displayName">
        </p>
        <p>
            <input type="submit">
        </p>
    </form>
    `;
    res.send(output);
});
app.get('/auth/login', function (req, res) {
    var output = `
    <h1>Login</h1>
    <form action="/auth/login" method="post">
        <p>
            <input type="text" name="username" placeholder="username">
        </p>
        <p>
            <input type="password" name="password" placeholder="password">
        </p>
        <p>
            <input type="submit">
        </p>
    </form>
    <a href="/auth/facebook">facebook</a>
    `;
    res.send(output);
});
app.listen(3003, function (req, res) {
    console.log('Connected 3003 port!!');
});