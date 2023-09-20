const allowedOrigins = require('./allowedOrigins');

const corsOptions = {
    origin: (origin, callback) => {
        console.log(origin);
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            console.log('in the whitelist');
            callback(null, true); // set callback error to null and set the true means proceed
        } else {
            console.log('not in the whitelist')
            callback(new Error('not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
}

module.exports = corsOptions;