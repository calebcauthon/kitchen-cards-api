angular.module('directives', ['k-cards-services'])
.directive('editableStep', function() {
  return {
    scope: {
      step: '=',
      template: '@'
    },
    templateUrl: 'partials/directive-editable-step.html',
    replace: true,
    controller: function($scope, parseLine) {

      $scope.parseSentence = function(original_text) {
        angular.merge($scope.step, $scope.parseLine(original_text));
      };

      $scope.parseLine = parseLine;

      $scope.plain_text = function(step) {
        return step.text.replace('{{verb}}', step.verb);
      };

      $scope.isStatus = function(status) {
        return $scope.status[status] == true;
      };

      $scope.reset = function() {
        $scope.status = {};

        if($scope.step) {
          $scope.full_text = $scope.step.text;
          $scope.split($scope.full_text);
          $scope.changeStatus('typing', 'done');
        } else {
          $scope.full_text = '';
          $scope.changeStatus('typing', 'typing');
        }
      };

      $scope.changeStatus = function(from, to) {
        $scope.status[from] = false;
        $scope.status[to] = true;
      };

      $scope.changeStatusTo = function(to) {
        $scope.status = {};
        $scope.changeStatus(to, to);
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

      $scope.is_measurement = function(word) {
        if(!$scope.step.measurements)
          $scope.step.measurements = [];

        if($scope.step.measurements.length) {
          return _.indexOf($scope.step.measurements, word.text) > -1;
        } else
          return false;
      };

      $scope.toggle_measurement = function(wordToToggle) {
        $scope.step.measurements = _.chain($scope.split_text).select(function(word) {
          return ($scope.is_measurement(word) || (word == wordToToggle)) &&
          (!$scope.is_measurement(word) || !(word == wordToToggle))
        }).pluck('text').value();
      };

      $scope.is_verb = function(word) {
        return $scope.step.verb.indexOf(word.text) > -1;
      };

      $scope.toggle_verb = function(wordToToggle) {
        $scope.step.verb = wordToToggle.text;
      };

      $scope.is_ingredient = function(word) {
        if($scope.step.ingredients.length) {
          return _.indexOf($scope.step.ingredients, word.text) > -1;
        } else
          return false;
      };

      $scope.toggle_ingredient = function(wordToToggle) {
        $scope.step.ingredients = _.chain($scope.split_text).select(function(word) {
          return ($scope.is_ingredient(word) || (word == wordToToggle)) &&
          (!$scope.is_ingredient(word) || !(word == wordToToggle))
        }).pluck('text').value();
      };

      $scope.is_amount = function(word) {
        if(!$scope.step.amounts)
          $scope.step.amounts = [];

        if($scope.step.amounts.length) {
          return _.indexOf($scope.step.amounts, word.text) > -1;
        } else
          return false;
      };

      $scope.toggle_amount = function(wordToToggle) {
        $scope.step.amounts = _.chain($scope.split_text).select(function(word) {
          return ($scope.is_amount(word) || (word == wordToToggle)) &&
          (!$scope.is_amount(word) || !(word == wordToToggle))
        }).pluck('text').value();
      };

      $scope.doneWithStep = function() {
        $scope.reset();
      };

      $scope.reset();
    },
    controllerAs: 'ctrl'
  };
});