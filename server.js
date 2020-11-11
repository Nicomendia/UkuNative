var http = require('http');
var port = 3000;

function logRequest(request) {
  console.log("Processing request for: ", request.url)
  console.log("Custom Header: ", request.headers["custom-app-header"])
  console.log("Request Processed\n")
}

http.createServer(function(request, response) {
  response.writeHead(200, {"Content-Type": "text/html"});
  switch(request.url) {
    case "/":
      response.write("<html><body>Welcome<a href='/bye'>Bye</a></body></html>");
      logRequest(request)
      break;
    case "/bye":
      response.write("<html><body>Bye<a href='/'>Welcome</a></body></html>");
      logRequest(request)
      break;
    default:
      break;
  }
  response.end();
}).listen(port);