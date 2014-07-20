package controllers

import scala.concurrent.Future
import scala.concurrent.duration._
import scala.util.Try
import akka.actor.PoisonPill
import akka.actor.Props
import akka.pattern.ask
import akka.util.Timeout

import models.Person
import models.actors.PersonRepository

import utils.Pagination
import utils.QueryFilters
import utils.CPFChecker

import play.api._
import play.api.mvc._
import play.libs.Akka
import utils._
import controllers.Reads._
import controllers.Writes._
import play.api.libs.json.JsError
import play.api.libs.json.Json
import play.api.libs.json.JsSuccess

object PersonController extends Controller {

  implicit val context = scala.concurrent.ExecutionContext.Implicits.global
  import play.api.Play.current

  val people = Akka.system.actorOf(PersonRepository.props)

  // val registroDesejos = Akka.system.actorOf(RegistroDesejos.props(repositorio))

  // def index = Action.async { implicit request =>
    // implicit val timeout = Timeout(10 seconds)

    // para requisições POST o AngularJS envia os dados no formato JSON
    // val form = request.body.asJson.get
  // }
  // 
  
  def index = Action.async { implicit request =>
    implicit val timeout = Timeout(10 second)

    val pagination = new Pagination(request.queryString)
    val filters = new QueryFilters(request.queryString)

    val response = (people.FindAll(filters, pagination)).mapTo[PersonRepository.FoundAll]
    
    val deferred = response.map(resp => resp match {
      case PersonRepository.FoundMany=>Ok(Json.obj("foo" -> "bar"))
      case PersonRepository.Success => Ok()
    }) recover {
      case _ => InternalServerError
    }

    deferred
  }
    
  def get = Action.async { implicit request =>
    implicit val timeout = Timeout(10 second)

    CPFChecker.validateCPF(Option(request.queryString("cpf").toString)) match {
      case Left(error) => Future.successful(Status(400)(error))

      case Right(cpf) => {
        val response = (people.FindOne(filters.cpf)).mapTo[PersonRepository.FoundOne]

        val deferred = response.map(resp => resp match {
          case PersonRepository.NotFound(cpf) => NotFound
          case PersonRepository.Found(person) => Ok(person)
          case PersonRepository.Success => Ok()
        }) recover {
          case _ => InternalServerError
        }

        deferred
      }
    }

    Future.successful(Status(200)(pagination.toString()))
  }
  
  /*def save = Action.async { implicit request =>
    implicit val timeout = Timeout(10 seconds)

    val form = request.body.asJson.get
    form.validate[Pessoa] match {
      case JsError(erros) => Future.successful(Ok(Json.obj("cod" -> "NOK", "erro" -> "Existem valores inválidos")))
      case JsSuccess(pessoa, _) => {
        val futResp = (repositorio ? PersonRepository.Save(pessoa)).mapTo[PersonRepository.RespostaRepositorio]
        futResp.map(msg => msg match {
          case PersonRepository.PessoaCadastrada => Ok(Json.obj("cod" -> "OK"))
        case PersonRepository.MaximoPessoasAtingido => 
          Ok(Json.obj("cod" -> "NOK", "erro" -> "O máximo de pessoas cadastradas foi atingido"))
        case PersonRepository.AlturaForaDosLimites(minima, maxima) => 
          Ok(Json.obj("cod" -> "NOK", "erro" -> s"A altura está fora dos limtes: $minima - $maxima"))
        case PersonRepository.PessoaJaCadastrada(pessoa) => 
          Ok(Json.obj("cod" -> "NOK", "erro" -> ("Uma pessoa já foi cadastrada com este CPF: " + pessoa.nome)))
        case PersonRepository.PessoaComMesmoNomeDesenvolvedor(nomeDesenvolvedor) => 
          Ok(Json.obj("cod" -> "NOK", "erro" -> s"O desenvolvedor não pode ser cadastrado: $nomeDesenvolvedor"))  
          }).recover {
          case _ => Ok(Json.obj("cod" -> "NOK", "erro" -> "Não conseguiu cadastrar"))
        }
      }
    }
  }
  
  def index = Action.async { implicit request =>
    implicit val timeout = Timeout(10 second)
    val futResp = (repositorio ? PersonRepository.List).mapTo[PersonRepository.RespostaRepositorio]
    futResp.map(msg => msg match {
      case PersonRepository.PessoasLidas(pessoas) => {
          val r = for (pessoa <- pessoas) yield Json.toJson(pessoa)
          Ok(Json.obj("cod" -> "OK", "pessoas" -> Json.toJson(r)))
      }
    }).recover {
      case _ => Ok(Json.obj("cod" -> "NOK", "erro" -> "Não conseguiu listar"))
    }
  }
  
  def delete = Action.async { implicit request =>
    implicit val timeout = Timeout(10 second)

    (for{
      respDesej <- (registroDesejos ? RegistroDesejos.Clear)
      respRep <- (repositorio ? PersonRepository.Clear).mapTo[PersonRepository.PessoasRemovidas]
    } yield {
      Ok(Json.obj(
        "cod" -> "OK", 
        "qtdPessoas" -> respRep.qtd
      ))
    }).recover {
      case _ => Ok(Json.obj(
        "cod" -> "NOK", 
        "erro" -> "Não conseguiu apagar"
      ))
    }
  }*/

}