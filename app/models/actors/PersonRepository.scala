package models.actors

import scala.annotation.migration

import akka.actor._
import config.Definitions
import models.Person
import play.libs.Akka

import utils.CPFChecker
import utils.Pagination
import utils.QueryFilters

object PersonRepository {

  def props = Props(classOf[PersonRepository])

  trait Result

  case class Save(person: Person)
  case class FindOne(cpf: String)
  case class FindAll(filters: QueryFilters, pagination: Pagination)
  case object Clear
  case object Count

  case object Success extends Result
  case object LimitReached extends Result
  case class HeightOutOfBounds(min: Int, max: Int) extends Result
  case class AlreadyExists(person: Person) extends Result
  case class InvalidPerson(developerName: String) extends Result

  case class FoundOne(person: Person) extends Result
  case object FoundMany extends Result
  case class FoundAll(person: Iterable[Person]) extends Result
  case class PersonNotFound(cpf: String) extends Result

  case class PeopleCount(quantity: Int) extends Result
  case class RemovedCount(count: Int) extends Result
  case class ReadCount(person: Iterable[Person]) extends Result
}


class PersonRepository extends Actor {
  import models.actors.PersonRepository._

  var inMemoryPeople = Map[String, Person]()

  val heightOutOfBounds = HeightOutOfBounds(Definitions.minHeight, Definitions.maxHeight)
  val invalidPerson = InvalidPerson(Definitions.developerName)

  def receive = {
    case Save(person) => {
      if (inMemoryPeople.size == Definitions.peopleLimit) {
        sender ! LimitReached
      }

      else if (person.height > Definitions.maxHeight || person.height < Definitions.minHeight) {
        sender ! heightOutOfBounds
      } 

      else if (person.name == Definitions.developerName) {
        sender ! invalidPerson
      } 

      else if (inMemoryPeople.contains(person.cpf)){
        sender ! AlreadyExists(inMemoryPeople(person.cpf))
      }

      else{
        inMemoryPeople += (person.cpf -> person)
        sender ! Success
      }
    }

    case Clear => {
      val mapSize = inMemoryPeople.size
      inMemoryPeople = Map()
      sender ! RemovedCount(mapSize)
    }

    case FindOne(cpf) => {
      if (inMemoryPeople.contains(cpf))
        sender ! FoundOne(inMemoryPeople(cpf))
      else
        sender ! PersonNotFound(cpf)
    }

    case FindAll(filters, pagination) => {
      var foundList = Map[String, Person]()

      if (filters.cpf.trim != "") {
        if (inMemoryPeople.contains(filters.cpf)) {
          var person = inMemoryPeople(filters.cpf)
          foundList += (person.cpf -> person)
        }
      }

      else {
        // for(cpf <- cpfs) yield 
        if (filters.name.trim != "") {
          // TODO find all by name
        }

        if (filters.minHeight > 0) {
          // TODO filter the search results by minHeight
        }

        if (filters.gender.trim != "") {
          // TODO filter out those that are not in the given gender
        }
      }

      sender ! foundList
    }

    case List => sender ! FoundAll(inMemoryPeople.values)

    case Count => sender ! PeopleCount(inMemoryPeople.size)
  }
}