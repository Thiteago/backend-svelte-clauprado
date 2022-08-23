const Usuario = require('../Model/Usuario');
const CriaUsuario = require('../DAO/User');
const autenticaUsuario = require('../DAO/User');

class LogUsuario {
  constructor(email, senha) {
    (this.email = email), (this.senha = senha);
  }
}

var NovoUsuario = new Usuario();
var inputLogin = new LogUsuario();

exports.postNovoUsuario = (req, res, next) => {
  NovoUsuario = req.body;
  CriaUsuario.CreateUser(NovoUsuario);
  res.sendStatus(201);
};

exports.postLogin = async (req, res) => {
  inputLogin = req.body;
  var Result = await autenticaUsuario.authUser(inputLogin);

  if (Result == 1) {
    res.sendStatus(201);
  } else {
    res.sendStatus(401);
  }
};

exports.put = (req, res, next) => {
  let id = req.params.id;
  res.status(201).send(`Rota PUT com ID! --> ${id}`);
};

exports.delete = (req, res, next) => {
  let id = req.params.id;
  res.status(200).send(`Rota DELETE com ID! --> ${id}`);
};

exports.get = (req, res, next) => {
  res.status(200).send('Rota GET!');
};

exports.getById = (req, res, next) => {
  let id = req.params.id;
  res.status(200).send(`Rota GET com ID! ${id}`);
};
