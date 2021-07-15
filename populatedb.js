#! /usr/bin/env node

console.log('This script populates some test wathes and collections to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);

var async = require('async');
var Watch = require('./models/watch');
var Collection = require('./models/collection');


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var watches = [];
var collections = [];


function watchCreate(name, description, category, reference_number, price, cb) {
  watchdetail = {
    name:name,
    description: description,
    reference_number: reference_number,
    price: price
  }

  if(category != false) watchdetail.category = category;

  let watch = new Watch(watchdetail);
  watch.save(function(err) {
    if(err) {
      cb(err, null)
      return
    }
    console.log('New Watch:' + watch);
    watches.push(watch);
    cb(null, watch);
  });
}

function collectionCreate(name, description, cb) {
  let collection = new Collection({name:name, description:description});

  collection.save(function (err) {
    if(err) {
      cb(err, null);
      return;
    }
    console.log('New Collection: ' + collection);
    collections.push(collection);
    cb(null, collection);
  });
}

function createCollections(cb) {
  async.series([
    function(callback) {
      collectionCreate('Air-King','The Rolex Air-King pays tribute to the pioneers of flight and the Oyster’s roles in the epic story of aviation.',callback);
    },
    function(callback) {
      collectionCreate('Cosmograph Daytona', 'The Oyster Perpetual Cosmograph Daytona is the ultimate tool watch for those with a passion for driving and speed.', callback);
    },
    function(callback) {
      collectionCreate('The Datejust', 'THE DATEJUST HAS SPANNED ERAS WHILE RETAINING THE ENDURING AESTHETIC ­ THAT MAKE IT SO INSTANTLY RECOGNIZABLE.', callback);
    },
  ],
  cb)
};

function createWatches(cb) {
  async.series([
    function(callback) {
      watchCreate('Submariner','The Oyster Perpetual Submariner in Oystersteel with a Cerachrom bezel insert in black ceramic and a black dial with large luminescent hour markers.',collections[0],124060,8200, callback);
    },
    function(callback) {
      watchCreate('Sea Dweller', 'The Oyster Perpetual Sea-Dweller in Oystersteel with a Cerachrom bezel insert in black ceramic and an Oyster bracelet.', collections[0],126600,12000,callback);
    },
    function(callback) {
      watchCreate('Cosmograph Daytona', 'This Oyster Perpetual Cosmograph Daytona in 18 ct Everose gold, with a meteorite and black dial and an Oyster bracelet, features an 18 ct Everose gold bezel with engraved tachymetric scale.', collections[1], 116505, 44000, callback);
    },
    function(callback) {
      watchCreate('Datejust 36','This Oyster Perpetual Datejust 36 in Oystersteel and yellow gold features a golden, fluted motif dial and a Jubilee bracelet.', collections[2], 126233, 12000, callback);
    },
  ],
  cb)
}


async.series([
    createCollections,
    createWatches
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('Wathces: '+ watches);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});



