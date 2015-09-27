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
  .controller('MainCtrl', function ($scope, placesExplorerService, Auth, $window, localStorageService, $http) {
    $scope.awesomeThings = [];

    var thisUser = [];
    var thisUserId = -1;

    if(localStorageService.isSupported) {
      $scope.$city = localStorageService.get('city');
    }

    // check if city exists, if not give it the default value
    if (!$scope.$city) {
      $scope.$city = 'Munich';
    }

    var nightlifeId = '4d4b7105d754a06376d81259';

    $scope.getData = function() {
        if(localStorageService.isSupported) {
          localStorageService.set('city', $scope.$city);
        }

      if ($scope.$city.length > 2 ) {
        var offset = 0;

        placesExplorerService.get({
          near: $scope.$city,
          categoryId: nightlifeId,
          offset: offset
        }, function (placesResult) {

          if (placesResult.response.groups) {
            $scope.places = placesResult.response.groups[0].items;
            resetGoing();
          }
          else {
            $scope.places = [];
          }
        });
      }
    };

    $scope.refreshing = function() {
      $scope.going = {};
      $scope.getGoing();
    };

    var resetGoing = function() {
      for (var index = 0; index < $scope.places.length; index++) {
        userToBar($scope.places[index].venue.id, 0);
      }
    };

    $scope.getGoing = function() {
      resetGoing();
      $http.get('api/going')
        .success(function (data) {
          for (var index = 0; index < data.length; index++) {
            if (data[index].userName === Auth.getCurrentUser().name) {
              thisUser = data[index].bars;
              thisUserId = data[index]._id;
            }
            for (var j = 0; j < data[index].bars.length; j++) {
              userToBar(data[index].bars[j], 1);
            }
          }
        }).error(function (data) {
          console.log('Error: ' + data);
        });
    };

    var userToBar = function (bar, change) {
      if (!$scope.going.hasOwnProperty(bar)) {
        $scope.going[bar] = change;
      } else {
        $scope.going[bar] += change;
      }
    };

    $scope.goingBar = function(id) {
      if (!Auth.isLoggedIn()) {
        localStorageService.set('bar', id);
        $window.location.href = '/auth/twitter';
      } else {
        var i = thisUser.indexOf(id);
        if (i == -1) {
          thisUser.push(id);
          userToBar(id, 1);
        } else {
          thisUser.splice(i, 1);
          userToBar(id, -1);
        }

        var updatedDoc;
        updatedDoc = {
          userName: Auth.getCurrentUser().name,
          bars: thisUser
        };

        if (thisUserId === -1) {
          $http.post('/api/going', updatedDoc)
            .success(function (data) {
              thisUserId = data._id;
            })
            .error(function(data) {
            })
        } else {
          $http.put('/api/going/' + thisUserId, updatedDoc)
            .success(function (data){
            })
            .error(function (data) {
            });
        }
      }
    };

    var init = function() {
      $scope.places = [];
      $scope.going = {};
      $scope.getData();
      $scope.getGoing();
    };

    init();
  });


