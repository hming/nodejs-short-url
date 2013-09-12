var http = require("http");
var url = require("url");
var sqlite3 = require('sqlite3').verbose();
var db = {};

function start(route, handle) {
  initDB();//初始化数据库
  function onRequest(request, response) {
    var postData = "";
    var pathname = url.parse(request.url).pathname;
    console.log("Request for " + pathname + " received.");

    request.setEncoding("utf8");

    request.addListener("data", function(postDataChunk) {
      postData += postDataChunk;
      console.log("Received POST data chunk  "+
      postDataChunk + " .");
    });

    request.addListener("end", function() {
      route(handle, pathname, request, response, postData);
    });

  }

  http.createServer(onRequest).listen(8888);
  console.log("Server has started.");
}

function getDB(){
  return new sqlite3.Database('./tmp.db');
}

//初始化数据库
function initDB(){
  db = getDB();
  db.serialize(function() {
    db.run("CREATE TABLE IF NOT EXISTS  url_map (url TEXT,short_url TEXT)");
  });
}

exports.start = start;
exports.getDB = getDB;