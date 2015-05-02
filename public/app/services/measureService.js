angular.module('measureService', [])

.factory('Measure', function($http) {

    // create a new object
    var measureFactory = {};

    // get all users
    measureFactory.all = function() {
        return $http.get('/api/measures/');
    };

    // get a single user
    measureFactory.get = function(id) {
        return $http.get('/api/measures/' + id);
    };

    // return our entire measureFactory object
    return measureFactory;

});
