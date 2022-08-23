const pool = require('../db');

async function CreateUser(NovoUsuario) {
  await pool.connect();

  const queryUsuario =
    'INSERT INTO Usuarios (nome, dataNascimento, email, senha, cpf, rua, numeroRua, bairro, cidade, cep, numeroTel, numeroCel) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)';

  await pool.query(queryUsuario, [
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
}

async function consulta(query, valores) {
  await pool.connect();
  const result = await pool.query(query, valores);
  if (result.rowCount >= 1) {
    return 1;
  } else {
    return 2;
  }
}

async function authUser(logUser) {
  console.log(logUser.email, logUser.senha);
  const select = 'SELECT * FROM USUARIOS WHERE EMAIL = $1 AND SENHA = $2';
  const values = [logUser.email, logUser.senha];

  const Res = await consulta(select, values);
  console.log(Res);
  return Res;
}

module.exports.authUser = authUser;
module.exports.CreateUser = CreateUser;
