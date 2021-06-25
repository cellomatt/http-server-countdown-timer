const http = require('http');
const fs = require('fs');

let endtime = null;


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
      return res.end(home);
    }

    if (req.url === "/scripts.js") {
      var file =  __dirname + "/scripts.js";
      var stat = fs.statSync(file);
      res.writeHead(200, {
        'Content-Type': 'text/javascript',
        'Content-Length': stat.size
      });
      var readStream = fs.createReadStream(file);
      readStream.pipe(res);
    }

    if (req.url === "/app.js") {
      var file =  __dirname + "/app.js";
      var stat = fs.statSync(file);
      res.writeHead(200, {
        'Content-Type': 'text/javascript',
        'Content-Length': stat.size
      });
      var readStream = fs.createReadStream(file);
      readStream.pipe(res);
    }

    if (req.method === "GET" && req.url === "/timer") {
      const timer = fs.readFileSync("countdown.html")
      res.setStatusCode = 200;
      res.setHeader("Content-Type", "text/html");
      return res.end(timer);
    }

    if (req.method === "POST" && req.url === "/timer") {
      endtime = new Date()
      console.log(endtime)
      let currentHours = endtime.getHours()
      let currentMinutes = endtime.getMinutes()
      let currentSeconds = endtime.getSeconds()
      console.log(currentHours, currentMinutes, currentSeconds)
      currentHours += Number(req.body.hours)
      currentMinutes += Number(req.body.minutes)
      currentSeconds += Number(req.body.seconds)
      if (currentSeconds > 59) {
        currentMinutes += 1
        currentSeconds -= 60
      }
      if (currentMinutes > 59) {
        currentHours += 1
        currentMinutes -= 60
      }
      endtime.setHours(currentHours, currentMinutes, currentSeconds)
      res.writeHead(302, {
        'Content-Type': 'text/html',
        'Location': '/timer'
      });
      return res.end();
    }


  });
});

const port = 5000;

server.listen(port, () => console.log('Server is listening on port', port));

module.exports = { endtime }
