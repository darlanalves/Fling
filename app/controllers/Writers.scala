package controllers

import play.api.libs.json._
import play.api.libs.functional.syntax._
import models._

object Writes {
 implicit val personWrites: Writes[Person] = (
      (__ \ "cpf").write[String] and
      (__ \ "name").write[String] and
      (__ \ "gender").write[String] and
      (__ \ "height").write[Int]
  )(unlift(Person.unapply))
  implicit val personWishWrites: Writes[PersonWish] = (
      (__ \ "person").write[Person] and
      (__ \ "wishes").write[Int]
  )(unlift(PersonWish.unapply))
}