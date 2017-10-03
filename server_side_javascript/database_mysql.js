var mysql = require('mysql');
var conn = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '882530',
    database : 'o2'
});
conn.connect();

var sql = 'SELECT * FROM topic';
conn.query(sql, function(err, rows, fields) {
    if (err) {
        console.log(err);
    } else {
        // console.log('rows', rows);
        // console.log('fields', fields);
        for (var i=0; i<rows.length; i++) {
            console.log(rows[i].author);
        }
    }
});

// var sql = 'UPDATE topic SET title=?, author=? WHERE id=?';
// var params = ['NPM', 'leezche', 1];
// conn.query(sql, params, function(err, rows, fields) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log(rows);
//     }
// });

// var sql = 'DELETE FROM topic WHERE id=?';
// var params = [1];
// conn.query(sql, params, function(err, rows, fields) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log(rows);
//     }
// });
// conn.end();

