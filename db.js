var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'chatster_schema'
});

connection.connect(function(err) {
    if (err) {
        console.log('Error connecting to DB');
        return;
    }
    console.log('Connection established');
    // connected!
});

module.exports = connection;