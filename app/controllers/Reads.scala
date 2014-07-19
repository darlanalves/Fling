package controllers

import play.api.libs.json._
import play.api.libs.functional.syntax._
import play.api.libs.json.Reads._
import models._

/**
 * Objeto com os leitores de json necessários para a aplicação
 */
object Reads {
 implicit val personReads: Reads[Person] = (
      (__ \ "cpf").read[Long] and
      (__ \ "name").read[String](minLength[String](1)) and
      (__ \ "gender").read[String] and
      (__ \ "height").read[Int]
  )(Person.apply _)
}