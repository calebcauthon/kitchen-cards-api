angular.module('recipeApp', ['ui.router', 'controllers', 'directives', 'dndLists'])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('list', {
    url: '/recipes',
    templateUrl: 'partials/list.html',
    controller: function($scope, $http) {
      $http.post('recipes').then(function(response) {
        $scope.recipes = response.data;
      });
    }
  })

  .state('edit', {
    url: '/edit/:id',
    templateUrl: 'partials/new.html',
    controller: 'EditRecipeCtrl'
  })

  .state('new', {
    url: '/new',
    templateUrl: 'partials/new.html',
    controller: 'EditRecipeCtrl'
  })

  $urlRouterProvider.otherwise('/new');

})