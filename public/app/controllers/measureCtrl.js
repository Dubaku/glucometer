angular.module('measureCtrl', ['measureService'])

.controller('measureController', function($scope, Measure) {
    var vm        = this;
    vm.user_id    = $scope.$parent.main.user._id;
    
    getAllMeasures();

    // grab all the measures at page load
    // Measure.all().success(function(data) { vm.processing = false; vm.measures = data; });

     // function to delete a user
     vm.deleteMeasure = function(id) {
        vm.processing = true;
        Measure.delete(id).success(function(data) { alert("DELETED WITH SUCCESS!?"); getAllMeasures() });
    };

    function getAllMeasures() {
        vm.processing = true;

        Measure.getByUser(vm.user_id)
        .success(function(data) {
            vm.processing = false;
            vm.mymeasures = data;
        });
    };

})

// controller applied to user creation page
.controller('measureCreateController', function($scope, Measure) {
    var vm = this;
    vm.type = 'create';

    // function to create a Measure
    vm.saveMeasure = function() {
        vm.measureData.user_id = $scope.$parent.main.user._id;
        vm.processing          = true;
        vm.message             = '';

        // use the create function in the measureService
        Measure.create(vm.measureData)
        .success(function(data) {
            vm.processing  = false;
            vm.measureData = {};
            vm.message     = data.message;
        });

    };

})

// controller applied to user edit page
.controller('measureEditController', function($routeParams, $scope, Measure) {
    var vm = this;
    vm.type = 'edit';

    Measure.get($routeParams.measure_id).success(function(data) {
        vm.measureData = data;
        var dd = new Date(vm.measureData.datetime).getDate();
        var mm = new Date(vm.measureData.datetime).getMonth() + 1;
        var yy = new Date(vm.measureData.datetime).getFullYear();
        var hh = new Date(vm.measureData.datetime).getHours();
        var ms = new Date(vm.measureData.datetime).getMinutes();
        vm.measureData.time = vm.measureData.date = new Date(yy, mm, dd, hh, ms, 00);
    });

    // function to save the user
    vm.saveMeasure = function() {
        // vm.processing = true;
        // vm.message = '';

        // call the userService function to update 
        Measure.update($routeParams.measure_id, vm.measureData)
        .success(function(data) {
            vm.processing  = false;
            vm.measureData = {};
            vm.message     = data.message;
        });
    };

});
