package controllers

import play.api._
import play.api.mvc._
import play.api.Play.current

object Application extends Controller {

	def index = Action {
		val file = Play.getFile("public/app/index.html")
		Ok.sendFile(file, inline = true)
	}

}