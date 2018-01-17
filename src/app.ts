var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var fs = require('fs');
var path = require('path');
var Cookies = require('cookies');
var random_name = require('node-random-name');

app.listen(80, function () {
    console.log('connected to *:80');
});

function handler(req, res) {
    var cookies = new Cookies( req, res );
    fs.readFile(__dirname + '/index.html', function (err, data) {
            var filePath = '.' + req.url;
            if (filePath == './') {
                cookies.set('userId', random_name(),  { httpOnly: false });
                filePath = './index.html';
            }

            var extname = path.extname(filePath);

            var contentType = 'text/html';
            switch (extname) {
                case '.js':
                    contentType = 'text/javascript';
                    break;
                case '.css':
                    contentType = 'text/css';
                    break;
                case '.json':
                    contentType = 'application/json';
                    break;
                case '.png':
                    contentType = 'image/png';
                    break;
                case '.jpg':
                    contentType = 'image/jpg';
                    break;
                case '.wav':
                    contentType = 'audio/wav';
                    break;
            }

            fs.readFile(filePath, function(error, content) {
                if (error) {
                    if(error.code == 'ENOENT'){
                        fs.readFile('./404.html', function(error, content) {
                            res.writeHead(200, { 'Content-Type': contentType });
                            res.end(content, 'utf-8');
                        });
                    }
                    else {
                        res.writeHead(500);
                        res.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
                        res.end();
                    }
                }
                else {
                    res.writeHead(200, { 'Content-Type': contentType });
                    res.end(content, 'utf-8');
                }
            });

        }
    );
}


io.on('connection', function (socket) {
   socket.on('chatSend', function (data) {
       let notice =`notice from ${data.userId}: ${data.message}`;
       console.log(notice);
       socket.emit('chatReceive', data);
   });
});