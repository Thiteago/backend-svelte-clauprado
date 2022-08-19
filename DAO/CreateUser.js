const db = require('../db');
const Usuario = require('../Model/Usuario');

async function CreateUser(NovoUsuario) {
  await db.connect();

  const queryUsuario =
    'INSERT INTO Usuarios (nome, dataNascimento, email, senha, cpf, rua, numeroRua, bairro, cidade, cep, numeroTel, numeroCel) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)';

  await db.query(queryUsuario, [
    NovoUsuario.nome,
    NovoUsuario.dataNascimento,
    NovoUsuario.email,
    NovoUsuario.senha,
    NovoUsuario.cpf,
    NovoUsuario.rua,
    NovoUsuario.numeroRua,
    NovoUsuario.bairro,
    NovoUsuario.cidade,
    NovoUsuario.cep,
    NovoUsuario.numeroTel,
    NovoUsuario.numeroCel,
  ]);

  await db.end();
}

module.exports.CreateUser = CreateUser;
