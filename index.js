var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {}
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/upload"] = requestHandlers.upload;
handle["/shortUrl"] = requestHandlers.shortUrl;
handle["/parseShortUrl"] = requestHandlers.parseShortUrl;

server.start(router.route, handle);