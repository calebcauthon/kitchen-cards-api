angular.module('controllers', ['ui.router', 'k-cards-services'])

.controller('EditRecipeCtrl', function($state, $stateParams, $scope, $http, parseLine) {
  $scope.parseLine = parseLine;

  if($stateParams.id) {
    $http.get('recipe/' + $stateParams.id).then(function(response) {
      $scope.recipe = {
        name: response.data.name,
        steps: response.data.steps,
        serving_size: response.data.serving_size
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

  $scope.destroy_step = function(stepToDestroy) {
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