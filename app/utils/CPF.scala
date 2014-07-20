package utils

import scala.util.Try
import scala.util.Failure
import scala.util.Success
import scala.util.Random

class CPF {
  def lastDigits(identifier: String) = {
    var first: Int = 0
    for (i <- 0 to 8)
      first += (i + 1) * identifier(i).toInt
    first %= 11
    first %= 10

    var second: Int = 0
    for (i <- 1 to 9)
      second += i * identifier(i % 9).toInt
    second %= 11
    second %= 10

    first * 10 + second
  }
}

object CPFGenerator extends CPF {
  def makeCPF = {
    val randomizer = Random
    val identifier = (randomizer.nextInt(900000000) + 100000000).toLong
    val verifier = this.lastDigits(identifier.toString)
    (identifier * 100 + verifier).toString
  }
}

object CPFChecker extends CPF {
  val isUndefined = "CPF is undefined"
  val isInvalid = "CPF is invalid"

  def validateCPF(identifier: Option[String]): Either[String, String] = {
    identifier match {
      case None => Left(isUndefined)
      case Some(identifier) => {
        if (identifier.trim.length == 0) Left(isUndefined)

        else
          Try(identifier.toLong) match {
            case Failure(_) => Left(isInvalid)
            case (Success(identifier)) =>
              val sIdentifier = identifier.toString
              
              if (identifier < 1) Left(isInvalid)
              else if (this.lastDigits(sIdentifier.substring(0, 9)) != sIdentifier.substring(9, 11)) Left(isInvalid)
              else Right(sIdentifier)
          }
      }
    }
  }
}