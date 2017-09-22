var app=angular.module('searchApp',['ngMaterial', 'ui.grid']);

app.factory('ajaxService', function($http) {
   return {
        getData: function(fromDate, toDate) {
           	//Tried adding the url as trusted, also tried callback wrap, it returns the data but not parsable
		var url = "http://104.197.128.152/data/adrequests?from="+fromDate+"&to="+toDate;//+"&callback=JSON_CALLBACK";
		//url = $sce.trustAsResourceUrl(url);
		$http({
		    method: 'jsonp',
		    url: url	
		}).success(function(response, status) {
        	       return JSON.decode(response.data); 
    		}).error(function(response, status) {
			return (status == 400) ? false : true;
		});
		return false;
        }
   }
});

app.controller('mainController',function($scope, $mdDialog, $http, ajaxService, $sce){
	$scope.fromDate = new Date();
	$scope.toDate = new Date();
  	$scope.search = function(ev) {
	   $scope.result = validateDates(ev);
	   //Call the URL only if dates are valid
	   if ($scope.result) {
	   	var day = $scope.fromDate.getDate();
		var month = $scope.fromDate.getMonth();
	  	var year = $scope.fromDate.getFullYear();
		//To make date format as yyyy-mm-dd
	  	var fromDate = year + "-" + ("0" + (month + 1)).slice(-2) + "-" + ("0" + day).slice(-2);
		day = $scope.toDate.getDate();
		month = $scope.toDate.getMonth();
	  	year = $scope.toDate.getFullYear();
		var toDate = year + "-" + ("0" + (month + 1)).slice(-2) + "-" + ("0" + day).slice(-2);

		//Service for ajax calls
		$scope.users = ajaxService.getData(fromDate, toDate);
		//if(!$scope.users) alertDialog('No data found or returned', ev);
		//Uncomment this for ui grid sample data if call didnt work
		$scope.users = [
			{ date: "2017-09-08", adrequest: 10},
			{ date: "2017-09-17", adrequest: 30},
			{ date: "2017-09-14", adrequest: 29}
		];
	    }
	};

	//Check the valid dates selection
	function validateDates(ev) {
           var today = new Date();
	   var diffDays = parseInt(($scope.toDate - $scope.fromDate) / (1000 * 60 * 60 * 24));
	   var diffFromToday = parseInt((today - $scope.fromDate) / (1000 * 60 * 60 * 24));
	   var diffToToday = parseInt((today - $scope.toDate) / (1000 * 60 * 60 * 24));
	   if (diffDays < 0) {
		alertDialog('To date should be after from date', ev);
		return false;		
	   }
	   if(diffFromToday < 0) {
		alertDialog('From date should be today and early date', ev);
		return false;
	   }
	   if(diffToToday < 0) {
		alertDialog('To date should be today and early date', ev); 
		return false;
	   }
	   return true;
	};

	//Alert dialog for warnings
	function alertDialog(message, ev) {
		$mdDialog.show(
		      $mdDialog.alert()
			.parent(angular.element(document.querySelector('#container')))
			.clickOutsideToClose(true)
			.textContent(message)
			.ariaLabel(message)
			.ok('Ok')
			.targetEvent(ev)
		 );
	};
});

