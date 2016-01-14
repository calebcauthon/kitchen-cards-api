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

      $scope.reset = function() {
        $scope.status = {};

        if($scope.step) {
          $scope.full_text = $scope.step.text;
          $scope.split($scope.full_text);
        } else {
          $scope.full_text = '';
        }
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

      $scope.step_has = function(word, category) {
        if(!$scope.step[category])
          $scope.step[category] = [];

        if($scope.step[category].length) {
          return _.indexOf($scope.step[category], word.text) > -1;
        } else
          return false;
      };

      $scope.step_toggle = function(wordToToggle, category) {
        $scope.step[category] = _.chain($scope.split_text).select(function(word) {
          return ($scope.step_has(word, category) || (word == wordToToggle)) &&
          (!$scope.step_has(word, category) || !(word == wordToToggle))
        }).pluck('text').value();
      };

      $scope.is_verb = function(word) {
        return $scope.step.verb.indexOf(word.text) > -1;
      };

      $scope.toggle_verb = function(wordToToggle) {
        $scope.step.verb = wordToToggle.text;
      };

      $scope.reset();
    }
  };
});