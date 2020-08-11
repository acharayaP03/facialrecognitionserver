const knex = require('knex');


const database = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'acharyaP03#',
        database: 'facial_recognition'
    }
})


module.exports = { database }