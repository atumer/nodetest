const http = require('http');

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;

const server = http.createServer((req, res) => {
  res.end('Hello World He He\n');
});

server.listen(server_port, function () {
  console.log( "Listening on port " + server_port );
});
