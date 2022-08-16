const pg = require('pg')

const client = new pg.Client({
    user: 'postgres',
    host: 'localhost',
    database: 'projetoreact',
    password: 'paprica13',
    port: 5432,
})

module.exports = client

