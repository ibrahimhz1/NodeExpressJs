const usersDB = {
    users: require('../models/users.json'),
    setUsers: function (data) { this.users = data }
};

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const fsPromises = require('fs').promises;
const path = require('path');

const handleLogin = async (req, res) => {
    const { uname, pwd } = req.body;
    if (!uname || !pwd) return res.status(400).json({ "message": 'Username and Password is required' });
    const foundUser = usersDB.users.find(person => person.username === uname);
    if (!foundUser) return res.sendStatus(401); // Unauthorized
    // evaluate password
    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
        const roles = Object.values(foundUser.roles);
        // create JWTs
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": foundUser.username,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30s' }
        );
        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        // Saving refreshToken with Current User
        const otherUsers = usersDB.users.filter(person => person.username !== foundUser.username);
        const currentUser = { ...foundUser, refreshToken };
        usersDB.setUsers([...otherUsers, currentUser]);
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'models', 'users.json'),
            JSON.stringify(usersDB.users)
        );
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 }); // secure: true --> for production
        res.json({ accessToken });
    } else {
        res.sendStatus(401); // Unauthorized
    }
}

module.exports = { handleLogin };
