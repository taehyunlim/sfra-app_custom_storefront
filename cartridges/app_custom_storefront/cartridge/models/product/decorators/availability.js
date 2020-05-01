"use strict"

var Resource = require("dw/web/Resource")

var base = module.superModule

module.exports = function (object, qty, minOrderQty, availabilityModel) {
	// Invoke the availability model on the base
	base.call(this, object, qty, minOrderQty, availabilityModel)

	Object.defineProperty(object, "ats", {
		enumerable: true,
		value: (function () {
			var availability = {}
			availability.messages = []
			var inventoryRecord = availabilityModel.inventoryRecord

			// Add a new message to the array of availability messages
			if (inventoryRecord) {
				availability.messages.push(
					Resource.msgf(
						"label.quantity.in.stock",
						"common",
						null,
						inventoryRecord.ATS.value
					)
				)
			}
			availability.messages.push(
				"Another test message from the availability decorator"
			)
			return availability
		})(),
	})
}
