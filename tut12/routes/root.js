const express = require('express')
const router = express.Router();
const path = require('path');

router.get('^/$|/index(.html)?', (req, res) => {  // ^-starts with , $|-> or, (.html) with or without.html extension 
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

module.exports = router;