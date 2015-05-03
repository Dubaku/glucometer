angular.module('measureService', [])

.factory('Measure', function($http) {

    // create a new object
    var measureFactory = {};

    // get all users
    measureFactory.all = function() {
        return $http.get('/api/measures/');
    };

    // get measures for single user
    measureFactory.getByUser = function(id) {
        return $http.get('/api/measures/all/' + id);
    };

     // get a single user
    measureFactory.get = function(id) {
        return $http.get('/api/measures/' + id);
    };

    measureFactory.create = function(measureData) {
        return $http.post('/api/measures/', measureData);
    };
    
    measureFactory.update = function(id, userData) {
        return $http.put('/api/measures/' + id, userData);
    };

    measureFactory.delete = function(id) {
        return $http.delete('/api/measures/' + id);
    };

    // return our entire measureFactory object
    return measureFactory;

});
