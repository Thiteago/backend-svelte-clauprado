const { response } = require("express");
const express = require("express");
const { randomUUID } = require("crypto")


const app = express();

app.use(express.json())

const products = [];

app.post("/products", (request, response) =>{
    //Nome e preço
    const {name, price} = request.body;

    const product = {
        name,
        price,
        id: randomUUID()
    }

    products.push(product)


    return response.json(product)
})

app.listen(4002, () => console.log("Servidor esta rodando na porta 4002"));