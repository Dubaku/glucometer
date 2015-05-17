angular.module('dashCtrl', ['n3-line-chart', 'ngProgress', 'measureService', 'userService'])

.controller('dashController', function($scope, Measure, User, ngProgress) {
    var vm = this;
    vm.user_id = $scope.$parent.main.user._id;
    vm.widgetSelectedOptions = ["30 days", "90 days", "last year"];
    vm.widgetSelected = vm.widgetSelectedOptions[0];

    getAllMeasures();

    function getAllMeasures() {
        vm.processing = true;

        Measure.getByUser(vm.user_id)
            .success(function(data) {
                vm.mymeasures = data.reverse();
                vm.minMeasure = vm.mymeasures[0];
                vm.maxMeasure = vm.mymeasures[0];
                vm.sumMeasure = 0;
                vm.medMeasure = 0;

                for (var i = 0; i < vm.mymeasures.length; i++) {
                    var obj = vm.mymeasures[i];
                    vm.mymeasures[i].index = i;
                    if (obj.value >= vm.maxMeasure) {
                        vm.maxMeasure = obj;
                    }
                    if (obj.value <= vm.minMeasure) {
                        vm.minMeasure = obj;
                    }
                    vm.sumMeasure += obj.value;
                }
                vm.medMeasure = vm.sumMeasure / vm.mymeasures.length;
                vm.chartData = vm.mymeasures;
                vm.processing = false;
            });
    };

    vm.measuresFromLastDays = function(day_val) {
        var dateDayVal = new Date( new Date().getTime() - (day_val * 24 * 60 * 60 * 1000) );
        vm.filteredMeasures = [];
        vm.count = 0;


        for (var i = 0; i < vm.mymeasures.length; i++) {
          var data = new Date(vm.mymeasures[i].datetime);
            //console.log( data.getTime() + " < " + new Date(dateDayVal).getTime() + " = " + ( data.getTime() > new Date(dateDayVal).getTime() ) );
            if ( data.getTime() > dateDayVal.getTime() ) {
                vm.filteredMeasures.push(vm.mymeasures[i]);
                vm.count++;
            }
        }

        if(day_val == 30){ vm.widgetSelected = vm.widgetSelectedOptions[0];  }
        if(day_val == 90){ vm.widgetSelected = vm.widgetSelectedOptions[1];  }
        if(day_val == 365){ vm.widgetSelected = vm.widgetSelectedOptions[2];  }
        
        vm.widgetOp = false;
        vm.chartData = vm.filteredMeasures;
        console.log( "Total: " + vm.mymeasures.length + " | " + day_val + "days | " + vm.filteredMeasures.length + " | vm.count: " + vm.count);
    }


    vm.gcOptions = {
        axes: {
            x: {
                type: "linear",
                key: "index"
            },
            y: {
                type: "linear"
            }
        },
        series: [{
            y: "value",
            label: "Glucose Values",
            color: "#9467bd",
            axis: "y",
            type: "line",
            thickness: "1px",
            dotSize: 2,
            id: "series_0"
        }],
        tooltip: {
            mode: "scrubber",
            formatter: function(x, y, series) {
                return y + " mg/dl";
            }
        },
        stacks: [],
        lineMode: "linear",
        tension: .1,
        drawLegend: false,
        drawDots: false,
        columnsHGap: 0
    };












});
