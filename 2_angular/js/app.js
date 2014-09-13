// Michal Wszolek - basket demo app - AngularJS

function BasketCtrl($scope) {
  var products = [
    { name: "smartphone", quantity: 0, unit_price: 200 },
    { name: "tablet", quantity: 0, unit_price: 350 },
    { name: "netbook", quantity: 0, unit_price: 400 },
    { name: "laptop", quantity: 0, unit_price: 1000 }
  ];

  $scope.offer = products;

  $scope.selectedFilter = function (location) {
    return location.quantity > 0;
  };

  $scope.getTotalPrice = function () {
    var sum = 0;
    $scope.offer.forEach( function(item, idx) {
      sum += item.quantity * item.unit_price;
    });
    return sum;
  };

  $scope.addToBasket = function(id) {
    var additional_quantity = parseInt($scope.offer[id].input_value);
    if(!isNaN(additional_quantity)) {
      $scope.offer[id].quantity += additional_quantity;
    }
  }
}