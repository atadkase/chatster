var chatster = require('express')();
var express = require('express');
var http = require('http').Server(chatster);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var mysql = require('mysql');
var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'chatster_schema'
});

con.connect(function(err) {
    if (err) {
        console.log('Error connecting to DB');
        return;
    }
    console.log('Connection established');
    // connected!
});

chatster.use(express.static(__dirname + '/public/css'));
chatster.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');

});

chatster.get('/client_script.js', function(req, res) {
    res.sendFile(__dirname + '/client_script.js');

});

chatster.get('/messages', function(req, response) {
    con.query('SELECT chat_name, timestmp, message FROM chat_message', function(err, res) {
        if (err) {
            console.log('Error inserting into DB');
        } else {
            console.log('Query Successful');
            response.send(res);
        }
    });
});

io.on('connection', function(socket) {
    console.log('A chatter has connected');
    socket.on('disconnect', function() {
        console.log('Chatter Disconnected');
    });

    socket.on('chatter_name', function(msg) {
        console.log(msg + ' has joined the chatroom');
        var chatter_name = msg;
    });

    socket.on('update_chat', function(req, resp) {
        con.query('SELECT chat_name, timestmp, message FROM chat_message', function(err, res) {
            if (err) {
                console.log('Error inserting into DB');
            } else {
                console.log('Query Successful ' + res);

                resp(res);
            }
        });
    });


    socket.on('message', function(packet) {
        var d = new Date();
        var time = (d.getUTCMonth() + 1) + '.' + d.getUTCDate() + '.' + d.getUTCFullYear() + ' ' + d.getUTCHours() % 12 + ':' + d.getUTCMinutes() + ':' + d.getUTCSeconds();
        if (d.getUTCHours() > 11)
            time = time + 'PM';
        else
            time = time + 'AM';
        //console.log(packet.name + ' says ' + packet.msg + ' at time ' + time);
        io.sockets.emit('proc_message', {
            name: packet.name,
            message: packet.msg,
            timestamp: time
        });
        var db_packet = {
            chat_name: packet.name,
            message: packet.msg,
            timestmp: time
        };
        con.query('INSERT INTO chat_message SET ?', db_packet, function(err, res) {
            if (err) {
                console.log('Error inserting into DB');
            } else {
                console.log('Last insert ID:', res.insertId);
            }
        });			

    });

});

http.listen(port, function() {
    console.log('Server Started: Go to localhost:' + port);
});