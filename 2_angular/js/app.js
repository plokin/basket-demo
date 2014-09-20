// Michal Wszolek - basket demo app - AngularJS

var products = [
  { name: "smartphone", quantity: 0, unit_price: 200 },
  { name: "tablet", quantity: 0, unit_price: 350 },
  { name: "netbook", quantity: 0, unit_price: 400 },
  { name: "laptop", quantity: 0, unit_price: 1000 }
];

angular.module('Basket', []).controller('BasketController', function($scope) { 
  $scope.offer = products;

  $scope.selectedFilter = function (product) {
    return product.quantity > 0;
  };

  $scope.getTotalPrice = function () {
    return $scope.offer.map(function(a){return a.quantity*a.unit_price;}).reduce(function(a,b) {return a+b;});
  };

  $scope.addToBasket = function(id) {
    var additional_quantity = parseInt($scope.offer[id].input_value);
    if(!isNaN(additional_quantity) && additional_quantity>0) {
      $scope.offer[id].quantity += additional_quantity;
    }
  }
});
