const express = require('express');
const cors = require('cors')
const bcrypt = require('bcryptjs');
const { database } = require('./db');

const app = express();

app.use(express.json());
app.use(cors())



// database.select('*').from('users')
// .then( data => console.log(data))


app.get('/', (req, res) =>{
    res.send(database.users)
})


app.post('/signin', (req, res) =>{
   
    if(req.body.email === database.users[0].email && req.body.password === database.users[0].password){
        return res.json(database.users[0])
    }else{
        return res.status(400).json('error logging in ')
    }
})


app.post('/register', (req, res) =>{

    const { fullname, email, password, joined } = req.body;

    // bcrypt.hash(password, 8, function(err, hash) {
    //     console.log(hash)
    // });

    database('users')
    .returning('*')
    .insert({
        fullname: fullname,
        email: email,
        joined: new Date()
    }).then(user =>{
        res.json(user[0]);
    })
    .catch( err => res.status(400).json('Unable to register.'))
})

app.get('/profile/:id', (req, res) =>{

    const { id } = req.params;
    database.select('*').from('users').where({
        id: id
    })
    .then( user =>{

        if(user.length){
            res.json(user[0]);
        }else{
            res.status(400).json('Not found')
        }
    })
    .catch(err => res.status(400).json('error getting user'))

})

app.put('/image', (req, res) =>{
    const { id } = req.body;
    database('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        console.log(entries)
    })
})

app.listen(8000 , () =>{
    console.log('App is running on port 8000')
})