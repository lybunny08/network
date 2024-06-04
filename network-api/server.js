const http = require('http');
const app = require('./src/app');

const port = 3000;

app.set('port', port);

const server = http.createServer(app);

server.listen(port, function() {
    console.log('Server run at : http://localhost:' + port);
});