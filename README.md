# Nodejs

## 시작
```javascript
const http = require('http');

const hostname = '127.0.0.1';
const port = 1337;

http.createServer((req,res) => {
    res.writeHead(200, {'Content-Type':'text/plain'});
    res.end('Hello World\n');
}).listen(port, hostname, () => {
    console.log('Server running at http://${hostname}:${port}/');
});
```

## 패키지 설치
```
npm install express pug --save --g
```

## Express
```javascript
var express = require('express');
var app = express();

app.use(express.static('public'));
app.get('/', function(req, res) {
    res.send('Hello home page');
});
app.listen(3000, function() {
    console.log('Conected 3000 port');
});
```

## Dynamic HTML
```javascript
app.get('/dynamic', function(req, res) {
    var lis = '';
    for (var i=0; i<5; i++) {
        lis = lis + <li>coding</li>
    }
    var time = Date()
     var output = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Document</title>
    </head>
    <body>
        Hello, Dynamic!!
        ${lis}
        ${time}
    </body>
    </html>`;
    res.send(output);
});
```

## View Engine
```javascript
app.locals.pretty = true;
app.set('view engine', 'pug');
app.set('views', './views');

app.get('/template', function(req, res) {
    app.render('temp', {time:Date(), title:'Jade'});
});
```

## Query String ( http://localhost:3000/topic?id=0 )
```javascript
app.get('/topic', function(req, res) {
    var topics = [
        'JavaScript is ...',
        'Nodejs is ...',
        'Express is ...'
    ];
    var output = `
        <a href='/topic?id=0'>JavaScript</a><br>
        <a href='/topic?id=1'>Nodejs</a><br>
        <a href='/topic?id=2'>Express</a><br><br>
    ${topics[req.query.id]}
    `
    res.send(output);
});
```

## Symentic URL ( http://localhost:3000/2/edit )
```javascript
app.get('topic/:id/:mode', function(req, res) {
    res.send( req.params.id+','+req.params.mode );
});
```

## FORM (in Jade/Pug)
```javascript
form(action='/form_receiver' method='get/post')
    p
        input(type='text' name='title')
    p
        textarea(name='description')
    p
        input(type="submit")
```

## POST
```javascript
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended:false }));

app.post('/form', function(req, res) {
    res.send(req.body.id);
});
```

## File
```javascript
var fs = require('fs');
fs.writeFile( 'path/', data, function(err) {
    if (err) {
        console.log(err);
        res.status(500).send('Internal Sever Error');
    }
    res.redirect('/topic');
});
fs.readdir( 'path/', function(err, files) {
    if (err) {
        console.log(err);
        res.status(500).send('Internal Sever Error');
    }
    res.send( files.length + ' files' );
    res.render('view', {datas:files});
});
fs.readFile('data/'+id, 'utf8', function(err, data) {
    if (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
    res.send( data );
});
```

## multer
```
npm install multer --save
```
```javascript
var multer = require('multer');
var _storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, file.orginalname);
    } 
});
var upload = multer({ storage:_storage });

app.post('/upload', upload.single('userfile'), function(req, res) {
    console.log('Uploaded '+req.file.filename);
});
```

## OrientDB
```
npm install orientjs --save
```
```javascript
var OrientDB = require('orientjs');
var server = OrientDB({
    host: localhost,
    port: 2424,
    username: 'root',
    password: '****'
});
var db = server.use('dbname');

// SELECT
var sql = 'SELECT FROM topic';
db.query(sql).then(function(results) {
    console.log(results);
});
var sql = 'SELECT FROM topic WHERE @rid=:rid';
var param = {
    params: {
        rid: '#18:0'
    }
};
db.query(sql, param).then(function(results) {
    console.log(result);
});

// INSERT
var sql = 'INSERT INTO topic(title, description) VALUES (:title, :description)';
db.query(sql, {
    params: {
        title: 'Express',
        description: 'Express is framework for web'
    }
 }).then(function(results) {
     console.log(results);
 });

// UPDATE
var sql = 'UPDATE topic SET title=:title WHERE @rid=:rid';
db.query(sql, {params:{title:'Express', rid:'#21:0'}})
.then(function(results) {
    console.log(results);
});

// DELETE
var sql = 'DELETE VERTEX FROM topic WHERE @rid=:rid';
db.query(sql, {params:{rid:'#21:0'}}).then(funciotn(results) {
    console.log(results);
});
```

## MySQL
```
npm install node-mysql --save
```
```javascript
var mysql = require('mysql');
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '****',
    database: 'dbname'
});
conn.connect();

// SELECT
var sql = 'SELECT * FROM topic';
conn.query(sql, function(err, rows, fields) {
    if (err) {
        console.log(err);
    } else {
        for (var i=0; i<rows.lenght; i++) {
            console.log(rows[i].author);
        }
    }
});

// INSERT
var sql = 'INSERT INTO topic (title, description, author) VALUES ("Nodejs", "Server side javascript", "dev")';
conn.query(sql, function(err, rows, fields) {
    if (err) {
        console.log(err);
    } else {
        console.log(rows);
    }
});

// UPDATE
var sql = 'UPDATE topic SET title=?, author=? WHERE id=?';
var params = ['NPM', 'skim', 1];
conn.query(sql, params, function(err, rows, fields) {
    if (err) {
        console.log(err);
    } else {
        console.log(rows);
    }
});

// DELETE
var sql = 'DELETE FROM topic WHERE id=?';
var params = [1];
conn.query(sql, params, function(err, rows, fields) {
    if (err) {
        console.log(err);
    } else {
        console.log(rows);
    }
});
conn.end();
```

## Cookie
```
npm install cookie-parser --save
```
```javascript
var cookieParser = require('cookie-parser');

app.use(cookieParser('asdasd12e!@#sa'));
var.get('/count', function(req, res) {
    if (req.signedCookies.count) {
        req.signedCookies.count++;
    } else {
        req.signedCookies.count = 1;
    }
    res.cookie('count', count, {signed:true});
    res.send('count : '+count);
});
```

## Session
### general
```
npm install express-session --save
```
```javascript
var session = require('express-session');
app.use(session({
    secret: 'adsa!@#!SDFa32',
    resave: false,
    saveUninitialized: true
}));

app.get('/count', function(req, res) {
    if (req.session.count) {
        req.session.count++;
    } else {
        req.session.count = 1;
    }
    res.send('count : '+req.session.count);
});
```
### file
```
npm install session-file-store --save
```
```javascript
var FileStore = require('session-file-store')(session);
app.use(seesion({
    secret: 'adsa!@#!SDFa32',
    resave: false,
    saveUninitialized: true,
    store: new FileStore()
}));
```
### MySQL
```
npm install express-mysql-session --save
```
```javascript
var MySQLStore = require('express-mysql-session')(session);
app.use(seesion({
    secret: 'adsa!@#!SDFa32',
    resave: false,
    saveUninitialized: true,
    store: new FileStore()
}));
```
### OrientDB
```
npm install connect-oriento --save
```
```javascript
var OrientoStore = require('connect-oriento')(session);
app.use(session({
    secret: 'afdfa@!#324',
    resave: false,
    saveUninitialized: true,
    store: new OrientoStore({
        server:'host=localhost&port=2424&username=root&password=pwd&db=dbname'
    })
}));
```