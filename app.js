const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  let reqBody = '';

  req.on('data', (data) => {
    reqBody += data;
  });

  if (req.method === "GET" && req.url === "/") {
    const bodyView = fs.readFileSync("./views/new-player.html")
    res.setHeader("Content-Type", "text/html");
    return res.end(bodyView)
  }

  req.on('end', () => {
    if (reqBody) {
      req.body = reqBody
        .split("&")
        .map((keyValuePair) => keyValuePair.split("="))
        .map(([key, value]) => [key, value.replace(/\+/g, " ")])
        .map(([key, value]) => [key, decodeURIComponent(value)])
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});
    }

  });
});

const port = 5000;

server.listen(port, () => console.log('Server is listening on port', port));
