const express = require('express');
const cors = require('cors')
const bcrypt = require('bcryptjs');
const { database } = require('./db');
const { handleDefault, handleSignin ,handleRegister, handleProfile, handleImage } = require('./Controller/controller');

const app = express();

app.use(express.json());
app.use(cors())

app.get('/', (req, res) => handleDefault(req, res,database))


app.post('/signin', (req, res) => handleSignin(database, bcrypt)(req, res))// recurion example

app.post('/register', (req, res )=> handleRegister(req, res, database, bcrypt))

app.get('/profile/:id', (req, res) => handleProfile(req, res, database))

app.put('/image', (req, res) => handleImage(req, res, database))

app.listen(8000 , () =>{
    console.log('App is running on port 8000')
})