/**********************************************
* 3. FCC Mongo & Mongoose Challenges
* ==================================
***********************************************/

/** 1) Install & Set up mongoose --------------------------------------------------------------------*/

var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });


/** 2) Create a 'Person' Model -----------------------------------------------------------------------*/

// Schema defines shape of the documents
var Schema = mongoose.Schema;

// The schema shape definition
var personSchema = new Schema({
    name:  {
      type: String,
      required: true
    },
    age: Number,
    favoriteFoods: [String]
  });

// Models use the schema to create instances called documents
var Person = mongoose.model('Person', personSchema);



/** 3) Create and Save a Person Instance-----------------------------------------------------------------------*/

var createAndSavePerson = function(done) {
  // Create a document instance of the Person Model
  var will = new Person({name: 'Will', age: 32, favoriteFoods: ['Pizza', 'Burritos', 'Coffee']});
  // Save the new document to the database
  will.save((err, data) => {
    if (err) return done(err);
    done(null, data);
  });
};



/** 4) Create many People with `Model.create()` -----------------------------------------------------------*/

// Wrapper function to give arrayOfPeople and done callback
// Model.create(arrayOfdocuments, callback)
// Good for seeding database with initial data
var createManyPeople = function(arrayOfPeople, done) {
    Person.create(arrayOfPeople, (err, data) => {
      if (err) return done(err);
      done(null, data);
    });
};



/** 5) Use model.find() to Search Your Database-------------------------------------------------------------*/
// Model.find(queryDocumentObject, callback)
// Other optional parameters in docs: https://mongoosejs.com/docs/api.html#model_Model.find
// Returns an array of matches

var findPeopleByName = function(personName, done) {
  Person.find({name: personName}, (err, data) => {
    if (err) return done(err);
    done(null, data);
  });
};

/** 6) Use `Model.findOne()` -----------------------------------------------------------------------------*/

// `Model.findOne()` behaves like `.find()`, but it returns **only one**
// document, even if there are more. It is especially useful
// when searching by properties that you have declared as unique.

var findOneByFood = function(food, done) {
  Person.findOne({favoriteFoods: food}, (err, data) => {
    if (err) return done(err);
    done(null, data);
  });
};

/** 7) Use `Model.findById()` ----------------------------------------------------------------------------*/

// When saving a document, mongodb automatically adds the field `_id`,
// and sets it to a unique alphanumeric key. Searching by `_id` is an
// extremely frequent operation, so `moongose` provides a dedicated
// method for it. Find the (only!!) person having a certain Id,
// using `Model.findById() -> Person`.
// Use the function argument 'personId' as search key.

var findPersonById = function(personId, done) {
  Person.findById(personId, (err, data) => {
    if (err) return done(err);
    done(null, data);
  });
};

/** 8) Classic Update : Find, Edit then Save -------------------------------------------------------------*/
// Update person's favorite food.
// Find the person
// push new food into favoriteFoods array
// save the new data

var findEditThenSave = function(personId, done) {
  var foodToAdd = 'hamburger';
  
  Person.findById(personId, (err, data) => {
    if (err) return done(err);
    data.favoriteFoods.push(foodToAdd);
    data.save((err, data) => {
      if (err) return done(err);
      done(null, data);
    });
  });
};


/** 9) New Update : Use `findOneAndUpdate()` --------------------------------------------------------*/
// `findByIdAndUpdate()` can be used when searching by Id.
//
// Find a person by `name` and set her age to `20`. Use the function parameter
// `personName` as search key.
//
// Hint: We want you to return the **updated** document. In order to do that
// you need to pass the options document `{ new: true }` as the 3rd argument
// to `findOneAndUpdate()`. By default the method
// passes the unmodified object to its callback.

// findOneAndUpdate(conditions, update, options, callback)

var findAndUpdate = function(personName, done) {
  var ageToSet = 20;
  Person.findOneAndUpdate(
    {name: personName}, 
    {age: ageToSet}, 
    {new: true}, 
    (err, data) => {
      if (err) return done(err);
      done(null, data);
  });
};

/** 10) Delete one Person ----------------------------------------------------------------------------*/

// With findByIdAndRemove
var removeById = function(personId, done) {
  Person.findByIdAndRemove(personId, (err, data) => {
    if (err) return done(err);
    done(null, data);
  });
};

/** 11) Delete many People ------------------------------------------------------------------------------*/

// `Model.remove()` is useful to delete all the documents matching given criteria.
// Delete all the people whose name is "Mary", using `Model.remove()`.
// Pass to it a query ducument with the "name" field set, and of course a callback.
//
// Note: `Model.remove()` doesn't return the removed document, but a document
// containing the outcome of the operation, and the number of items affected.
// Don't forget to pass it to the `done()` callback, since we use it in tests.

var removeManyPeople = function(done) {
  var nameToRemove = "Mary";
  Person.remove({ name: nameToRemove }, (err, data) => {
    if (err) return done(err);
    done(null, data);
  });
};


/** 12) Chain Query helpers --------------------------------------------------------------------------------*/

// If you don't pass the `callback` as the last argument to `Model.find()`
// (or to the other similar search methods introduced before), the query is
// not executed, and can even be stored in a variable for later use.
// This kind of object enables you to build up a query using chaining syntax.
// The actual db search is executed when you finally chain
// the method `.exec()`, passing your callback to it.
// There are many query helpers, here we'll use the most 'famous' ones.

// Find people who like "burrito". Sort them alphabetically by name,
// Limit the results to two documents, and hide their age.
// Chain `.find()`, `.sort()`, `.limit()`, `.select()`, and then `.exec()`,
// passing the `done(err, data)` callback to it.

var queryChain = function(done) {
  var foodToSearch = "burrito";
  let findPeople = Person.find({favoriteFoods: foodToSearch})
    .sort({ name: 1}) // 1 for ascending
    .limit(2)  // limit of 2
    .select({ age: 0 }); // 0 for exclude

  findPeople.exec((error, data) => {
    error ? done(error) : done(error, data);
  });
};

/** # Further Readings... #
/*  ======================= */
// If you are eager to learn and want to go deeper, You may look at :
// * Indexes ( very important for query efficiency ),
// * Pre/Post hooks,
// * Validation,
// * Schema Virtuals and  Model, Static, and Instance methods,
// * and much more in the [mongoose docs](http://mongoosejs.com/docs/)


//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
