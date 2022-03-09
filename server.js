const fs = require('fs');
const path = require('path');
const express = require('express');
const { animals } = require('./data/animals');

const PORT = process.env.PORT || 3001;
const app = express();

// link the public folder so the page can use the client-side HTML, CSS, and JavaScript
app.use(express.static('public'));
// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());

// filter by query parameters
function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    let filteredResults = animalsArray;
    if (query.personalityTraits) {
      if (typeof query.personalityTraits === 'string') {
        personalityTraitsArray = [query.personalityTraits];
      } else {
        personalityTraitsArray = query.personalityTraits;
      }
      personalityTraitsArray.forEach(trait => {
        filteredResults = filteredResults.filter(
          animal => animal.personalityTraits.indexOf(trait) !== -1
        );
      });
    }
    if (query.diet) {
      filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
      filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
      filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    return filteredResults;
};

// find a sigle animal by its ID
function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
};

// create a new animal
function createNewAnimal(body, animalsArray) {
    const animal = body;
    animalsArray.push(animal);

    fs.writeFileSync(
      path.join(__dirname, './data/animals.json'),
      JSON.stringify({ animals: animalsArray }, null, 2)
    );
    return animal;
};

// validate new animal user input
function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
      return false;
    }
    if (!animal.species || typeof animal.species !== 'string') {
      return false;
    }
    if (!animal.diet || typeof animal.diet !== 'string') {
      return false;
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
      return false;
    }
    return true;
};

// get a list of animals based on query parameters
app.get('/api/animals', (req, res) => {
    let results = animals;
    if (req.query) {
      results = filterByQuery(req.query, results);
    }
    res.json(results);
});

// get a single animal's details
app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
      res.json(result);
    } else {
      res.send(404);
    }
});

// post newly created and validated animal to the animals.json file
app.post('/api/animals', (req, res) => {
    // set id based on what the next index of the array will be
    req.body.id = animals.length.toString();
  
    // if any data in req.body is incorrect, send 400 error back
    if (!validateAnimal(req.body)) {
      res.status(400).send('The animal is not properly formatted.');
    } else {
      const animal = createNewAnimal(req.body, animals);
      res.json(animal);
    }
});

// display the index HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// display the animals HTML page
app.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, './public/animals.html'));
});

// display the zookeepers HTML page
app.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, './public/zookeepers.html'));
});

// display if HTML page route is unavailable (in case of errors)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// listening event at the port
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});
