// var page = require("app_storefront_base/cartridge/controllers/Home")
var server = require("server")

// server.extend(page)
server.extend(module.superModule)

server.append("Test", function (req, res, next) {
	var viewdata = res.getViewData()
	res.setViewData({
		param1: "this is param1",
		prevViewData: viewdata
	})
	res.json({ test: "Hello SFCC!" })
	next()
})

module.exports = server.exports()
