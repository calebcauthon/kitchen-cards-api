angular.module('services', [])

.service('parseLine', function() {
  function wordAfter(word, full_text) {
    var words_array = full_text.split(' ');
    var index_of_target_word = _.indexOf(words_array, word);

    return words_array[index_of_target_word + 1];
  }

  function parseLine(line) {
    var verb_pattern = /([A-Z\ ]+)\ /;
    var amount_pattern = /([\.0-9\/]+)/;

    var verb_match = line.match(verb_pattern);
    verb = verb_match ? verb_match[1] : '';

    var amount_match = line.match(amount_pattern);
    var amounts = amount_match ? [amount_match[1]] : [];

    var measurements = amounts.length ? [wordAfter(amounts[0], line)] : [];
    var ingredients = amounts.length ? [wordAfter(measurements[0], line)]: [];

    var step = {
      text: line,
      verb: verb,
      amounts: amounts,
      measurements: measurements,
      ingredients: ingredients
    };

    return step;
  }

  return parseLine;
})