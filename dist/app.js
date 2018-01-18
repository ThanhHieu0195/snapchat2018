"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http = require("http");
var socket_io = require("socket.io");
var fs = require("fs");
var Cookies = require("cookies");
var random_name = require("node-random-name");
var ChatModel = require("./chat.model");
var mongoose = require("mongoose");
var app = http.createServer(handler);
var io = socket_io(app);
app.listen(process.env.PORT || 80, function () {
    console.log('connected to *:80');
});
function handler(req, res) {
    var cookies = new Cookies(req, res);
    var filePath = req.url;
    //index file
    if (filePath == '/') {
        var userId = cookies.get('userId');
        if (userId == undefined) {
            cookies.set('userId', random_name(), { httpOnly: false });
        }
        filePath = './dist/templates/formchat.html';
        fs.readFile(filePath, function (err, data) {
            if (err) {
                console.log(err);
                res.writeHead(500);
                res.end();
            }
            else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data, 'utf-8');
            }
        });
    }
    else if (filePath.match(/\/api\//)) {
        var match = filePath.match(/\/api\/(.*)/);
        var params = match[1].split("/");
        if (req.method == 'POST') {
            var data = '';
            req
                .on('data', function (prd) {
                data += prd;
            })
                .on('end', function () {
                res.end('data: ' + data.toString());
            });
        }
        if (req.method == 'GET') {
            switch (params[0]) {
                case 'getMessage':
                    var chatmodel = ChatModel.chatmodel;
                    chatmodel._model.find(function (err, data) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            res.writeHead(200, { 'Content-Type': 'text/json' });
                            res.end(data.toString());
                        }
                    });
                    break;
                default:
                    res.end('api not support');
            }
        }
    }
    else if (filePath.match(/\/statics\//)) {
        filePath = 'dist' + filePath;
        fs.readFile(filePath, function (err, data) {
            if (err) {
                console.log(err);
                res.writeHead(500);
                res.end();
            }
            else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data, 'utf-8');
            }
        });
    }
    else {
        res.writeHead(404);
        res.end('Page not found');
    }
}
//area socket.io
io.on('connection', function (socket) {
    socket.on('chatSend', function (data) {
        var notice = "notice from " + data.userId + ": " + data.message;
        var model = ChatModel.chatmodel;
        var sc_current = socket;
        model.insert(data.message, function () {
            sc_current.broadcast.emit('chatReceive', data);
        });
    });
});
var MONGODB_STR = 'mongodb://hieutct:123@ds159997.mlab.com:59997/snapchat';
mongoose.connect(MONGODB_STR);
//# sourceMappingURL=app.js.map