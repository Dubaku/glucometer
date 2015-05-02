angular.module('measureCtrl', ['measureService'])

.controller('measureController', function($scope, Measure) {
    var vm = this;
    vm.user = $scope.$parent.teste;

    // set a processing variable to show loading things
    vm.processing = true;

    // grab all the measures at page load
    Measure.all()
        .success(function(data) {

            // when all the measures come back, remove the processing variable
            vm.processing = false;

            // bind the measures that come back to vm.measures
            vm.measures = data;
        });

    Measure.get("5544a6eb4a7b3580077375de")
        .success(function(data) {
            vm.mymeasures = data;
        });

});
