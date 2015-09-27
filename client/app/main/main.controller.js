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
  .controller('MainCtrl', function ($scope, placesExplorerService, $filter) {
    $scope.awesomeThings = [];

    $scope.$city = 'Munich';

    var nightlifeId = '4d4b7105d754a06376d81259';

    $scope.getData = function() {

        var offset = 0;

        placesExplorerService.get({
          near: $scope.$city,
          limit: $scope.pageSize,
          categoryId: nightlifeId,
          offset: offset
        }, function (placesResult) {

          if (placesResult.response.groups) {
            $scope.places = placesResult.response.groups[0].items;
            $scope.totalRecordsCount = placesResult.response.totalResults;
            console.log($scope.places);
          }
          else {
            $scope.places = [];
            $scope.totalRecordsCount = 0;
          }
        });

      // only try to get data if the input is at least 3 chars long
      if($scope.$city.length >= 3) {
        console.log($scope.$city);
      }
    };

    var init = function() {
      $scope.getData();
    };

    init();
  });


