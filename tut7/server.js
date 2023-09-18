const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');

const corsOptions = require('./config/corsOptions');

const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');

const PORT = process.env.PORT || 3500;

// custom middlware logger
app.use(logger);

// middlwares for corsOptions
app.use(cors(corsOptions));

// built-in middlewares to handle urlencoded data
app.use(express.urlencoded({ extended: false }));

// built-in middlware for json
app.use(express.json());

// built-in middlware for serve static file
app.use('/', express.static(path.join(__dirname, '/public')));

// routes
app.use('/', require('./routes/root'));
app.use('/employees', require('./routes/api/employees'));

app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    }
    else if (req.accepts('json')) { 
        res.json({ error: "404 not found" });
    }else{
        res.type('txt').send("404 not found");
    }
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port : ${PORT}`));