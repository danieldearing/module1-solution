(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.directive('foundItems', FoundItemsDirective)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com");


function FoundItemsDirective() {
	var ddo = {
		templateUrl: 'foundItems.html',
		scope: {
			items: '<',
			onRemove: '&'
		}
	};
	return ddo;
}

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController (MenuSearchService) {
	var menu = this;
	menu.isEmpty = false;
	
	menu.getItems = function() {
		if ( !menu.searchTerm ) {
			menu.found = []
			menu.isEmpty = true;
			return
		}

		menu.searchTerm = menu.searchTerm.toLowerCase()

		var promise = MenuSearchService.getMatchedMenuItems(menu.searchTerm);
		promise.then(function (result) {
			menu.found = result;
			if ( menu.found.length === 0 ) {
				menu.isEmpty = true;
			}
			else {
				menu.isEmpty = false;
			}
			return menu.found
		});
	};

	menu.removeItem = function(itemIndex) {
		menu.found.splice(itemIndex, 1);
	};

 };

function MenuSearchService($http, ApiBasePath) {
 	var service = this;

 	service.getMatchedMenuItems = function (searchTerm) {
 		service.foundItems = [];

		return $http({
			method: "GET",
			url: (ApiBasePath + '/menu_items.json'),
		}).then(function (result) {

			var items = result.data['menu_items'];
			for ( var i = 0; i < items.length; i++ ) {
				if ( items[i].description.includes(searchTerm) ) {
					service.foundItems.push(items[i]);
				};
			};
			return service.foundItems;

		}).catch(function (error) {
      console.log(error);
    });
 	};

};

})();
