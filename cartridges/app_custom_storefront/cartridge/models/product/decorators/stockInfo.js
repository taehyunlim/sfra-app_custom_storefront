"use strict"

module.exports = function (object, apiProduct) {
	var inventoryRecord = apiProduct.availabilityModel.inventoryRecord
	Object.defineProperty(object, "stockinfo", {
		enumerable: true,
		value:
			apiProduct.availabilityModel.inventoryRecord == null
				? 0
				: parseInt(apiProduct.availabilityModel.inventoryRecord.ATS, 10),
	})
}
