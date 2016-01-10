angular.module('directives', [])
.directive('editableStep', function() {
  return {
    scope: {
      step: '=',
      template: '@'
    },
    templateUrl: 'partials/directive-editable-step.html',
    replace: true,
    controller: function($scope) {
      
      $scope.parseSentence = function(text) {
        $scope.changeStatus('typing', 'done');
        angular.merge($scope.step, $scope.parseLine(text));
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

      $scope.plain_text = function(step) {
        return step.text.replace('{{verb}}', step.verb);
      };

      $scope.isStatus = function(status) {
        return $scope.status[status] == true;
      };

      $scope.reset = function() {
        $scope.status = {};
        
        if($scope.step) {
          $scope.full_text = $scope.step.text.replace('{{verb}}', $scope.step.verb);
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
      
      $scope.is_verb = function(word) {
        return $scope.step.verb.indexOf(word.text) > -1;
      };

      $scope.toggle_verb = function(wordToToggle) {
        $scope.step.verb = wordToToggle.text;
      };
      
      $scope.is_ingredient = function(word) {
        if($scope.step.ingredients.length) {
          return _.indexOf($scope.step.ingredients[0].text, word.text) > -1;
        } else
          return false;
      };

      $scope.toggle_ingredient = function(wordToToggle) {
        $scope.step.ingredients[0].text = _.chain($scope.split_text).select(function(word) {
          return ($scope.is_ingredient(word) || (word == wordToToggle)) &&
          (!$scope.is_ingredient(word) || !(word == wordToToggle))
        }).pluck('text').value();
      };
      
      $scope.is_amount = function(word) {
        return $scope.step.ingredients[0].value == word.text;
      };

      $scope.toggle_amount = function(wordToToggle) {
        $scope.step.ingredients[0].value = wordToToggle.text;
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

      $scope.doneWithStep = function() {
        $scope.reset();
      };

      $scope.reset();
    },
    controllerAs: 'ctrl'
  };
});