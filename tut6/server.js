const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');

const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');

const PORT = process.env.PORT || 3500;

// custom middlware logger
app.use(logger);

// middlware for cors cross origin resource sharing
const whiteList = ['https://ibrahimhz.com', 'https://www.google.com', 'http://127.0.0.1:5500', 'http://localhost:3500'];
const corsOptions = {
    origin: (origin, callback) => {
        console.log(origin);
        if (whiteList.indexOf(origin) !== -1 || !origin) {
            console.log('in the whitelist');
            callback(null, true);
        } else {
            console.log('not in the whitelist')
            callback(new Error('not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

// built-in middlewares to handle urlencoded data
// in other words, form data;
// 'content-type' : application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));

// built-in middlware for json
app.use(express.json());

// built-in middlware for serve static file
app.use('/', express.static(path.join(__dirname, '/public')));
app.use('/subdir', express.static(path.join(__dirname, '/public')));

// routes
app.use('/', require('./routes/root'));
app.use('/subdir', require('./routes/subdir'));
app.use('/employees', require('./routes/api/employees'));

// Chaining Routes Concept

// // Route handlers
// app.get('/hello(.html)?', (req, res, next) => {
//     console.log('attempted to load hello.html');
//     next();
// }, (req, res, next) => {
//     res.send("hello world");
//     next();
// }, (req, res) => {
//     console.log("this is second");
// });


// chaining route handlers
// const one = (req, res, next) => {
//     console.log('one');
//     next();
// }
// const two = (req, res, next) => {
//     console.log('two');
//     next();
// }
// const three = (req, res) => {
//     console.log('three');
//     res.send('Finished');
// }
// app.get('/chain(.html)?', [one, two, three]);

// app.use('/')

// app.get('/*', (req, res) => {
//     res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
// });

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