angular.module('userCtrl', ['userService', 'naif.base64', 'ngProgress'])

.controller('userController', function(User) {
    var vm = this;
    vm.processing = true;

    // grab all the users at page load
    User.all()
        .success(function(data) {
            vm.processing = false;
            vm.users = data;
        });

    // function to delete a user
    vm.deleteUser = function(id) {
        vm.processing = true;

        User.delete(id)
            .success(function(data) {
                User.all()
                    .success(function(data) {
                        vm.processing = false;
                        vm.users = data;
                    });

            });
    };

})

// controller applied to user creation page
.controller('userCreateController', function(User, $http) {
    var vm = this;

    // variable to hide/show elements of the view
    // differentiates between create or edit pages
    vm.type = 'create';

    // function to create a user
    vm.saveUser = function() {
        vm.processing = true;
        vm.message = '';

        // use the create function in the userService
        User.create(vm.userData)
            .success(function(data) {
                vm.processing = false;
                vm.userData = {};
                vm.message = data.message;
            });

    };

})

// controller applied to user edit page
.controller('userEditController', function($routeParams, User) {
    var vm = this;
    vm.type = 'edit';

    // get the user data for the user you want to edit
    // $routeParams is the way we grab data from the URL
    User.get($routeParams.user_id)
        .success(function(data) {
            vm.userData = data;
        });

    // function to save the user
    vm.saveUser = function() {
        vm.processing = true;
        vm.message = '';

        // call the userService function to update 
        User.update($routeParams.user_id, vm.userData)
            .success(function(data) {
                vm.processing = false;
                vm.userData = {};
                vm.message = data.message;
                // bind the message from our API to vm.message
            });
    };

})

// controller applied to user edit page
.controller('selfUserController', function($scope, User, ngProgress) {
    var vm = this;
    vm.user_id = $scope.$parent.main.user._id;

    //get User data
    User.get(vm.user_id)
        .success(function(data) {
            vm.info = data;
        });


    vm.updatePicture = function() {
        vm.info.pic = "data:" + vm.newpic.filetype + ";base64," + vm.newpic.base64;
        console.log("vm.info "+vm.info.pic);
        console.log("Pic Size Before: "+$scope.$parent.main.user.pic.length);
        ngProgress.start();
        User.updatePicture(vm.user_id, vm.info)
            .success(function(data) {
                $scope.$parent.main.user.pic = vm.info.pic;
                console.log("Pic Size After: "+$scope.$parent.main.user.pic.length);
                ngProgress.complete();
                vm.newpic = {};
                vm.message = data.message;
                console.log(vm.message);
                // bind the message from our API to vm.message
            });
    }

});
