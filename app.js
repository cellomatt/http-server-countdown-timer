const http = require('http');
const fs = require('fs');

let endtime;

const server = http.createServer((req, res) => {
  let reqBody = '';

  req.on('data', (data) => {
    reqBody += data;
  });


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

    if (req.method === "GET" && req.url === "/") {
      const home = fs.readFileSync("index.html")
      res.setStatusCode = 200;
      res.setHeader("Content-Type", "text/html");
      res.write(home)
      return res.end();
    }

    if (req.method === "GET" && req.url === "/timer") {
      const home = fs.readFileSync("countdown.html")
      res.setStatusCode = 200;
      res.setHeader("Content-Type", "text/html");
      res.write(home)
      return res.end();
    }
    

  });
});

const port = 5000;

server.listen(port, () => console.log('Server is listening on port', port));
