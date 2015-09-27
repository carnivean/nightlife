'use strict';

angular.module('nightlifeApp')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.awesomeThings = [];


    $scope.getData = function() {


      // only try to get data if the input is at least 3 chars long
      if($scope.testData.length >= 3) {
        console.log($scope.testData);
      }

    }
  });
