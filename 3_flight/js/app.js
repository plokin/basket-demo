// Michal Wszolek - basket demo app - Flight

$(function() {

  var OfferUI = flight.component(function() {
  	this.defaultAttrs({
  		addSelector: '.add'
		});
 
    this.addToBasket = function (event, data) {
    	var additional_quantity = parseInt($(event.target).parent().find('.quantity').val());
	    if(!isNaN(additional_quantity)) {
	      this.trigger('uiAddToBasketAction', { item_id: $(event.target).parent().data("id"), item_count: additional_quantity });
	    }
    };

  	this.render = function (event, data) {
  		var html = '';
  		data.items.forEach( function(item, idx) {
	     	html += '<li data-id="'+idx+'">'+item.name+', €'+item.unit_price+' <input type="text" class="quantity" placeholder="quantity"> <a class="add">add</a> </li>';
	    });
	    this.$node.html(html);
  	};

    this.after('initialize', function() {
      this.on('dataOfferLoaded', this.render);
      this.on('click', {addSelector: this.addToBasket});
    });
  });


  var BasketUI = flight.component(function() {
  	this.defaultAttrs({
		  increaseSelector: '.increase',
		  decreaseSelector: '.decrease',
		  removeSelector:   '.remove'
		});

  	this.render = function (event, data) {
  		var html = '';
  		var total_quantity = 0;
  		data.items.forEach( function(item, idx) {
	      if(item.quantity > 0) {
	      	total_quantity += item.quantity;
	      	html += 
	      	'<li data-id="'+idx+'">'+item.name+', '+item.quantity+' * €'+item.unit_price+' = €'+(item.quantity * item.unit_price)
	      	+' <a class="basket-item-button increase">+</a> <a class="basket-item-button decrease">-</a> <a class="basket-item-button remove">remove</a></li>';
	     	}
	    });
	    this.$node.find('#basket-list').html(html);
	    if(total_quantity === 0) {
	    	this.$node.hide();
	    } else {
	    	this.$node.show();
	    }
  	};

    this.after('initialize', function() {
      this.on('dataBasketUpdated', this.render);
      this.on('click', {
    		increaseSelector: function(event, data) {this.trigger('uiAddToBasketAction', { item_id: $(event.target).parent().data("id"), item_count: 1 });},
    		decreaseSelector: function(event, data) {this.trigger('uiAddToBasketAction', { item_id: $(event.target).parent().data("id"), item_count: -1 });},
    		removeSelector: function(event, data) {this.trigger('uiRemoveFromBasketAction', { item_id: $(event.target).parent().data("id")});}
    	});
    });
  });


	var TotalPriceUI = flight.component(function() {
		this.updatePrice = function (event, data) {
  		var total = 0;
  		data.items.forEach( function(item, idx) {
	      total += item.quantity * item.unit_price;
	    });
	    this.$node.html(total);
  	};

		this.after('initialize', function() {
      this.on(document, 'dataBasketUpdated', this.updatePrice);
    });
  });


  var BasketData = flight.component(function() {
    // todo: load this as triggered event, listened by this component(?)
    var products = [
      { name: "smartphone", quantity: 0, unit_price: 200 },
      { name: "tablet", quantity: 0, unit_price: 350 },
      { name: "netbook", quantity: 0, unit_price: 400 },
      { name: "laptop", quantity: 0, unit_price: 1000 }
    ];
    
  	this.defaultAttrs({
  		items: products
  	});

  	this.changeQuantity = function (event, data) {
  		this.attr.items[data.item_id].quantity += data.item_count;
  		this.trigger('#basket', 'dataBasketUpdated', { items: this.attr.items });
  	};

  	this.clearQuantity = function (event, data) {
  		this.attr.items[data.item_id].quantity = 0;
  		this.trigger('#basket', 'dataBasketUpdated', { items: this.attr.items });
  	};

    this.after('initialize', function() {
      this.on('uiAddToBasketAction', this.changeQuantity);
      this.on('uiRemoveFromBasketAction', this.clearQuantity);
      this.trigger('#offer-list', 'dataOfferLoaded', { items: this.attr.items });
    });
  });


  OfferUI.attachTo('#offer-list');
  BasketUI.attachTo('#basket');
  TotalPriceUI.attachTo('#total-price');
  BasketData.attachTo(document);
});
