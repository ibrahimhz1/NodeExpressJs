const User = require('../models/User');

const bcrypt = require('bcrypt');

const handleNewUser = async(req, res) => {
    const {uname, pwd} = req.body;
    if(!uname || !pwd) return res.status(400).json({"message": "Username and Password are required"});
    // check for duplicate username in the db
    const duplicate = await User.findOne({username: uname}).exec();
    if(duplicate) return res.sendStatus(409); // Conflict
    try {
        // encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10);
        // create and store the new user
        const result = await User.create({
            "username": uname, 
            "password": hashedPwd
        });
        
        console.log(result);
        
        res.status(201).json({'success': `New User ${uname} created`});
    } catch (err) {
        res.status(500).json({"message": err.message});
    }
}

module.exports = {handleNewUser};