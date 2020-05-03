"use strict"

var server = require("server")
var Resource = require("dw/web/Resource")
var URLUtils = require("dw/web/URLUtils")
var csrfProtection = require("*/cartridge/scripts/middleware/csrf")

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

		if (newsletterForm.valid) {
			res.json({
				success: true,
				redirectUrl: URLUtils.url("Newsletter-Success").toString()
			})
		} else {
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
