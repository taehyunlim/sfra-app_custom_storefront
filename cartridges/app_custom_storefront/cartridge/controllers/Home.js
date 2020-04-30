var page = require("app_storefront_base/cartridge/controllers/Home")
var server = require("server")

server.extend(page)

server.append("Test", function (req, res, next) {
	res.json({ test: "Hello SFCC!" })
	next()
})

module.exports = server.exports()
