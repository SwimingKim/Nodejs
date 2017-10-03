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
```
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

