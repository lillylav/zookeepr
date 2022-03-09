const fs = require("fs");
const path = require("path");

// search data for zookeeper
function filterByQuery(query, zookeepers) {
  let filteredResults = zookeepers;
  // by age
  if (query.age) {
    filteredResults = filteredResults.filter(
      // Since our form data will be coming in as strings, and our JSON is storing
      // age as a number, we must convert the query string to a number to
      // perform a comparison:
      (zookeeper) => zookeeper.age === Number(query.age)
    );
  }
  // by favorite animal
  if (query.favoriteAnimal) {
    filteredResults = filteredResults.filter(
      (zookeeper) => zookeeper.favoriteAnimal === query.favoriteAnimal
    );
  }
  // by name
  if (query.name) {
    filteredResults = filteredResults.filter(
      (zookeeper) => zookeeper.name === query.name
    );
  }
  return filteredResults;
};

// find individual zookeeper by their unique ID (display detail page)
function findById(id, zookeepers) {
  const result = zookeepers.filter((zookeeper) => zookeeper.id === id)[0];
  return result;
};

// add a new zookeeper to the data
function createNewZookeeper(body, zookeepers) {
  const zookeeper = body;
  zookeepers.push(zookeeper);
  fs.writeFileSync(
    path.join(__dirname, "../data/zookeepers.json"),
    JSON.stringify({ zookeepers }, null, 2)
  );
  return zookeeper;
};

// validate new zookeeper info
function validateZookeeper(zookeeper) {
  if (!zookeeper.name || typeof zookeeper.name !== "string") {
    return false;
  }
  if (!zookeeper.age || typeof zookeeper.age !== "number") {
    return false;
  }
  if (
    !zookeeper.favoriteAnimal ||
    typeof zookeeper.favoriteAnimal !== "string"
  ) {
    return false;
  }
  return true;
};

// export functions to be usable by other js files
module.exports = {
  filterByQuery,
  findById,
  createNewZookeeper,
  validateZookeeper,
};