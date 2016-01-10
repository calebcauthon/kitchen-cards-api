angular.module('controllers', ['ui.router'])

.controller('EditRecipeCtrl', function($state, $stateParams, $scope, $http) {
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

  $scope.removeOriginal = function(event, draggedElementIndex) {
    $scope.recipe.steps = _.reject($scope.recipe.steps, function(item, index) {
      return index == draggedElementIndex;
    });
  };

  $scope.plain_text = function(step) {
    return step.text.replace('{{verb}}', step.verb);
  };

  $scope.destroy = function(id) {
    $http.post('destroy-recipe', { id: id }).then(function() {
      $state.go('list');
    });
  };

  $scope.parseLine = function(line) {
    var verb_pattern = /([A-Z\ ]+)\ /;
    var amount_pattern = /([0-9\/]+)/;

    var verb_match = line.match(verb_pattern);
    verb = verb_match ? verb_match[1] : '';

    var amount_match = line.match(amount_pattern);
    var amount = amount_match ? amount_match[1] : '';

    var step = {
      text: verb ? line.replace(verb, '{{verb}}') : '',
      verb: verb,
      ingredients: [
        { 
          text: line.replace(verb, '').split(' '),
          value: amount
        }
      ]
    };

    return step;
  };

  $scope.parse = function(paragraph) {
    var lines = _.map(paragraph.split("\n"), function(line) {

      return $scope.parseLine(line);

    });

    $scope.recipe.steps = $scope.recipe.steps.concat(lines);
  };

  $scope.addStep = function(text) {
    var step = $scope.parseLine(text);
    $scope.recipe.steps.unshift(step);
  };

  $scope.destroy = function(stepToDestroy) {
    $scope.recipe.steps = _.reject($scope.recipe.steps, function(step) {
      return step == stepToDestroy;
    });
  };

  $scope.update_recipe = function() {
    $http.post('/update-recipe', {
      id: $scope.id,
      recipe: $scope.recipe
    }).then(function(response) {
      $scope.creating = false;
    }, function(err) {
      $scope.creating = false;
    });
  };

  $scope.create_recipe = function() {
    $scope.creating = true;
    
    $http.post('/create-recipe', $scope.recipe).then(function(response) {
      $scope.creating = false;
      $scope.id = response.data.id;
    }, function(err) {
      $scope.creating = false;
    });
  };

  

  $scope.add_step = function() {
    $scope.recipe.steps.push($scope.getParsedStep());
    $scope.reset();
  };

});