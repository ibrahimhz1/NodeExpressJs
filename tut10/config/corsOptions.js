// middlware for cors cross origin resource sharing
const whiteList = [
    'https://ibrahimhz.com', 
    'https://www.google.com', 
    'http://127.0.0.1:5500', 
    'http://localhost:3500'
];

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

module.exports = corsOptions;