define(function (require, exports, module) {
  var nggrid = angular.module('nggrid', ['ui.grid']);
 	//var app = angular.module('app', ['ngAnimate', 'ngTouch', 'ui.grid']);
  var jsondata = require('./data');

  require('./ui-grid')

nggrid.controller('MainCtrl', ['$scope', '$http', 'uiGridConstants', function ($scope, $http, uiGridConstants) {
  $scope.gridOptions1 = {
    enableSorting: true,
    columnDefs: [
      { field: 'name' },
      { field: 'gender' },
      { field: 'company', enableSorting: false }
    ],
    onRegisterApi: function( gridApi ) {
      $scope.grid1Api = gridApi;
    }
  };
 
  $scope.toggleGender = function() {
    if( $scope.gridOptions1.data[64].gender === 'male' ) {
      $scope.gridOptions1.data[64].gender = 'female';
    } else {
      $scope.gridOptions1.data[64].gender = 'male';
    };
    $scope.grid1Api.core.notifyDataChange( uiGridConstants.dataChange.EDIT );
  };
 
   $scope.gridOptions2 = {
    enableSorting: true,
    onRegisterApi: function( gridApi ) {
      $scope.grid2Api = gridApi;
    },
    columnDefs: [
      {
        field: 'name',
        sort: {
          direction: uiGridConstants.DESC,
          priority: 1
        }
      },
      {
        field: 'gender',
        sort: {
          direction: uiGridConstants.ASC,
          priority: 0,
        },
        suppressRemoveSort: true,
        sortingAlgorithm: function(a, b, rowA, rowB, direction) {
          var nulls = $scope.grid2Api.core.sortHandleNulls(a, b);
          if( nulls !== null ) {
            return nulls;
          } else {
            if( a === b ) {
              return 0;
            }
            if( a === 'male' ) {
              return 1;
            }
            if( b === 'male' ) {
              return -1;
            }
            if( a == 'female' ) {
              return 1;
            }
            if( b === 'female' ) {
              return -1;
            }
            return 0;
          }
        }
      },
      { field: 'company', enableSorting: false  }
    ]
  };


      $scope.gridOptions1.data = jsondata;
      $scope.gridOptions2.data = jsondata;

      console.log( jsondata)
}]);
 	

	

    exports.init = function () {
        var $el = exports.$el;
        
        angular.bootstrap($el.get(0), ['nggrid']);
    };
});
