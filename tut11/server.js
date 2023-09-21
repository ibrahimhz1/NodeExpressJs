require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const corsOptions = require('./config/corsOptions');

const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const credentials = require('./middleware/credentials');

const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');

const PORT = process.env.PORT || 3500;


// connect to mongodb
connectDB();

// custom middlware logger
app.use(logger);

// Handle options credentials check - before CORS 
// and fetch cookies credentials requirements
app.use(credentials);

// middlwares for corsOptions
app.use(cors(corsOptions));

// built-in middlewares to handle urlencoded data
app.use(express.urlencoded({ extended: false }));

// built-in middlware for json
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

// built-in middlware for serve static file
app.use('/', express.static(path.join(__dirname, '/public')));

// routes
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

// verified routes
app.use(verifyJWT)
app.use('/employees', require('./routes/api/employees'));

app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    }
    else if (req.accepts('json')) {
        res.json({ error: "404 not found" });
    } else {
        res.type('txt').send("404 not found");
    }
});

app.use(errorHandler);
mongoose.connection.once('open', () => {
    console.log('Connected to mongodb');
    app.listen(PORT, () => console.log(`Server running on port : ${PORT}`));
});