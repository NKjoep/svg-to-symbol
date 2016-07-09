console.info('app', new Date());

angular.module('app', [
  'ngResource'
])
.filter('rawHtml', ['$sce', function($sce){
  return function(val) {
    return $sce.trustAsHtml(val);
  };
}])
.factory('svgTransformFactory', function($resource) {
  return $resource('/api/convert-to-symbol', null,
    {
        'convert': {
          method: 'POST'
        }
    }
  );

})
.controller('Controller', function($scope, svgTransformFactory) {
  console.info('controller');
  $scope.textarea = '<svg>your svg code here</svg>';
  $scope.isLoading = false;
  $scope.change = function() {
    if ($scope.isLoading === false) {
      $scope.isLoading = true;
      svgTransformFactory.convert({svgData: $scope.textarea}).$promise
      .then(function (response) {
        $scope.input = $scope.textarea;
        // $scope.symbol = response.data.replace(`<symbol viewBox`, `<symbol id="symbol" viewBox`).replace(/\>\</g, '>\n<');
        $scope.symbol = response.data;
        $scope.icon = `
          <svg class="symbol-display">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#symbol"></use>
          </svg>
        `;

        $scope.isLoading = false;
      });
    }
  }

})
