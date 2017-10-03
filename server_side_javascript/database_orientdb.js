var OrientDB = require('orientjs');

var server = OrientDB({
   host:       'localhost',
   port:       2424,
   username:   'root',
   password:   '882530'
});

var db = server.use('o2');
// db.record.get('#18:0').then(function(record) {
//     console.log('Loaded record: ', record.title);
// });

// SELECT
// var sql = 'SELECT FROM topic';
// db.query(sql).then(function(results) {
//     console.log(results);
// });

var sql = 'SELECT FROM topic WHERE @rid=:rid';
var param = {
    params : {
        rid: '#18:0'
    }
};
db.query(sql, param).then(function(results){
    console.log(results);
});

// INSERT
// var sql = 'INSERT INTO topic(title, description) VALUES (:title, :desc)';
// db.query(sql, {
//     params : {
//         title: 'Express',
//         desc: 'Express is framework for web'
//     }
// }).then(function(results) {
//     console.log(results);
// });

//UPDATE
// var sql = 'UPDATE topic SET title=:title WHERE @rid=:rid';
// db.query(sql, {params:{title:'Expressjs', rid:'#21:0'}})
// .then(function(results) {
//     console.log(results);
// });

//DELETE
var sql = 'DELETE VERTEX FROM topic WHERE @rid=:rid';
db.query(sql, {params:{rid:'#21:0'}}).then(function(results) {
    console.log(results);
});
