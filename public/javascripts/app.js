angular.module('app', [
    'ngResource',
    'hljs'
  ])
  .filter('rawHtml', ['$sce', function($sce) {
    'use strict';
    return function(val) {
      return $sce.trustAsHtml(val);
    };
  }])
  .factory('svgTransformFactory', function($resource) {
    'use strict';
    return $resource('/api/convert-to-symbol', null, {
      'convert': {
        method: 'POST'
      }
    });
  })
  .service('uidService', function() {
    'use strict';
    return {
      getUuid: function() {
        // return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        return 'icon-xxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
          });
      }
    };
  })
  .controller('Controller', function($q, $scope, $window, svgTransformFactory, uidService) {
    'use strict';
    // $scope.textarea = getSampleSvg();
    $scope.isLoading = false;
    $scope.change = function() {
      if ($scope.isLoading === false) {
        $scope.message = undefined;
        $scope.isLoading = true;
        svgTransformFactory.convert({
            svgData: $scope.textarea
          }).$promise
          .then(elaborateResult, function() {
            $scope.isLoading = false;
            $scope.message = 'error.';
          });
      }
    };

    $scope.showCode = function(id) {
      var el = $window.document.getElementById(id);
      el = angular.element(el);
      el.toggleClass('hide');
    };

    $scope.results = [];

    function elaborateResult(response) {
      // $scope.symbol = response.data.replace(`<symbol viewBox`, `<symbol id="symbol" viewBox`).replace(/\>\</g, '>\n<');
      var uuid = uidService.getUuid();
      var svg = response.input;
      var compiledSamples = buildHtml(response.symbol, uuid);
      $scope.results.unshift({
        svg: svg,
        symbol: compiledSamples.symbol,
        icon: compiledSamples.icon,
        codeSample: compiledSamples.htmlExample,
        time: new Date()
      });
      $scope.isLoading = false;
    }

    function buildHtml(rawSymbolCode, uuid) {
      var data = {symbol: null, icon: null, htmlExample: null};
      var symbol = rawSymbolCode
        .replace('<symbol ', `<symbol id="${uuid}" `)
        .replace(/<title>.*<\/title>\s/, '')
        ;

      var icon = `<svg class="${uuid}">
 <use xlink:href="#${uuid}" xmlns:xlink="http://www.w3.org/1999/xlink"></use>
</svg>`;

      var symbolCode = symbol.split('\n');
      symbolCode.shift();
      symbolCode.pop();
      symbolCode = symbolCode.join('\n ');

      var htmlExample = `<!-- Embeded svg sprite reference -->
<svg display="none" xmlns="http://www.w3.org/2000/svg">
 ${symbolCode}
</svg>

<!-- Later in the code, use it... -->
${icon}`;

      data.symbol = symbol;
      data.icon = icon;
      data.htmlExample = htmlExample;
      return data;
    }

    function getSampleSvg() {
      return `<svg width="17px" height="20px" viewBox="0 0 17 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <g id="Artboard-1" transform="translate(-299.000000, -343.000000)" fill="#FFFFFF">
              <g id="store_apple" transform="translate(299.000000, 343.000000)">
                  <path d="M14.2375,10.6031034 C14.214125,8.1237931 16.3617917,6.91758621 16.4598958,6.86172414 C15.2436875,5.16724138 13.3584583,4.93551724 12.6961667,4.91724138 C11.1130417,4.75793103 9.57702083,5.82275862 8.77058333,5.82275862 C7.94785417,5.82275862 6.70579167,4.93275862 5.36739583,4.95896552 C3.64472917,4.98448276 2.03327083,5.93758621 1.149625,7.41758621 C-0.674333333,10.4351724 0.686020833,14.87 2.43347917,17.3089655 C3.3075625,18.5044828 4.32897917,19.8375862 5.66595833,19.7903448 C6.97389583,19.7396552 7.46264583,18.9941379 9.04116667,18.9941379 C10.6051667,18.9941379 11.0638125,19.7903448 12.4273542,19.7603448 C13.8312708,19.7396552 14.7149167,18.5603448 15.5585417,17.3548276 C16.568625,15.9862069 16.9745,14.6372414 16.9904375,14.567931 C16.9582083,14.5572414 14.265125,13.5741379 14.2375,10.6034483 L14.2375,10.6031034 Z M11.6616458,3.31241379 C12.3650208,2.47172414 12.8463333,1.32793103 12.7128125,0.166896552 C11.6945833,0.21 10.4213542,0.84 9.687875,1.66241379 C9.03904167,2.38689655 8.459625,3.57482759 8.6094375,4.69172414 C9.75339583,4.77310345 10.9274583,4.14034483 11.6616458,3.31241379 L11.6616458,3.31241379 Z" id="Shape"></path>
              </g>
          </g>
      </g>
  </svg>`;
    }


  });
