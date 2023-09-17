const fs = require('fs');

const path = require('path');

fs.readFile(path.join(__dirname, 'files', 'file2.txt'), 'utf-8', (err, data)=> {
    if(err) throw err;
    console.log(data);
})

console.log("hello ... ");

fs.writeFile(path.join(__dirname, 'files', 'reply.txt'), 'Nice to meet you', (err)=> {
    if(err) throw err;
    console.log('write completed');
})

fs.appendFile(path.join(__dirname, 'files', 'test.txt'), 'appending meet you in there', (err)=> {
    if(err) throw err;
    console.log('write completed');

    fs.appendFile(path.join(__dirname, 'files', 'tests.txt'), 'testting texts', (err)=> {
        if(err) throw err;
        console.log('Append Completed');
    })
})

// exit on uncaught exception
process.on('uncaughtException', err => {
    console.error(`There was an uncaught error : ${err}`);
    process.exit(1);
});

