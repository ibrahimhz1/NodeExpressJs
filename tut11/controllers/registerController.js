const usersDB = {
    users: require('../models/users.json'),
    setUsers: function (data) { this.users = data }
};

const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const handleNewUser = async(req, res) => {
    const {uname, pwd} = req.body;
    if(!uname || !pwd) return res.status(400).json({"message": "Username and Password are required"});
    // check for duplicate username in the db
    const duplicate = usersDB.users.find((person) => person.username === uname );
    if(duplicate) return res.sendStatus(409); // Conflict
    try {
        // encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10);
        // store the new user
        const newUser = {
            "username": uname, 
            "roles": {"User": 2001},
            "password": hashedPwd,
        };
        usersDB.setUsers([...usersDB.users, newUser]);
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'models', 'users.json'),
            JSON.stringify(usersDB.users)
        );
        console.log(usersDB.users);
        res.status(201).json({'success': `New User ${uname} created`});
    } catch (err) {
        res.status(500).json({"message": err.message});
    }
}

module.exports = {handleNewUser};