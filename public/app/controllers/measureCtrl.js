angular.module('measureCtrl', ['ngProgress', 'measureService'])

.directive('onReadFile', function($parse) {
    return {
        restrict: 'A',
        scope: false,
        link: function(scope, element, attrs) {
            var fn = $parse(attrs.onReadFile);

            element.on('change', function(onChangeEvent) {
                var reader = new FileReader();

                reader.onload = function(onLoadEvent) {
                    scope.$apply(function() {
                        fn(scope, {
                            $fileContent: onLoadEvent.target.result
                        });
                    });
                };

                reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
            });
        }
    };
})

.controller('measureController', function($scope, Measure, ngProgress) {
    var vm            = this;
    vm.user_id        = $scope.$parent.main.user._id;
    vm.fileprocessing = false;
    vm.fileLines      = [];

    $scope.showContent = function($fileContent) {
        $scope.fileuploaded = {};
        vm.fileLines        = [];
        $scope.fileuploaded = $fileContent.split('\n');
        
        for (var i = 3; i <= $scope.fileuploaded.length; i++) {
            vm.fileLines.push($scope.fileuploaded[i].split(';'));
        }
    };

    getAllMeasures();

    // grab all the measures at page load
    // Measure.all().success(function(data) { vm.processing = false; vm.measures = data; });

    vm.clearDataFile = function() {
        $scope.fileuploaded = {};
        vm.fileLines        = [];
    };

    vm.uploadDataFile = function() {
        vm.fileprocessing = true;
        vm.message = '';
        ngProgress.start();

        var max = $scope.fileuploaded.length;
        var reading_error = false;
        for (var i = 0; i < max; i++) {
            ngProgress.set( (i*100)/ max );
            reading_error = false;
            
            //console.log(i + " of " + max + " -- " + vm.fileLines[i]);

            var _meal = "", _overmax = "";
            if (vm.fileLines[i][4] == "X") {
                _overmax = "Above Range";
            }
            if (vm.fileLines[i][6] == "X") {
                _meal = "Before a Meal";
            }
            if (vm.fileLines[i][7] == "X") {
                _meal = "After a Meal";
            }

            if( !isFinite(vm.fileLines[i][2]) ){
                reading_error = true;
            }

            if (!reading_error) {
               vm.new_measure_to_upload = {
                   user_id: vm.user_id,
                   value: vm.fileLines[i][2],
                   datetime: new Date( vm.fileLines[i][0].replace( /(\d{2}).(\d{2}).(\d{4})/, "$2/$1/$3") + " " + vm.fileLines[i][1] ),
                   meal: _meal,
                   note: _overmax
               };
           }

            // use the create function in the userService
            Measure.create(vm.new_measure_to_upload)
            .success(function(data) {
                vm.processing = false;
                vm.message    = data.message;
            });

            //console.log(i + " - " + angular.toJson(vm.new_measure_to_upload, true) + "\n Reply Message: " + vm.message);
        }
        ngProgress.complete();

        $scope.fileuploaded = {};
        vm.fileLines        = [];
        getAllMeasures();
    };

    // function to delete a user
    vm.deleteMeasure = function(id) {
        vm.processing = true;
        Measure.delete(id).success(function(data) {
            getAllMeasures()
        });
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
    var vm  = this;
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
