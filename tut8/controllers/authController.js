const usersDB = {
    users: require('../models/users.json'),
    setUsers: function (data) { this.users = data }
};

const bcrypt = require('bcrypt');
const handleLogin = async (req, res) => {
    const {uname, pwd} = req.body;
    if(!uname || !pwd) return res.status(400).json({"message": 'Username and Password is required'});
    const foundUser = usersDB.users.find(person => person.username === uname);
    if(!foundUser) return res.sendStatus(401); // Unauthorized
    // evaluate password
    const match = await bcrypt.compare(pwd, foundUser.password);
    if(match){
        // create JWTs
        res.json({'success': `User ${uname} is logged in`});
    }else{
        res.sendStatus(401); // Unauthorized
    }
}

module.exports = {handleLogin};