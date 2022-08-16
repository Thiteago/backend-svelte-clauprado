const express = require("express");

const app = express();

app.get("/primeira-rota", (request, response) => {
    return response.json({
        message: 'Acessou o json com nodemon'
    })
})

app.listen(4002, () => console.log("Servidor esta rodando na porta 4002"));