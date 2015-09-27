'use strict';
var requestParms = {
  clientId: "DO5JJHGXBODWHZUZ2W45T0S35PKJH3MCLC1SKF5U4X3VF4YA",
  clientSecret: "GF0PDCNGEKSU2GI4ANGBGBKTEUU0G3E3QYPO5YWFXRV33GY5",
  version: "20131230"
};

angular.module('nightlifeApp')
  .factory('placesExplorerService', function ($resource) {

    var requestUri = 'https://api.foursquare.com/v2/venues/:action';

    return $resource(requestUri,
      {
        action: 'explore',
        client_id: requestParms.clientId,
        client_secret: requestParms.clientSecret,
        v: requestParms.version,
        venuePhotos: '1',
        callback: 'JSON_CALLBACK'
      },
      {
        get: { method: 'JSONP' }
      });

  });

angular.module('nightlifeApp')
  .controller('MainCtrl', function ($scope, placesExplorerService, Auth, $window, localStorageService) {
    $scope.awesomeThings = [];

    if(localStorageService.isSupported) {
      $scope.$city = localStorageService.get('city');
    }

    // check if city exists, if not give it the default value
    if (!$scope.$city) {
      $scope.$city = 'Munich';
    }

    var nightlifeId = '4d4b7105d754a06376d81259';

    $scope.getData = function() {
        localStorageService.set('city', $scope.$city);

        console.log('local STorage: ' + localStorageService.get('city'));

      if ($scope.$city.length > 2 ) {
        var offset = 0;

        placesExplorerService.get({
          near: $scope.$city,
          categoryId: nightlifeId,
          offset: offset
        }, function (placesResult) {

          if (placesResult.response.groups) {
            $scope.places = placesResult.response.groups[0].items;
            console.log($scope.places);
            for (var index = 0; index < $scope.places.length; index++) {
              if (!$scope.going.hasOwnProperty($scope.places[index].venue.id)) {
                $scope.going[$scope.places[index].venue.id] = [];
              }
            }
          }
          else {
            $scope.places = [];
          }
        });
      }
    };

    $scope.goingBar = function(id) {
      if(!Auth.isLoggedIn()) {
        $window.location.href = '/auth/twitter';
      } else {
        var i = $scope.going[id].indexOf(Auth.getCurrentUser().name);

        if ($scope.going[id].indexOf(Auth.getCurrentUser().name) == -1) {
          $scope.going[id].push(Auth.getCurrentUser().name);
        } else {
          $scope.going[id].splice(i, 1);
        }
        console.log($scope.going);
      }
    };

    var init = function() {
      $scope.going = {};
      $scope.getData();
    };

    init();
  });


