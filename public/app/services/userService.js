angular.module('userService', [])

.factory('User', function($http) {

    // create a new object
    var userFactory = {};

    // get a single user
    userFactory.getidbyname = function(name) {
        return $http.get('/api/users/' + name);
    };

    // get a single user
    userFactory.get = function(id) {
        return $http.get('/api/users/' + id);
    };

    // get all users
    userFactory.all = function() {
        return $http.get('/api/users/');
    };

    // create a user
    userFactory.create = function(userData) {
        return $http.post('/api/users/', userData);
    };

    // update a user
    userFactory.update = function(id, userData) {
        return $http.put('/api/users/' + id, userData);
    };

    // delete a user
    userFactory.delete = function(id) {
        return $http.delete('/api/users/' + id);
    };

    // updatepicture
    userFactory.getPicture = function(id) {
        return $http.get('/api/users/pic/' + id);
    };

    // updatepicture
    userFactory.updatePicture = function(id, picData) {
        return $http.put('/api/users/pic/' + id, picData);
    };

    // return our entire userFactory object
    return userFactory;

});
