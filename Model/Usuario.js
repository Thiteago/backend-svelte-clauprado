
module.exports = class Usuario{
    constructor(id, nome, dataNascimento, email, senha, cpf, rua, numeroRua, bairro, cidade, cep, numeroTel, numeroCel){
        this.nome = nome;
        this.id = id;
        this.dataNascimento = dataNascimento;
        this.email = email;
        this.senha = senha;
        this.cpf = cpf;
        this.rua = rua;
        this.numeroRua = numeroRua;
        this.bairro = bairro;
        this.cidade = cidade;
        this.cep = cep;
        this.numeroTel = numeroTel;
        this.numeroCel = numeroCel;
    }

};