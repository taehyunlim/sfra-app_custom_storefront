"use strict"

var server = require("server")

server.get("Start", server.middleware.https, function (req, res, next) {
	var actionUrl = dw.web.URLUtils.url("Newsletter-Handler")
	var newsletterForm = server.forms.getForm("newsletter")
	newsletterForm.clear()

	res.render("/newsletter/newslettersignup", {
		actionUrl: actionUrl,
		newsletterForm: newsletterForm
	})

	next()
})

server.post("Handler", server.middleware.https, function (req, res, next) {
	var newsletterForm = server.forms.getForm("newsletter")
	var continueUrl = dw.web.URLUtils.url("Newsletter-Start")

	if (newsletterForm.valid) {
		res.render("/newsletter/newslettersuccess", {
			continueUrl: continueUrl,
			newsletterForm: newsletterForm
		})
	} else {
		res.render("/newsletter/newslettererror", {
			errorMsg: dw.web.Resource.msg(
				"error.crossfieldvalidation",
				"newsletter",
				null
			),
			continueUrl: continueUrl
		})
	}

	next()
})

module.exports = server.exports()
