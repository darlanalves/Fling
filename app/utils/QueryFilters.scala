package utils

import utils.CPFChecker

class QueryFilters(val queryString: Map[String, Seq[String]]) {
  val cpfValid: Either[String, String] = CPFChecker.validateCPF(Option(queryString("cpf").toString))
  val cpf = queryString("cpf").toString
  val name: String = queryString("name").toString
  val height: Int = queryString("height").toString.toInt
  val minHeight: Int = queryString("minHeight").toString.toInt
  val maxHeight: Int = queryString("maxHeight").toString.toInt
  val gender: String = queryString("gender").toString
}