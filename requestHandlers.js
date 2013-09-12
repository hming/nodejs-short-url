var querystring = require("querystring");
var url = require("url");
var fs = require("fs");
var su = require("./shortUrl");
var db = require("./server").getDB();

function start(request, response, postData) {
  console.log("Request handler 'start' was called.");
    fs.readFile("./html/index.html", function(error, file) {
    if(error) {
      response.writeHead(500, {"Content-Type": "text/plain"});
      response.write(error + "\n");
      response.end();
    } else {
      response.writeHead(200, {"Content-Type": "text/html"});
      response.write(file);
      response.end();
    }
  });
}

function upload(request, response, postData) {
  console.log("Request handler 'upload' was called.");
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("You've sent the text: "+
  querystring.parse(postData)["text"]);
  response.end();
}


//生成短网址
function shortUrl(request, response, postData){
  console.log("Request handler 'shortUrl' was called.");
  org_url = querystring.parse(postData)["org_url"];
  var new_url = su.getShortUrl(org_url);
  var values = [org_url,new_url];
  addUrl(values);
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write(new_url)
  response.end();
}

//短网址解析
function parseShortUrl(request, response, pathname){
  console.log("Request handler 'parseShortUrl' was called.");
  response.writeHead(200, {"Content-Type": "text/plain"});
  db.serialize(function() {
      x = db.get("SELECT url FROM url_map where short_url=?",pathname.substring(1,pathname.length), function(err, row) {
        response.writeHead(302, {
                      'Location': row.url
                      });
        response.end();
      });
  });
}

function addUrl(values){
    console.log(JSON.stringify(db));
    db.serialize(function() {
    var stmt = db.prepare("INSERT INTO url_map VALUES (?,?)");
        stmt.run(values);
        stmt.finalize();  
    });
}

exports.start = start;
exports.upload = upload;
exports.shortUrl = shortUrl;
exports.parseShortUrl = parseShortUrl;