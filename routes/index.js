var express = require('express');
var router = express.Router();
var _ = require('underscore');

var recipesDB = require('../server/db.js')();
var groceryListDb = require('../server/db.js')('grocery-lists');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/recipes', function(req, res) {
  recipesDB.all().then(function(result) {
    res.send(result);
  });
});

router.post('/get-grocery-lists', function(req, res) {
  groceryListDb.all().then(function(result) {
    res.send(result);
  });
});

router.post('/update-grocery-list', function(req, res) {
  groceryListDb.update(req.body.id, {
    name: req.body.name,
    list: req.body.list
  }).then(function(result) {
    res.send(result);
  });
});

router.post('/save-grocery-list', function(req, res) {
  var name = req.body.name;

  groceryListDb.all().then(function(result) {
    var duplicate = _.find(result, function(list) {
      return list.name == name;
    });

    if(duplicate) {
      res.send(duplicate);
    } else {
      groceryListDb.create(req.body).then(function(result) {
        res.send(result);
      });
    }
  });
});

router.post('/destroy-grocery-list', function(req, res) {
  groceryListDb.destroy(req.body.id).then(function(result) {
    res.send(result);
  });
});

router.get('/recipe/:id', function(req, res) {
  recipesDB.find(req.params.id).then(function(result) {
    res.send(result);
  });
});

router.post('/destroy-recipe/', function(req, res) {
  recipesDB.destroy(req.body.id).then(function(result) {
    res.send(result);
  });
});

router.post('/create-recipe', function(req, res) {
  recipesDB.create(req.body).then(function(result) {
    res.send({ id: result });
  });
});

router.post('/update-recipe', function(req, res) {
  recipesDB.update(req.body.id, req.body.recipe).then(function(result) {
    res.send('OK');
  });
});

module.exports = router;
