const path = require('path');
const router = require('express').Router();


// display the index HTML page
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// display the animals HTML page
router.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, './public/animals.html'));
});

// display the zookeepers HTML page
router.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, './public/zookeepers.html'));
});

// display if HTML page route is unavailable (in case of errors)
router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

module.exports = router;