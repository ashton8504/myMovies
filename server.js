const http = require('http'); // creates a variable called http and assigns to http module//

//This is what imports the http variable from above//
http.createServer((request, response) => { //request & response are the arguments (parameters), function will be called with every http request
  let addr = request.url;
  let q = new URL(addr, true);

  response.writeHead(200, {'Content-Type': 'text/plain'}); // tells the server to add a header to the response
  response.end('Hello Node!\n');//This ends the response and sends back the message "hello node"
}).listen(8080);//this listens for requests on port 8080

console.log('My first Node test server is running on Port 8080.');

//fs (file system) module follows the url

const fs = require("fs");

fs.readFile('input.txt', (err, data) => {
  if (err) {
    throw err;
  }
  console.log('File content: ' + data.toString());
});