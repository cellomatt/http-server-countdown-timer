const http = require('http');
const fs = require('fs');

let endtime = null;

function msToTime(duration) {
  let seconds = Math.floor((duration / 1000) % 60);
  let minutes = Math.floor((duration / (1000 * 60)) % 60);
  let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  return hours + ":" + minutes + ":" + seconds;
}


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

    if (req.method === "GET" && req.url === "/set") {
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

    if (req.url === "/stylesheets/index.css") {
      var file =  __dirname + "/stylesheets/index.css";
      var stat = fs.statSync(file);
      res.writeHead(200, {
        'Content-Type': 'text/css',
        'Content-Length': stat.size
      });
      var readStream = fs.createReadStream(file);
      readStream.pipe(res);
    }

    if (req.url === "/stylesheets/countdown.css") {
      var file =  __dirname + "/stylesheets/countdown.css";
      var stat = fs.statSync(file);
      res.writeHead(200, {
        'Content-Type': 'text/css',
        'Content-Length': stat.size
      });
      var readStream = fs.createReadStream(file);
      readStream.pipe(res);
    }

    if (req.method === "GET" && req.url === "/timer") {
      const timer = fs.readFileSync("countdown.html", "utf-8")
      let timeLeft
      if (endtime === null) {
        timeLeft = '00:00:00'
      } else {
        timeLeft = endtime - new Date()
        if (timeLeft < 0) {
          timeLeft = '00:00:00'
        } else {
          timeLeft = msToTime(timeLeft)
        }
      }
      const updateTimer = timer
        .replace(/#{timeLeft}/g, timeLeft)
      res.setStatusCode = 200;
      res.setHeader("Content-Type", "text/html");
      return res.end(updateTimer);
    }

    if (req.method === "POST" && req.url === "/timer") {
      endtime = new Date()

      let currentHours = endtime.getHours()
      let currentMinutes = endtime.getMinutes()
      let currentSeconds = endtime.getSeconds()

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
