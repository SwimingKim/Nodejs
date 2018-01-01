var express = require('express');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var bodyParser = require('body-parser');
var bkfd2Password = require('pbkdf2-password');
var hasher = bkfd2Password();

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'afdfa@!#324',
    resave: false,
    saveUninitialized: true,
    store: new FileStore()
}));
app.get('/count', function (req, res) {
    if (req.session.count) {
        req.session.count++;
    } else {
        req.session.count = 1;
    }
    res.send('count : ' + req.session.count);
});
app.get('/auth/logout', function (req, res) {
    delete req.session.displayName;
    res.redirect('/welcome');
});
app.get('/welcome', function (req, res) {
    if (req.session.displayName) {
        res.send(`
        <h1>Hello, ${req.session.displayName}</h1>
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
app.post('/auth/login', function (req, res) {
    var uname = req.body.username;
    var pwd = req.body.password;

    for (var i=0; i < users.length; i++) {
        var user = users[i];
        if (uname == user.username) {
            return hasher({password:pwd, salt:user.salt}, function(err, pass, salt, hash) {
                if (hash === user.password) {
                    req.session.displayName = user.displayName;
                    return req.session.save(function() {
                        res.redirect('/welcome');
                    });
                } else {
                    res.send('Who are you? <a href="/auth/login">Login</a>');
                }
            });
        }
        // if (uname === user.username && sha256(pwd+user.salt) === user.password) {
        //     req.session.displayName = user.displayName;
        //     return req.session.save(function() {
        //         res.redirect('/welcome');
        //     });
        // }
    }
});
var users = [
    {
        username:'egoing',
        password:'NtaXUsnaAbUrAW8dsCratN3MhZkPs0qvp9ew5HwgLbm/dbI6sI91Xzr5h58//SV4IoqhPlI53JFoeVeo6ifdQetBXjVvc+AhBMEPv3c8c/9kD/RKn7Pfxwn+xJfQqh/MNhKcZUDkpD15a6LZb1AXUaiSQ8wLpXyFypVP5tuX6Mk=',
        salt:'qAa8oRfF59K1N35PDhIQhL748mgcQ0VDg5fo01stP61j/0aHwe41CwJLvy4H1YP08rsgGhxy+ufACEiUQp2meQ==',
        displayName:'Egoing'
    }
];
app.post('/auth/register', function(req, res) {
    hasher({password:req.body.password}, function(err, pass, salt, hash) {
        var user = {
            username : req.body.username,
            password : hash,
            salt : salt,
            displayName : req.body.displayName
        };
        users.push(user);
        req.session.displayName = req.body.displayName;
        req.session.save(function() {
            res.redirect('/welcome');
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
    `;
    res.send(output);
});
app.listen(3000, function (req, res) {
    console.log('Connected 3000 port!!');
});