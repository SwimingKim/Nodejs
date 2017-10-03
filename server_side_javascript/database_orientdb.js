var OrientDB = require('orientjs');

var server = OrientDB({
    host: 'localhost',
    port: 2480,
    username: 'root',
    password: '882530'
});

var db = server.use('o2');
// console.log('Using database: '+db.name);
