angular.module('controllers', ['ui.router'])

.controller('EditRecipeCtrl', function($stateParams, $scope, $http) {
  if($stateParams.id) {
    $http.get('recipe/' + $stateParams.id).then(function(response) {
      $scope.recipe = {
        name: response.data.name,
        steps: response.data.steps
      };

      $scope.id = response.data._id;
    });
  }

  $scope.recipe = {
    steps: []
  };

  $scope.isStatus = function(status) {
    return $scope.status[status] == true;
  };

  $scope.reset = function() {
    $scope.verbs = [];
    $scope.ingredients = [];
    $scope.amounts = [];

    $scope.status = {};
    $scope.changeStatus('typing', 'typing');
  };

  $scope.changeStatus = function(from, to) {
    $scope.status[from] = false;
    $scope.status[to] = true;
  };

  $scope.update_recipe = function() {
    console.log('update');
    $http.post('/update-recipe', {
      id: $scope.id,
      recipe: $scope.recipe
    }).then(function(response) {
      console.log('/update-recipe', response.data);
      $scope.creating = false;
    }, function(err) {
      console.error('/update-recipe', err.status);
      $scope.creating = false;
    });
  };

  $scope.create_recipe = function() {
    $scope.creating = true;
    
    $http.post('/create-recipe', $scope.recipe).then(function(response) {
      console.log('/create-recipe', response.data);
      $scope.creating = false;
      $scope.id = response.data.id;
    }, function(err) {
      console.error('/create-recipe', err.status);
      $scope.creating = false;
    });
  };

  $scope.split = function(text) {
    if(!text)
      $scope.split_text = [];

    var words = text.split(' ');

    $scope.split_text = _.map(words, function(word, index) {
      return {
        text: word,
        index: index
      };
    });
  };
  
  $scope.is_verb = function(word) {
    return _.find($scope.verbs, word);
  };

  $scope.toggle_verb = function(wordToToggle) {
    if($scope.is_verb(wordToToggle))
      $scope.verbs = _.reject($scope.verbs, function(word) {
        return word == wordToToggle;
      });
    else
      $scope.verbs.push(wordToToggle);
  };
  
  $scope.is_ingredient = function(word) {
    return _.find($scope.ingredients, word);
  };

  $scope.toggle_ingredient = function(wordToToggle) {
    if($scope.is_ingredient(wordToToggle))
      $scope.ingredients = _.reject($scope.ingredients, function(word) {
        return word == wordToToggle;
      });
    else
      $scope.ingredients.push(wordToToggle);
  };
  
  $scope.is_amount = function(word) {
    return _.find($scope.amounts, word);
  };

  $scope.toggle_amount = function(wordToToggle) {
    if($scope.is_amount(wordToToggle))
      $scope.amounts = _.reject($scope.amounts, function(word) {
        return word == wordToToggle;
      });
    else
      $scope.amounts.push(wordToToggle);
  };

  $scope.getParsedStep = function() {
    var verb_texts = _.pluck($scope.verbs, 'text').join(' ');
    var text = $scope.full_text.replace(verb_texts, '{{verb}}');

    var amounts_text = _.pluck($scope.amounts, 'text').join(' ');
    var ingredient_text = _.pluck($scope.ingredients, 'text').join(' ').replace(amounts_text, '{{value}}');

    var step = {
      text: text,
      verb: verb_texts,
      ingredients: [
        { 
          text: ingredient_text,
          value: amounts_text
        }
      ]
    };

    return step;
  };

  $scope.add_step = function() {
    $scope.recipe.steps.push($scope.getParsedStep());
    $scope.reset();
  };

});