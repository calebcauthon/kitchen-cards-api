var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var assert = require('assert');
var q = require('q');

var counter = 0;

module.exports = function(collection) {
  return new dbInterface(collection);
};

function dbInterface(collection) {
  this.deferred = q.defer();
  this.recipesDB = null;

  if(!collection)
    collection = 'recipesV2';
  
  MongoClient.connect(process.env.KITCHENIO_MONGO_DB, function(err, db) {
    if(err)
      this.deferred.reject();
    else {
      this.recipesDB = db.collection(collection);
      this.deferred.resolve();
    }
  }.bind(this));

  return {
    destroy: this.whenReady(this.destroy.bind(this)).bind(this),
    update: this.whenReady(this.update.bind(this)).bind(this),
    find: this.whenReady(this.find.bind(this)).bind(this),
    query: this.whenReady(this.query.bind(this)).bind(this),
    create: this.whenReady(this.create.bind(this)).bind(this),
    all: this.whenReady(this.all.bind(this)).bind(this),
    ready: this.ready.bind(this)
  }
}

dbInterface.prototype.all = function() {
  var deferred = q.defer();

  this.recipesDB.find({}).toArray(function(err, result) {
    deferred.resolve(result);
  });
  
  return deferred.promise;
};

dbInterface.prototype.create = function(recipe) {
  var deferred = q.defer();

  this.recipesDB.insert(recipe, function(err, result) {
    if(err) 
      deferred.reject(err);
    else {
      var id = result.insertedIds[0];
      deferred.resolve(id);
    }
  });

  return deferred.promise;
}

dbInterface.prototype.update = function(id, recipe) {
  var query = { _id: new mongo.ObjectId(id) };
  var $set = { '$set': recipe };
  var deferred = q.defer();

  this.recipesDB.updateOne(query, $set, function(err, result) {
    if(err)
      deferred.reject(err);
    else
      deferred.resolve();
  });

  return deferred.promise;
};

dbInterface.prototype.destroy = function(id) {
  var query = { _id: new mongo.ObjectId(id) };
  var deferred = q.defer();

  this.recipesDB.deleteOne(query, function(err, result) {
    deferred.resolve();
  });

  return deferred.promise;
};

dbInterface.prototype.query = function(criteria) {
  var deferred = q.defer();

  this.recipesDB.find(criteria).toArray(function(err, result) {
    if(err) {
      deferred.reject(err);
    } else if(result && result.length) {
      deferred.resolve(result);
    } else 
      deferred.reject(result);
  });

  return deferred.promise;
}

dbInterface.prototype.find = function(id) {
  var deferred = q.defer();
  this.recipesDB.find({ _id: new mongo.ObjectId(id) }).toArray(function(err, result) {
    if(!err && result && result.length) {
      deferred.resolve(result[0]);
    } else {
      deferred.reject();
    }
  });

  return deferred.promise;
}

dbInterface.prototype.whenReadyWithPromise = function(fn) {
  return function() {
    var args = Array.prototype.slice.call(arguments);
    return this.ready().then(function() {
      var result = fn.apply({}, args);
      return result;
    });
      
  }.bind(this);
};

dbInterface.prototype.whenReady = function(fn) {
  return function() {
    var args = Array.prototype.slice.call(arguments);
    return this.ready().then(function() {
      var result = fn.apply({}, args);
      return result;
    });
      
  }.bind(this);
};

dbInterface.prototype.ready = function() {
  return this.deferred.promise;
};

