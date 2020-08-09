const express = require('express');
const cors = require('cors')
const bcrypt = require('bcryptjs');

const app = express();

app.use(express.json());
app.use(cors())

const db = {
    users : [
        {
            id: '123',
            name : 'John Smith',
            email : 'john@gmail.com',
            password: 'cookies',
            entries : 0,
            joined : new Date()
        },
        {
            id: '456',
            name : 'Jane Smith',
            email : 'jane@gmail.com',
            password: 'cookies2',
            entries : 2,
            joined : new Date()
        }
    ]
}

app.get('/', (req, res) =>{
    res.send(db.users)
})


app.post('/signin', (req, res) =>{
   
    if(req.body.email === db.users[0].email && req.body.password === db.users[0].password){
        return res.json(db.users[0])
    }else{
        return res.status(400).json('error logging in ')
    }
})


app.post('/register', (req, res) =>{

    const { name, email, password } = req.body;

    bcrypt.hash(password, 8, function(err, hash) {
        console.log(hash)
    });

    db.users.push({
        id: '125',
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()
    })

    res.status(200).json(db.users[db.users.length-1])

})

app.get('/profile/:id', (req, res) =>{

    const { id } = req.params;
    let found = false;

    db.users.forEach(user =>{
        if(user.id === id){
            found = true;
            return res.json(user);
        }
    });
    if(!found){
        res.status(400).json('not found')
    }
})

app.put('/image', (req, res) =>{
    const { id } = req.body;
    let found = false;

    db.users.forEach(user =>{
        if(user.id === id){
            found = true;
            user.entries++
            return res.json(user.entries);
        }
    });
    if(!found){
        res.status(400).json('not found')
    }

})

app.listen(8000 , () =>{
    console.log('App is running on port 8000')
})