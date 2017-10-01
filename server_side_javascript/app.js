var express = require('express');
var app = express();

app.locals.pretty = true;
app.set('views', './views');
app.set('view engine', 'jade');
app.use(express.static('public'));
// app.get('/topic', function(req, res) {
//     var topics = [
//         'JavaScript is ...',
//         'Nodejs is ...',
//         'Express is ...'
//     ];
//     var output = `
//         <a href='/topic?id=0'>JavaScript</a><br>
//         <a href='/topic?id=1'>Nodejs</a><br>
//         <a href='/topic?id=2'>Express</a><br><br>
//         ${topics[req.query.id]}
//     `
//     res.send(output);
// });
app.get('/topic/:id', function(req, res) {
    var topics = [
        'JavaScript is ...',
        'Nodejs is ...',
        'Express is ...'
    ];
    var output = `
        <a href='/topic?id=0'>JavaScript</a><br>
        <a href='/topic?id=1'>Nodejs</a><br>
        <a href='/topic?id=2'>Express</a><br><br>
        ${topics[req.params.id]}
    `
    res.send(output);
});
app.get('/topic/:id/:mode', function(req, res) {
    res.send(req.params.id+','+req.params.mode);
});
app.get('/template', function(req, res) {
    res.render('temp', {time:Date(), title:'Jade'});
});
app.get('/', function(req, res) {
    res.send('Hello home page');
});
app.get('/dynamic', function(req, res){
    var lis = '';
    for (var i=0; i<5; i++) {
        lis = lis + '<li>coding</li>';
    }
    var time = Date();
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
app.get('/route', function(req, res){
    res.send('Hello Router, <img src="route.png"/>');
});
app.get('/login', function(req, res) {
    res.send('Login please');
});
app.listen(3000, function() {
    console.log('Connected 3000 port');
});
