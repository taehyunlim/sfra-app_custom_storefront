"use strict"

var server = require("server")
var Resource = require("dw/web/Resource")
var URLUtils = require("dw/web/URLUtils")
var csrfProtection = require("*/cartridge/scripts/middleware/csrf")
var logger = require("dw/system/Logger").getLogger("co.newsletter")

server.get(
	"Start",
	server.middleware.https,
	csrfProtection.generateToken,
	function (req, res, next) {
		var actionUrl = URLUtils.url("Newsletter-Handler")
		var newsletterForm = server.forms.getForm("newsletter")
		newsletterForm.clear()

		res.render("/newsletter/newslettersignup", {
			actionUrl: actionUrl,
			newsletterForm: newsletterForm
		})

		next()
	}
)

server.post(
	"Handler",
	csrfProtection.validateAjaxRequest,
	server.middleware.https,
	function (req, res, next) {
		var newsletterForm = server.forms.getForm("newsletter")
		var CustomObjectMgr = require("dw/object/CustomObjectMgr")

		// perform server-side validation before this point
		if (newsletterForm.valid) {
			this.on("route:BeforeComplete", function (req, res) {
				var Transaction = require("dw/system/Transaction")
				try {
					Transaction.wrap(function () {
						var CustomObject = CustomObjectMgr.createCustomObject(
							"NewsletterSubscription",
							newsletterForm.email.value
						)
						CustomObject.custom.firstName = newsletterForm.fname.value
						CustomObject.custom.lastName = newsletterForm.lname.value

						res.json({
							success: true,
							redirectUrl: URLUtils.url("Newsletter-Success").toString()
						})
					})
					// Testing logger
					logger.debug(
						"[Newsletter] Testing Debugger - successful entry: {}",
						newsletterForm.email.value
					)
				} catch (e) {
					var err = e
					if (err.javaName === "MetaDataException") {
						// Duplicate primary key on CO: send back message to client-side, but don't log error.
						// Testing logger
						logger.debug(
							"[Newsletter] Testing Debugger - duplicate primary key: {}",
							newsletterForm.email.value
						)
						res.json({
							success: false,
							error: [
								Resource.msg("error.subscriptionexists", "newsletter", null)
							]
						})
					} else {
						// Missing CO definition: Log error with message for site admin, set the response to error and send error page URL to client
						logger.error(
							Resource.msg("error.customobjectmissing", newsletter, null)
						)
						res.setStatusCode(500)
						res.json({
							error: true,
							redirectUrl: URLUtils.url("Error-Start").toString()
						})
					}
				}
			})
		} else {
			// Show server-side validation errors
			res.setStatusCode(500)
			res.json({
				success: false,
				error: [Resource.msg("error.crossfieldvalidation", "newsletter", null)]
			})
		}

		next()
	}
)

server.get("Success", server.middleware.https, function (req, res, next) {
	res.render("/newsletter/newslettersuccess", {
		continueUrl: URLUtils.url("Newsletter-Start"),
		newsletterForm: server.forms.getForm("newsletter")
	})

	next()
})

module.exports = server.exports()
