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

            vm.chartData = vm.mymeasures;

            dataAnalysis(vm.mymeasures);
            vm.processing = false;
        });
    };

    function dataAnalysis(array) {
        vm.minMeasure = array[0];
        vm.maxMeasure = array[0];
        vm.sumMeasure = 0;
        vm.medMeasure = 0;
        for (var i = 0; i < array.length; i++) {
            var obj = array[i];

            //Just for the chart - DATE ERROR
            array[i].index = i;

            array[i].min = 70;
            array[i].max = 120;

            if (obj.value >= vm.maxMeasure.value) {
                vm.maxMeasure = obj;
            }
            if (obj.value <= vm.minMeasure.value) {
                vm.minMeasure = obj;
            }

            //Testing Dates
            obj.x_date = new Date( new Date(obj.datetime).getTime() );

            obj.y_time = ( ( new Date(obj.datetime).getHours() + "." + new Date(obj.datetime).getMinutes() ) * 450 ) / 24;

            vm.sumMeasure += obj.value;
        }
        vm.medMeasure = vm.sumMeasure / array.length;
    }



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
        dataAnalysis(vm.filteredMeasures);
        console.log( "Total: " + vm.mymeasures.length + " | " + day_val + "days | " + vm.filteredMeasures.length + " | vm.count: " + vm.count);
    }


    vm.gcOptions = {
        axes: {
            x: { type: "date", key: "x_date" },
            y: { type: "linear" },
            y2: { type: "linear" },
            y3: { type: "linear" }
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
        }
        //,
        // {
        //     y: "y_time",
        //     label: "Time",
        //     color: "#bcbd22",
        //     axis: "y",
        //     type: "line",
        //     thickness: "1px",
        //     dotSize: 2,
        //     id: "series_1"
        // }
        //,
        //  {
        //     y: "max",
        //     label: "Glucose Values",
        //     color: "blue",
        //     axis: "y",
        //     type: "line",
        //     thickness: "1px",
        //     dotSize: 2,
        //     id: "series_2"
        // }
        ],
        tooltip: {
            mode: "scrubber",
            formatter: function(x, y, series) {
                return x.getDate() + "." + x.getMonth() + "." + x.getFullYear() + " " + y + "mg/dl";
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
