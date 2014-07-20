package utils

case class Pagination(val queryString: Map[String, Seq[String]]) {
	val defaultLimit: Int = 10

	var page: Int = queryString.get("page").toString.toInt
	var limit: Int = queryString.get("limit").toString.toInt

	def offset: Int = {
		(page - 1) * limit
	}

	override def toString(): String = "page  = " + page + ", max = " + limit
}