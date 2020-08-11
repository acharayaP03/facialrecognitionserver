// Default route
const handleDefault = (req, res, database, bcrypt) =>{
    const { id, fullname, email, entries, joined } = req.params;
    database.select('*').from('users')
    .then(user =>{
        res.json(user);
    })
    
}


//signin Endpoint..
const handleSignin = (database, bcrypt) => (req, res)=>{
   
    database.select('email', 'hash').from('login')
    .where( 'email', '=', req.body.email)
    .then(data => {
         const isValid = bcrypt.compareSync(req.body.password, data[0].hash)
 
         if(isValid){
             return database.select('*').from('users')
             .where('email', '=', req.body.email)
             .then(user => {
                 res.json(user[0])
             })
             .catch(err => res.status(400).json('Unable to get user'))
         }else{
             res.status(400).json('Incorrect credentials')
         }
    })
    .catch(err => res.status(400).json('Incorrect credentials'))
 }


//Register Endpoint 
const handleRegister = (req, res, database, bcrypt) =>{

    const { fullname, email, password, joined } = req.body;
    const hash = bcrypt.hashSync(password);

    //inorder to update two tables we need to implent transcation which will store password and email into the login table. 

    database.transaction( trans => {
        trans.insert({
            hash, 
            email
        })
        .into('login')
        .returning('email')
        .then(loginEmail =>{
           return trans('users')
            .returning('*')
            .insert({
                fullname: fullname,
                email: loginEmail[0], //[0] will return array rather than obj
                joined: new Date()
            }).then(user =>{
                res.json(user[0]);
            })
        })
        .then(trans.commit)
        .catch( trans.rollback)
    })
    .catch( err => res.status(400).json('Unable to register.'))
}

//Profile/:id endpoint 

const handleProfile = (req, res, database, bcrypt) =>{

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

}

// /image endpoint

const handleImage = (req, res, database, bcrypt) =>{
    const { id } = req.body;
    database('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0])
    })
    .catch(err => res.status(400).json('unable to get entries'))
}


module.exports = {handleDefault, handleSignin ,handleRegister, handleProfile, handleImage };