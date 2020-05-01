"use strict"

var stockInfo = require("./decorators/stockInfo")
var base = module.superModule

module.exports = function (product, apiProduct, options) {
	base.call(this, product, apiProduct, options)
	stockInfo(product, apiProduct)
	return product
}
