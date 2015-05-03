angular.module('app.routes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {

	$routeProvider

		// route for the home page
		.when('/', {
			templateUrl : 'app/views/pages/home.html'
		})
		
		// login page
		.when('/login', {
			templateUrl : 'app/views/pages/login.html',
   			controller  : 'mainController',
    			controllerAs: 'login'
		})
		
		// login page
		.when('/me', {
			templateUrl : 'app/views/pages/users/profile.html'
		})

		// show all users
		.when('/users', {
			templateUrl: 'app/views/pages/users/all.html',
			controller: 'userController',
			controllerAs: 'user'
		})

		// form to create a new user
		// same view as edit page
		.when('/users/create', {
			templateUrl: 'app/views/pages/users/single.html',
			controller: 'userCreateController',
			controllerAs: 'user'
		})

		// page to edit a user
		.when('/users/:user_id', {
			templateUrl: 'app/views/pages/users/single.html',
			controller: 'userEditController',
			controllerAs: 'user'
		})


		.when('/dashboard', {
			templateUrl : 'app/views/pages/users/profile.html'
		})

		.when('/historic', {
			templateUrl : 'app/views/pages/measures/historic.html',
			controller: 'measureController',
			controllerAs: 'measure'
		})

		// form to create a new measure
		// same view as edit page
		.when('/measures/create', {
			templateUrl: 'app/views/pages/measures/newmeasure.html',
			controller: 'measureCreateController',
			controllerAs: 'measure'
		})

		// page to edit a user
		.when('/measures/:measure_id', {
			templateUrl: 'app/views/pages/measures/newmeasure.html',
			controller: 'measureEditController',
			controllerAs: 'measure'
		})

		.when('/reports', {
			templateUrl : 'app/views/pages/users/profile.html'
		})

		.when('/appoitments', {
			templateUrl : 'app/views/pages/users/profile.html'
		})

		.when('/uploads', {
			templateUrl : 'app/views/pages/users/profile.html'
		})

		.when('/settings', {
			templateUrl : 'app/views/pages/users/profile.html'
		});





	$locationProvider.html5Mode(true);

});
