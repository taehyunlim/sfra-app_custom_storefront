var server = require("server")

server.get("Show", server.middleware.https, function (req, res, next) {
	res.json({ value: "Hello World" })
	next()
})

module.exports = server.exports()
