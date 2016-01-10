var express = require('express');
var router = express.Router();

var recipesDB = require('../server/db.js')();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/recipes', function(req, res) {
  recipesDB.all().then(function(result) {
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
