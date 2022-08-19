const Usuario = require('../Model/Usuario');
const CriaUsuario = require('../DAO/CreateUser');

var NovoUsuario = new Usuario();

exports.post = (req, res, next) => {
  NovoUsuario = req.body;
  CriaUsuario.CreateUser(NovoUsuario);
  res.sendStatus(201);
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
