package models.actors

import scala.annotation.migration

import akka.actor._
// import configuracao.ParametrosDeExecucao
import models.Person
import play.libs.Akka

object PersonRepository {

  def props = Props(classOf[PersonRepository])

  trait Result

  case class Save(person: Person)
  case class Get(cpf: Long)
  case class GetMany(cpfs: Iterable[Long])

  // case object PessoaCadastrada extends RespostaRepositorio
  // case object MaximoPessoasAtingido extends RespostaRepositorio
  // case class AlturaForaDosLimites(minima: Int, maxima: Int) extends RespostaRepositorio
  // case class PessoaJaCadastrada(pessoa: Pessoa) extends RespostaRepositorio
  // case class PessoaComMesmoNomeDesenvolvedor(nomeDesenvolvedor: String) extends RespostaRepositorio
  
  case class Found(person: Person) extends Result
  case class NotFound(cpf: Long) extends Result
  case class FoundPeople(person: Iterable[Person]) extends Result
  case class PeopleCount(quantity: Int)
  
  case class Success() extends Result

  case object Clear
  case object List
  case object Count
  // case class PessoasRemovidas(qtd: Int) extends Result
  //PessoasLidas(pessoa: Iterable[Pessoa])

}


class PersonRepository extends Actor {

  //Import tudo de PersonRepository
  import models.actors.PersonRepository._
  
  var people = Map[Long, Person]()

  def receive = {
    case Clear => {
      sender ! Success
    }
  }

  /*
  def receive = {
    case Save(pessoa) => {
      if (pessoas.size == qtdMaximaPessoas){
        sender ! MaximoPessoasAtingido
      } else if (pessoa.altura > ParametrosDeExecucao.alturaMaxima || pessoa.altura < ParametrosDeExecucao.alturaMinima) {
        sender ! AlturaForaDosLimites(ParametrosDeExecucao.alturaMinima, ParametrosDeExecucao.alturaMaxima)
      } else if (pessoa.nome == ParametrosDeExecucao.nomeDesenvolvedor) {
        sender ! PessoaComMesmoNomeDesenvolvedor(ParametrosDeExecucao.nomeDesenvolvedor)
      } else if (pessoas.contains(pessoa.cpf)){
        sender ! PessoaJaCadastrada(pessoas(pessoa.cpf))
      }else{
        pessoas += (pessoa.cpf -> pessoa)
        sender ! PessoaCadastrada
      }
    }
    
    case Clear => {
      val numeroPessoas = pessoas.size
      //Sobreescreve o mapeamento de pessoas com um Map vazio
      pessoas = Map()
      //Envia ("!" é um método) um objeto PessoasRemovidas com o número de pessoas removidas para quem chamou
      sender ! PessoasRemovidas(numeroPessoas)
    }

    case Get(cpf) => {
      if (pessoas.contains(cpf))
        sender ! PessoaLida(pessoas(cpf))
      else
        sender ! PessoaNaoCadastrada(cpf)
    }
    
    case GetMany(cpfs) => {
      val pessoasCadastradas = for(cpf <- cpfs) yield pessoas(cpf)
      sender ! PessoasLidas(pessoasCadastradas)
    }

    case List => sender ! PessoasLidas(pessoas.values)
    case Count => sender ! QuantidadePessoas(pessoas.size)
  } */
}